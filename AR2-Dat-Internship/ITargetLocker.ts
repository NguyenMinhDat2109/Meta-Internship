import {IAimStrategy} from "IAimStrategy";
import {IEntity} from "IEntity";

export interface ITargetLockerListener
{
  OnLockTarget(target: Array<IEntity>): void; // Improve me make IDamageReceiver instead of IEntity.
  OnUnlockTarget(): void;
}

export interface ITargetLocker
{
  Begin(listener: ITargetLockerListener): void;
  End(): void;
  OnUpdate(deltaTime: number): void;
}

export class TargetLocker implements ITargetLocker
{
  private readonly range: number;
  private readonly aimStrategy: IAimStrategy;
  private listener: ITargetLockerListener | undefined;
  private targets: Array<IEntity> | undefined;

  constructor(aimStrategy: IAimStrategy, range: number)
  {
    this.aimStrategy = aimStrategy;
    this.range = range;
  }

  Begin(listener: ITargetLockerListener): void
  {
    this.listener = listener;
  }

  End(): void
  {
    this.listener = undefined;
  }

  OnUpdate(deltaTime: number): void
  {
    var targets = this.aimStrategy.FindTarget(this.range);
    if(targets.length > 0)
    {
      this.listener?.OnLockTarget(targets);
    } else
    {
      if(this.targets !== undefined)
      {
        this.listener?.OnUnlockTarget();
      }
    }
    this.targets = targets;
  }
}
