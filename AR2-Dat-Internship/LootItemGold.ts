import {GoldManager} from 'GoldManager';
import {ENEMY_COIN_DEFAULT} from 'Enemy_Const';
import * as hz from 'horizon/core';
import {LootItem} from 'LootItem';
import {UI_IngameDialog} from 'UI_IngameDialog';

export class LootItemGold extends LootItem
{
  
 
  static propsDefinition = {
    ...LootItem.propsDefinition,
  };
  start()
  {
    super.start();
  }
  override async ConnectFlyToTargetToProcessUpdate(target: hz.Entity | hz.Player): Promise<void>
  {
    await super.ConnectFlyToTargetToProcessUpdate(target);
    const gold = GoldManager.GetGold();
    UI_IngameDialog.getInstance().SetCoin(gold);    
    this.Kill();
    return
  }
}
hz.Component.register(LootItemGold);
