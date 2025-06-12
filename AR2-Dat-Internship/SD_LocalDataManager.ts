import * as hz from 'horizon/core';
import {DataKey, DataType} from 'SD_TypeConst';
import {PlayerData} from 'SD_PlayerData';
import {NetWork_Data_Event} from 'Game_Events';
import {PlayerDataProvider} from 'SD_SessionDataProvider';

export class SD_LocalDataManager 
{
  // A map that holds the all data. It is a map of player ids to a map of session data keys to data. It is for multiplayer, but we just use for 1 local player now
  SessionData: Map<number, Map<DataKey, any>> = new Map<number, Map<DataKey, any>>;

  private comp: hz.Component;
  private currentPlayer: hz.Player;

  constructor(comp: hz.Component, player: hz.Player)
  {
    this.comp = comp;
    this.currentPlayer = player;
    this.InitLocalData(this.currentPlayer);
  }

  InitLocalData(player: hz.Player)
  {
    this.comp.sendNetworkBroadcastEvent(NetWork_Data_Event.RequestData, {player: player, key: DataKey.PlayerData});
    this.comp.sendNetworkBroadcastEvent(NetWork_Data_Event.RequestData, {player: player, key: DataKey.Inventory});
    
    this.comp.connectNetworkBroadcastEvent(NetWork_Data_Event.ReceiveLocalData, (value) =>
    {
      this.SetSessionData(value.player, value.data);
    });
  }

  public GetData<TData extends DataType>(player: hz.Player, key: DataKey): TData
  {
    let playerMap = this.SessionData.get(player.id);
 
    if(playerMap == undefined)
    {
      throw new Error(`No session data found for player ${player.id}`);
    }
    let data = playerMap.get(key);
    // Returns a deep copy of the data to prevent modification of the original data.
    if(typeof data === 'object' && data)
    {
      return {...data} as TData;
    }
    // Returns the data as is if it is not an object.
    return data as TData;
  }

  public SetData<TData extends DataType>(player: hz.Player, data: TData): void
  {
    this.SetSessionData(player, data);
    this.comp.sendNetworkBroadcastEvent(NetWork_Data_Event.SetData, {player: player, key: data.Type, data: data});
  }

  private SetSessionData<TData extends DataType>(player: hz.Player, data: TData)
  {
    let playerMap = this.SessionData.get(player.id);
    if(playerMap == undefined)
    {
      playerMap = new Map<DataKey, any>();
    }
    playerMap.set(data.Type, data);

    this.SessionData.set(player.id, playerMap);
  }

  // DELETE ME: this just for test
  TestSetFunction(player: hz.Player)
  {
    let data = this.GetData<PlayerData>(player, DataKey.PlayerData);
    data.Coins += 1000;
    this.SetData(player, data);
  }
}
