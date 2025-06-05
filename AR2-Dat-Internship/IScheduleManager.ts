import {IActivityManager} from "IActivityManager";
import {BaseScheduleEntry, IScheduleEntry, LoopScheduleEntry, OnceScheduleEntry, UpdateScheduleEntry} from "IScheduleEntry";

export interface IScheduleManager
{
  /** Schedules a loop action. */
  Schedule(interval: number, action: (entry: IScheduleEntry) => void): IScheduleEntry;

  /** Schedules a single-fire action. */
  ScheduleOnce(delay: number, action: (entry: IScheduleEntry) => void): IScheduleEntry;

  /** Schedules an update action. */
  ScheduleUpdate(action: (entry: IScheduleEntry, delta: number) => void): IScheduleEntry;

  /** Removes a scheduled action. */
  Clear(id: number): void;

  /** Removes all actions. */
  ClearAll(): void;

  ProcessUpdate(delta: number): void;
}

export class ManagedScheduleManager implements IScheduleManager
{
  private readonly manager: IScheduleManager;

  constructor(manager: IScheduleManager)
  {
    this.manager = manager;
  }

  Schedule(interval: number, action: (entry: IScheduleEntry) => void): IScheduleEntry
  {
    return this.manager.Schedule(interval, action);
  }

  ScheduleOnce(delay: number, action: (entry: IScheduleEntry) => void): IScheduleEntry
  {
    return this.manager.ScheduleOnce(delay, action);
  }

  ScheduleUpdate(action: (entry: IScheduleEntry, delta: number) => void): IScheduleEntry
  {
    return this.manager.ScheduleUpdate(action);
  }

  Clear(id: number): void
  {
    this.manager.Clear(id);
  }

  ClearAll(): void
  {
    this.manager.ClearAll();
  }

  ProcessUpdate(delta: number): void
  {
    this.manager.ProcessUpdate(delta);
  }
}

export class ScheduleManager implements IScheduleManager
{
  private entries: Map<number, BaseScheduleEntry> = new Map();
  private expiredEntries: number[] = [];
  private counter: number = 0;

  Schedule(interval: number, action: (entry: IScheduleEntry) => void): IScheduleEntry
  {
    const id = this.counter++;
    const entry = new LoopScheduleEntry(this, id, interval, action);
    this.entries.set(id, entry);
    return entry;
  }

  ScheduleOnce(delay: number, action: (entry: IScheduleEntry) => void): IScheduleEntry
  {
    const id = this.counter++;
    const entry = new OnceScheduleEntry(this, id, delay, action);
    this.entries.set(id, entry);
    return entry;
  }

  ScheduleUpdate(action: (entry: IScheduleEntry, delta: number) => void): IScheduleEntry
  {
    const id = this.counter++;
    const entry = new UpdateScheduleEntry(this, id, action);
    this.entries.set(id, entry);
    return entry;
  }

  Clear(id: number): void
  {
    const entry = this.entries.get(id);
    if(entry)
    {
      entry.IsExpired = true;
    }
  }

  ClearAll(): void
  {
    this.entries.clear();
    this.expiredEntries = [];
  }

  ProcessUpdate(delta: number): void
  {
    this.expiredEntries = [];

    // Assuming _entries is a Map
    this.entries.forEach((entry, key) =>
    {
      if(!entry.IsExpired)
      {
        entry.ProcessUpdate(delta);
      }
      if(entry.IsExpired)
      {
        this.expiredEntries.push(key);
      }
    });

    for(const id of this.expiredEntries)
    {
      this.entries.delete(id);
    }
  }
}

export class ScheduleManagerExtensions
{
  static ToManaged(manager: IScheduleManager): IScheduleManager
  {
    return new ManagedScheduleManager(manager);
  }

  static Schedule(manager: IScheduleManager, interval: number, action: (id: number) => void): number
  {
    return manager.Schedule(interval, (entry) => action(entry.Id)).Id;
  }

  static ScheduleOnce(manager: IScheduleManager, delay: number, action: (id: number) => void): number
  {
    return manager.ScheduleOnce(delay, (entry) => action(entry.Id)).Id;
  }

  static ScheduleUpdate(manager: IScheduleManager, action: (id: number, delta: number) => void): number
  {
    return manager.ScheduleUpdate((entry, delta) => action(entry.Id, delta)).Id;
  }

  static async ScheduleOnceAsync(manager: IScheduleManager, delay: number): Promise<IScheduleEntry>
  {
    return new Promise((resolve) =>
    {
      manager.ScheduleOnce(delay, (entry) => resolve(entry));
    });
  }
};

export class ScheduleActivity implements IActivityManager
{
  private readonly scheduleManager: IScheduleManager;
  constructor(scheduleManager: IScheduleManager)
  {
    this.scheduleManager = scheduleManager;
  }
  ProcessUpdate(deltaTime: number): void
  {
    this.scheduleManager.ProcessUpdate(deltaTime);
  }
}
