import { PlayerDataProvider } from 'SD_SessionDataProvider';
import { DataKey } from 'SD_TypeConst';
import type { PlayerData } from 'SD_PlayerData';
import * as hz from 'horizon/core';

export class GoldManager {

  public static AddGold(amount: number, player: hz.Player): void {
    if (!player) {
      console.error("[GoldManager] Player not initialized! Call GoldManager.Init(player) first.");
      return;
    }

    let data = PlayerDataProvider.GetData<PlayerData>(player, DataKey.PlayerData);
    data.Coins += amount;
    PlayerDataProvider.SetData(player, data, true);
  }

  public static GetGold(player: hz.Player): number {
    if (!player) {
      console.error("[GoldManager] Player not initialized!");
      return 0;
    }

    const data = PlayerDataProvider.GetData<PlayerData>(player, DataKey.PlayerData);
    return data.Coins;
  }
}
