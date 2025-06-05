import {CharacterManager} from 'CharacterManager';
import * as hz from 'horizon/core';
import {LootItem} from 'LootItem';
import {DelayTask_DistanceCheckTask} from 'IDelayTask_DistanceCheckTask';

export class LootItemConsumable extends LootItem
{
  private distanceCheckTask: DelayTask_DistanceCheckTask | undefined;

  start()
  {
    super.start();
  }
  protected override OnBeginHandle(): void
  {
    super.OnBeginHandle();
    const checkTarget = this.ServiceLocator.Resolve<CharacterManager>(CharacterManager).Player;
    this.ConnectCheckDistanceToUpdateProcess(checkTarget);
  }

  public async ConnectCheckDistanceToUpdateProcess(target: hz.Entity | hz.Player)
  {
    this.distanceCheckTask = new DelayTask_DistanceCheckTask(this.entity, target, () => this.ConnectFlyToTargetToProcessUpdate(target));
    this.DelayTaskController.AddTask(this.distanceCheckTask);
    await this.distanceCheckTask.promise;
  }
}
