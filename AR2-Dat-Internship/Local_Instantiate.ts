import {Entity} from 'Entity';
import {Spawn_Events} from 'Game_Events';
import * as hz from 'horizon/core';

/**
 * Use for create any one entity like (dialog...)
 */
export class Instantiate
{
  private comp: hz.Component;
  private requestIndexer: number = 0;
  constructor(comp: hz.Component)
  {
    this.comp = comp;
  }

  public async CreateEntity(assetID: string)
  {
    let entityReturn: hz.Entity | undefined;
    let indexer = this.requestIndexer++;
    this.comp.sendNetworkBroadcastEvent(Spawn_Events.BuildEntity, {assetID: assetID, amount: 1, indexer: indexer});
    let tries = 0;
    const maxTries = 100; //100 tries at 100ms = 10 seconds
    let returnEvent = this.comp.connectNetworkBroadcastEvent(Spawn_Events.ReturnEntities, (data) =>
    {
      if(data.assetID == assetID)
      {
        entityReturn = data.entities[0];
      }
    })
    while(!entityReturn && tries < maxTries)
    {
      tries++;
      await new Promise((resolve) => this.comp.async.setTimeout(resolve, 100));
    }
    returnEvent.disconnect();
    entityReturn?.visible.set(false);
    return entityReturn;
  }
}
