import {Spawn_Events} from 'Game_Events';
import * as hz from 'horizon/core';

export class Local_PoolManager
{
  private pool: Map<string, Array<hz.Entity>> = new Map<string, Array<hz.Entity>>([]);
  private comp: hz.Component;
  private requestIndexer: number = 0;
  constructor(comp: hz.Component)
  {
    this.comp = comp;
  }

  public async CreateEntities(assetID: string, amount: number)
  {
    let entiesPool = this.pool.get(assetID) ?? [];
    let entitesReturn: hz.Entity[] = [];
    let poolSize = entiesPool.length;
    if(entiesPool.length >= amount)
    {
      entitesReturn = entiesPool.slice(0, amount);
      entiesPool.splice(0, amount);
      this.pool.set(assetID, entiesPool);
      return entitesReturn;
    }
    let indexer = this.requestIndexer++;
    this.comp.sendNetworkBroadcastEvent(Spawn_Events.BuildEntity, {assetID: assetID, amount: amount - poolSize, indexer: indexer});
    let tries = 0;
    const maxTries = 100; //100 tries at 100ms = 10 seconds
    let getEntites = false;

    let returnEvent = this.comp.connectNetworkBroadcastEvent(Spawn_Events.ReturnEntities, (data) =>
    {
      if(data.assetID == assetID && indexer == data.indexer)
      {
        getEntites = true;
        entitesReturn = data.entities;
      }
    })
    while(!getEntites && tries < maxTries)
    {
      tries++;
      await new Promise((resolve) => this.comp.async.setTimeout(resolve, 100));
    }
    returnEvent.disconnect();
    entitesReturn.concat(entiesPool.slice(0, entiesPool.length))
    entiesPool = [];
    this.pool.set(assetID, entiesPool);
    return entitesReturn;
  }

  public ReleaseEntity(assetID: string, entity: hz.Entity)
  {
    let entitiesPool = this.pool.get(assetID) ?? [];
    entitiesPool.push(entity);
    this.pool.set(assetID, entitiesPool);
  }

}
