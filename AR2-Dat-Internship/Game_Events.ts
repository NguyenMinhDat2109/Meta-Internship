import * as hz from 'horizon/core';
import {DataKey} from 'SD_TypeConst';

export const Spawn_Events = {
  BuildEntity: new hz.NetworkEvent<{assetID: string, amount: number, indexer: number}>('BuildEnemy'),
  ReleaseEntities: new hz.NetworkEvent<{entity: hz.Entity, asset: string}>('ReleaseEnemy'),
  ReturnEntities: new hz.NetworkEvent<{entities: Array<hz.Entity>, assetID: string, indexer: number}>('Enemies'),
}

 export const NetWork_Data_Event = { 
  RequestData: new hz.NetworkEvent<{player: hz.Player, key: DataKey}>("RequestData"),
  ReceiveLocalData: new hz.NetworkEvent<{player: hz.Player, data: any}>("SendAllData"),

  SetData: new hz.NetworkEvent<{player: hz.Player, key: DataKey , data: any}>("SetData"),
}