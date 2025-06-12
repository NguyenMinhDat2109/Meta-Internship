import {NetWork_Data_Event} from 'Game_Events';
import * as hz from 'horizon/core';
import {Inventory} from 'SD_Inventory ';
import {GameDataKey, INVENTORY_DATA, PersistentStorage, PLAYER_DATA} from 'SD_PersistentStorage';
import {PlayerData} from 'SD_PlayerData';
import {DataKey} from 'SD_TypeConst';

class GLOBAL_PlayerVariableSetter extends hz.Component<typeof GLOBAL_PlayerVariableSetter>
{
  // Storage will be init in preStart
  private persistentStorage!: PersistentStorage;

  preStart(): void
  {
    this.persistentStorage = new PersistentStorage(this.world.persistentStorage);
  }

  start()
  {
    this.connectNetworkBroadcastEvent(NetWork_Data_Event.SetData, (value) =>
    {
      switch(value.data.Type)
      {
        case DataKey.PlayerData:
          this.persistentStorage.SetPlayerVariable<PlayerData>(value.player, GameDataKey(PLAYER_DATA), value.data as any);
          break;
        case DataKey.Inventory:
          this.persistentStorage.SetPlayerVariable<Inventory>(value.player, GameDataKey(INVENTORY_DATA), value.data as any);
          break;
      }
    });

    this.connectNetworkBroadcastEvent(NetWork_Data_Event.RequestData, (value) =>
    {      
      let tempData = undefined;
      switch(value.key)
      {
        case DataKey.PlayerData:
          {
            tempData = this.ValidatePlayerData(value.player);
            break;
          }
        case DataKey.Inventory:
          {
            tempData = this.ValidateInventoryData(value.player);
            break;
          }
      }
      this.sendNetworkBroadcastEvent(NetWork_Data_Event.ReceiveLocalData, {player: value.player, data: tempData});
    });
  }

  private ValidatePlayerData(player: hz.Player): PlayerData
  {
    let playerData = this.persistentStorage.GetPlayerVariable<PlayerData>(player, GameDataKey(PLAYER_DATA));
    playerData = PlayerData.Validate(playerData);    
    return playerData;
  }

  private ValidateInventoryData(player: hz.Player): Inventory
  {
    let inventoryData = this.persistentStorage.GetPlayerVariable<Inventory>(player, GameDataKey(INVENTORY_DATA));
    inventoryData = Inventory.Validate(inventoryData);
    return inventoryData;
  }
}
hz.Component.register(GLOBAL_PlayerVariableSetter);