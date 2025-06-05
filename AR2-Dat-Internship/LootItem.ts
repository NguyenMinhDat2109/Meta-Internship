import {Entity} from 'Entity';
import * as hz from 'horizon/core';
import {DelayTaskController} from 'IDelayTaskController';
import {DelayTask_BounceTask} from 'IDelayTask_BounceToTarget';
import {DelayTask_DistanceCheckTask} from 'IDelayTask_DistanceCheckTask';
import {DelayTask_MoveToTargetTask} from 'IDelayTask_MoveToTarget';


interface ILootItem
{
  SetupBounceToTarget(startPos: hz.Vec3, targetPos: hz.Vec3, bounceTime: number): void,
}
export class LootItem extends Entity<typeof LootItem> implements ILootItem
{
  private bounceTask: DelayTask_BounceTask | undefined;
  private moveTask: DelayTask_MoveToTargetTask | undefined;
  private delayTaskController: DelayTaskController | undefined;
  static propsDefinition = {};
  public get DelayTaskController(): DelayTaskController
  {
    if(!this.delayTaskController)
    {
      this.delayTaskController = this.ServiceLocator.Resolve<DelayTaskController>(DelayTaskController);
    }
    return this.delayTaskController;
  }

  start()
  {
    this.AddObserver({
      OnBegin: () =>
      {
        this.OnBeginHandle();

      },
      OnEnd: () =>
      {
        //Remove when function is done
        this.OnEndHandle();
      },
    });
  }

  public async SetupBounceToTarget(startPos: hz.Vec3, targetPos: hz.Vec3, bounceTime: number): Promise<void>
  {
    this.bounceTask = new DelayTask_BounceTask(this, startPos, targetPos, bounceTime);
    await this.bounceTask.promise;
    return;
  }

  protected Enable(enable: boolean)
  {
    this.entity.visible.set(enable);
  }

  protected OnBeginHandle()
  {
    this.Enable(true);
    this.DelayTaskController.AddTask(this.bounceTask!);
  }

  protected OnEndHandle()
  {
    this.Enable(false);
  }

  public async ConnectFlyToTargetToProcessUpdate(target: hz.Entity | hz.Player): Promise<void>
  {
    this.moveTask = new DelayTask_MoveToTargetTask(this, target);
    this.DelayTaskController.AddTask(this.moveTask);
    await this.moveTask.promise;
  }
}
