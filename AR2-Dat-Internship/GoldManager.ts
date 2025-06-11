import { PlayerDataProvider } from 'SD_SessionDataProvider';
import { DataKey } from 'SD_TypeConst';
import type { PlayerData } from 'SD_PlayerData';
import * as hz from 'horizon/core';

export class GoldManager {
  private static player: hz.Player;
  public static Init(player: hz.Player): void {
    GoldManager.player = player;
  }

  public static AddGold(amount: number): void {
    if (!this.player) {
      console.error("[GoldManager] Player not initialized! Call GoldManager.Init(player) first.");
      return;
    }
    const player = this.player;

    let data = PlayerDataProvider.GetData<PlayerData>(player, DataKey.PlayerData);

    console.log("[GoldManager] Current Coins before adding:", data.Coins);
    data.Coins += amount;
    console.log(`[GoldManager] Added ${amount} coins. New total: ${data.Coins}`);

    PlayerDataProvider.SetData(player, data, true);
  }

  public static GetGold(): number {
    if (!this.player) {
      console.error("[GoldManager] Player not initialized!");
      return 0;
    }

    const data = PlayerDataProvider.GetData<PlayerData>(this.player, DataKey.PlayerData);
    return data.Coins;
  }
}
