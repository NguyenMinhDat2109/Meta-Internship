import * as hz from 'horizon/core';
import {LootItem} from 'LootItem';
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
    this.Kill();
    return
  }
}
hz.Component.register(LootItemGold);
