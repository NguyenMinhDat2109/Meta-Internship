import {ITask, TaskStatus} from "BehaviorTreeManager";
import {IActivator, IActivatorListener} from "CoolDownActivator";
import {IEntity} from "IEntity";
import {ITargetLocker, ITargetLockerListener} from "ITargetLocker";
import {ITimeMonitor} from "ITimeMonitor";

export class SkillAction implements IActivatorListener, ITask, ITargetLockerListener
{
  private timeMonitor: ITimeMonitor;
  private activator: IActivator;
  private targetLocker: ITargetLocker;
  private onActivate: (entities: Array<IEntity>) => Promise<void>;
  private onCast: (entities: Array<IEntity>) => Promise<void>;
  private onCasting: boolean;
  private onActivating: boolean;
  private target: Array<IEntity> = [];

  public constructor(timeMonitor: ITimeMonitor,
    activator: IActivator,
    targetLocker: ITargetLocker,
    onCast: (entities: Array<IEntity>) => Promise<void>,
    onActivate: (entities: Array<IEntity>) => Promise<void>)
  {
    this.timeMonitor = timeMonitor;
    this.activator = activator;
    this.targetLocker = targetLocker;
    this.onCast = onCast;
    this.onActivate = onActivate;

    // Initialize the activator and target locker
    this.targetLocker.Begin(this);
    this.onCasting = false;
    this.onActivating = false;
  }

  OnUpdate(): TaskStatus
  {
    this.activator.Update(this.timeMonitor.DeltaTime);
    this.targetLocker.OnUpdate(this.timeMonitor.DeltaTime);
    if(this.onCasting)
    {
      return TaskStatus.RUNNING;
    }
    if(this.onActivating)
    {
      return TaskStatus.SUCCESS;
    }
    return TaskStatus.FAILURE;
  }

  async OnActivate(): Promise<void>
  {
    await this.Cast();
    this.Activate();
  }

  async Activate(): Promise<void>
  {
    this.onActivating = true;
    // To do await activate skill...
    await this.onActivate?.(this.target);
    this.onActivating = false;
  }

  private async Cast(): Promise<void>
  {
    this.onCasting = true;
    //To do await cast skill...
    await this.onCast?.(this.target);
    this.onCasting = false;
  }

  public OnLockTarget(targets: Array<IEntity>): void
  {
    this.target = targets;
    this.activator.Begin(this);
  }

  public OnUnlockTarget(): void
  {
    this.target = [];
    this.activator.End();
  }
}
