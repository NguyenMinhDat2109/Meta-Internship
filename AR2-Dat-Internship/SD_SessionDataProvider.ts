import * as hz from 'horizon/core';
import {SD_LocalDataManager} from 'SD_LocalDataManager';
import {DataKey, DataType} from 'SD_TypeConst';

export class PlayerDataProvider
{
  static propsDefinition = {};

  // rivate static variable to hold the session data manager.
  private static sessionDataManager: SD_LocalDataManager | undefined = undefined;

  public static SetSessionDataManager(sessionDataManager: SD_LocalDataManager)
  {
    this.sessionDataManager = sessionDataManager;
  }

  public static GetData<TData extends DataType>(player: hz.Player, key: DataKey): TData
  {
    if(this.sessionDataManager == undefined)
    {
      throw new Error("SessionDataManager not set");
    }

    return this.sessionDataManager.GetData<TData>(player, key);
  }

  public static SetData<TData extends DataType>(player: hz.Player, data: TData, log: boolean = false): void
  {
    if(this.sessionDataManager == undefined)
    {
      throw new Error("SessionDataManager not set");
    }

    this.sessionDataManager.SetData<TData>(player, data);
  }
}
