import {IScheduleManager, ScheduleManager} from "IScheduleManager";

export interface IActivatorListener
{
  OnActivate(): Promise<void>;
}

export interface IActivator
{
  /// Starts the cooldown and sets the one-time listener for when it ends
  Begin(listener: IActivatorListener): void;

  /// Call this every frame with deltaTime to update cooldown
  Update(deltaTime: number): void;

  /// Call this to end the cooldown
  End(): void;
}

export class SingleActivator implements IActivator
{
  Begin(listener: IActivatorListener): void
  {
    listener.OnActivate();
  }
  Update(deltaTime: number): void { }
  End(): void { }
}

export class CooldownActivator implements IActivator
{
  private readonly cooldownDuration: number;
  private active: boolean;
  private canFire: boolean;
  private listener?: IActivatorListener;
  private scheduleManager: IScheduleManager;

  constructor(cooldownDuration: number)
  {
    if(cooldownDuration <= 0)
    {
      throw new Error("Cooldown duration must be greater than 0.");
    }
    this.cooldownDuration = cooldownDuration;
    this.active = false;
    this.canFire = true;
    this.scheduleManager = new ScheduleManager();
  }


  /** Call every frame with deltaTime to update cooldown */
  Update(deltaTime: number): void
  {
    if(!this.active) return;
    this.scheduleManager.ProcessUpdate(deltaTime);
  }

  private async Activate(): Promise<void>
  {
    if(!this.active)
    {
      // Not active
      return;
    }
    this.canFire = false;
    await this.listener?.OnActivate();
    this.WaitToActivate();
  }

  WaitToActivate(): void
  {
    this.scheduleManager.ScheduleOnce(this.cooldownDuration, () =>
    {
      this.canFire = true;
      this.Activate();
    });
  }

  /** Starts the cooldown and sets the one-time listener for when it ends */
  async Begin(listener: IActivatorListener): Promise<void>
  {
    this.listener = listener;
    if(this.active)
    {
      // Already active.
      return;
    }
    this.active = true;

    if(!this.canFire)
    {
      // Cooldown is still active.
      return;
    }
    this.WaitToActivate();
  }

  /** Call this to end the cooldown */
  End(): void
  {
    this.active = false;
    this.listener = undefined;
  }
}