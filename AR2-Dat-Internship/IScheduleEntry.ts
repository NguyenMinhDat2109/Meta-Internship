// Rainbow5s/IScheduleEntry.ts

import {IScheduleManager} from "IScheduleManager";

export interface IScheduleEntry {
  /**
   * Gets the unique ID.
   */
  Id: number;

  /**
   * Checks whether this entry is expired.
   */
  IsExpired: boolean;

  /**
   * Gets elapsed duration.
   */
  Elapsed: number;

  /**
   * Gets the total duration.
   */
  Duration: number;

  /**
   * Removes this entry.
   */
  Clear(): void;
}


export abstract class BaseScheduleEntry implements IScheduleEntry {
  public Id: number;
  public IsExpired: boolean = false;
  public Elapsed: number = 0;

  // Abstract property that must be implemented by subclasses.
  public abstract get Duration(): number;
  protected manager: IScheduleManager;

  constructor(manager: IScheduleManager, id: number) {
    this.manager = manager;
    this.Id = id;
  }

  public Clear(): void {
    this.manager.Clear(this.Id);
  }

  public ProcessUpdate(delta: number): void {
    this.Elapsed += delta;
  }
}

// Rainbow5s/Internal/LoopScheduleEntry.ts
export class LoopScheduleEntry extends BaseScheduleEntry {
  private interval: number;
  private action: (entry: IScheduleEntry) => void;
  private accumulatedDelta: number;

  public override get Duration(): number {
    return 0; // Duration is not used in loop entries
  }

  constructor(
    manager: IScheduleManager,
    id: number,
    interval: number,
    action: (entry: IScheduleEntry) => void
  ) {
    super(manager, id);
    this.interval = interval;
    this.action = action;
    this.accumulatedDelta = 0;
  }

  public override ProcessUpdate(delta: number): void {
    super.ProcessUpdate(delta);
    this.accumulatedDelta += delta;
    if (this.accumulatedDelta >= this.interval) {
      this.accumulatedDelta -= this.interval;
      this.action(this);
    }
  }
}

export class OnceScheduleEntry extends BaseScheduleEntry {
  private delay: number;
  private action: (entry: IScheduleEntry) => void;
  private accumulatedDelta: number;

  public override Duration: number;

  constructor(
    manager: IScheduleManager,
    id: number,
    delay: number,
    action: (entry: IScheduleEntry) => void
  ) {
    super(manager, id);
    this.Duration = delay;
    this.delay = delay;
    this.action = action;
    this.accumulatedDelta = 0;
  }

  public override ProcessUpdate(delta: number): void {
    super.ProcessUpdate(delta);
    this.accumulatedDelta += delta;
    if (this.accumulatedDelta >= this.delay) {
      this.IsExpired = true;
      this.action(this);
    }
  }
}

export class UpdateScheduleEntry extends BaseScheduleEntry {
  private action: (entry: IScheduleEntry, delta: number) => void;

  public override Duration: number = 0;

  constructor(
    manager: IScheduleManager,
    id: number,
    action: (entry: IScheduleEntry, delta: number) => void
  ) {
    super(manager, id);
    this.action = action;
  }

  public override ProcessUpdate(delta: number): void {
    super.ProcessUpdate(delta);
    this.action(this, delta);
  }
}


