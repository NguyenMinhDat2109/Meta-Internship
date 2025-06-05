import {CharacterLevelManager} from 'CharacterLevelManager';
import {ENEMY_EXP_DEFAULT} from 'Enemy_Const';
import * as hz from 'horizon/core';
import {LootItem} from 'LootItem';

export class LootItemExperience extends LootItem
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
hz.Component.register(LootItemExperience);
