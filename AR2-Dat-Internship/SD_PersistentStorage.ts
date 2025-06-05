import * as hz from 'horizon/core';

export const PLAYER_DATA: string = "PlayerData";
export const INVENTORY_DATA: string = "Inventory";

const GAMEDATA_PERSISTENT_GROUP: string = "AR2 - Magetech";

export function GameDataKey(variable_key: string): string {
  return `${GAMEDATA_PERSISTENT_GROUP}: ${variable_key}`;
}

export class PersistentStorage
{
  constructor(private readonly persistentStorage: hz.IPersistentStorage) {}

  public GetPlayerVariable<T extends hz.PersistentSerializableState>(player: hz.Player, key: string): T
  {
    return this.persistentStorage.getPlayerVariable(player, key) as T;
  }

  public SetPlayerVariable<T extends hz.PersistentSerializableState>(player: hz.Player, key: string, variable: T)
  {
    console.log(`${key} set data ${JSON.stringify(variable)}`)
    this.persistentStorage.setPlayerVariable(player, key, variable);
  }
}