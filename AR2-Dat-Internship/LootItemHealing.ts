import {CharacterManager} from 'CharacterManager';
import * as hz from 'horizon/core';
import {LootItem} from 'LootItem';
import {LootItemConsumable} from 'LootItemConsumable';
import {ServiceLocator} from 'ServiceLocator';
import {HEAL_CONFIG} from 'Skill_Const';

const HEAL_AMOUNT = 0.15;
export class LootItemHealing extends LootItemConsumable
{
  static propsDefinition = {
    ...LootItem.propsDefinition,
  };
  serviceLocate: CharacterManager | undefined;
  start()
  {
    super.start();
  }

  override async ConnectFlyToTargetToProcessUpdate(target: hz.Entity | hz.Player): Promise<void>
  {
    await super.ConnectFlyToTargetToProcessUpdate(target);
    this.ServiceLocator.Resolve<CharacterManager>(CharacterManager).HealReceive.Heal(true, HEAL_CONFIG.NormalHeal);
    this.Kill();
    return;
  }
  // override ConnectCheckDistanceToUpdateProcess(target: hz.Entity | hz.Player)
  // {
  //   super.ConnectCheckDistanceToUpdateProcess(target, () =>
  //   {
  //     this.ServiceLocator.Resolve<CharacterManager>(CharacterManager).HealReceive.Heal(true, HEAL_CONFIG.NormalHeal);
  //     this.Kill();
  //   });
  // }
}
hz.Component.register(LootItemHealing);

