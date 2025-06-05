import {Spawn_Events} from 'Game_Events';
import * as hz from 'horizon/core';
import {ObjectPoolManagerSingleton} from 'ObjectPoolManagerSingleton';
import {WaitForOwnerShipTransfer, WaitForOwnerShipTransferMultiple} from 'Utilities';

class Global_EntitySpawnerManager extends hz.Component<typeof Global_EntitySpawnerManager>
{
  static propsDefinition = {};

  private currentPlayer: hz.Player | undefined;

  start()
  {
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterWorld, (player) =>
    {
      this.currentPlayer = player;

    });
    this.connectNetworkBroadcastEvent(Spawn_Events.BuildEntity, (data) => this.BuildEntity(data.assetID, data.amount, data.indexer));
    this.connectNetworkBroadcastEvent(Spawn_Events.ReleaseEntities, (data) =>
    {
      ObjectPoolManagerSingleton.instance.Release(new hz.Asset(BigInt(data.asset)), data.entity);
    })
  }

  private async BuildEntity(assetID: string, amount: number, indexer: number)
  {
    this.CreateEntities(assetID, amount, indexer);
  }

  private async RegisterAsset(asset: hz.Asset)
  {
    await ObjectPoolManagerSingleton.instance.RegisterAsset(asset);
  }

  private async CreateEntities(assetID: string, amount: number, indexer: number)
  {
    let asset = new hz.Asset(BigInt(assetID));
    await this.RegisterAsset(asset);
    let taskPromise = [];
    for(let i = 0; i < amount; i++)
    {
      let acquire = this.AcquireEntity(asset);
      taskPromise.push(acquire);
    }
    Promise.all(taskPromise).then((results) =>
    {
      // console.log(`Global_EntitySpawnerManager: result = ${results}`);
      this.sendNetworkBroadcastEvent(Spawn_Events.ReturnEntities, {entities: results, assetID: assetID, indexer: indexer})
    })
      .catch((error) =>
      {
        console.error('Global_EntitySpawnerManager: waiting was error', error);
      });
  }

  private async AcquireEntity(asset: hz.Asset)
  {
    let entity = await ObjectPoolManagerSingleton.instance.Acquire(asset);
    // console.log(`Global_EntitySpawnerManager: Aquire Asset ${asset}`)
    // IMPROVE ME: not set owner here, need to move to local scripts to set specific owner for player
    if(this.currentPlayer)
    {
      entity.owner.set(this.currentPlayer);
      let children = entity.children.get();
      for(const it of children)
      {
        it.owner.set(this.currentPlayer);
      }
      await WaitForOwnerShipTransferMultiple([...children, entity], this.currentPlayer, this);
    }
    return entity;
  }
}
hz.Component.register(Global_EntitySpawnerManager);