
import {IObserverManager, ObserverManager} from "./IObserverManager";
import {EffectItem, IEffectItem} from "./IEffectItem";
import {IEffectItemConfig} from "IEffectItemConfig";
import {Assert} from "Utilities";
import {IScheduleManager, ScheduleManagerExtensions} from "IScheduleManager";
import {IScheduleEntry} from "IScheduleEntry";
import {ObserverHandle} from "ObserverHandle";

export type EffectManagerObserver = {
  OnItemCountChanged?: (item: IEffectItem, oldCount: number, newCount: number) => void;
  OnItemBegin?: (item: IEffectItem) => void;
  OnItemEnd?: (item: IEffectItem) => void;
};

export interface IEffectManager extends IObserverManager<EffectManagerObserver>
{
  /**
   * Gets the specified effect.
   */
  GetItem(id: string): IEffectItem | null;

  /**
   * Stops all effects.
   */
  StopAll(): void;

  /**
   * Disposes the manager.
   */
  Dispose(): void;
}

export class EffectManagerExtensions
{
  /**
   * Combines two effect managers into one.
   */
  public static Combine(manager: IEffectManager, other: IEffectManager): IEffectManager
  {
    return new MultiEffectManager(manager, other);
  }

  private static GetItemInternal(manager: IEffectManager, id: string): IEffectItem
  {
    const item = manager.GetItem(id);
    if(!item)
    {
      console.error("Invalid booster");
      throw new Error("Invalid booster");
    }
    return item;
  }

  /**
   * Gets the current stackable amount.
   */
  public static GetItemCount(manager: IEffectManager, id: string): number
  {
    return this.GetItemInternal(manager, id).Amount;
  }

  /**
   * Gets the current stackable amount.
   */
  public static GetItemAmount(manager: IEffectManager, id: string): number
  {
    return this.GetItemInternal(manager, id).Amount;
  }

  /**
   * Gets the effect duration.
   */
  public static GetItemDuration(manager: IEffectManager, id: string): number
  {
    return this.GetItemInternal(manager, id).Duration;
  }

  /**
   * Checks whether the specified effect is effective.
   */
  public static IsItemEffective(manager: IEffectManager, id: string): boolean
  {
    return this.GetItemInternal(manager, id).IsEffective;
  }

  /**
   * Gets the effect elapsed duration.
   */
  public static GetItemElapsedDuration(manager: IEffectManager, id: string): number
  {
    return this.GetItemInternal(manager, id).ElapsedDuration;
  }

  /**
   * Applies the specified effect.
   */
  public static ApplyItem(
    manager: IEffectManager,
    id: string,
    duration: number,
    count: number = 1,
    amount: number = 0
  ): void
  {
    this.GetItemInternal(manager, id).Apply(duration, count, amount);
  }

  /**
   * Stops the specified effect.
   */
  public static StopItem(manager: IEffectManager, id: string, all: boolean): void
  {
    this.GetItemInternal(manager, id).Stop(all);
  }
}


type Entry = {
  Item: IEffectItem;
  Amount: number;
  ScheduleManager: IScheduleManager;
  Entries: Array<[IScheduleEntry, number]>;
};

export class EffectManager extends ObserverManager<EffectManagerObserver> implements IEffectManager
{
  private readonly entries: Readonly<Record<string, Entry>>;

  constructor(scheduleManager: IScheduleManager, configs: ReadonlyArray<IEffectItemConfig>)
  {
    super();
    const entries: Record<string, Entry> = {};
    for(const config of configs)
    {
      entries[config.Id] = {
        Item: new EffectItem(config, this),
        Amount: 0,
        ScheduleManager: ScheduleManagerExtensions.ToManaged(scheduleManager),
        Entries: [],
      };
    }
    this.entries = entries;
  }

  public Dispose(): void
  {
    for(const key in this.entries)
    {
      this.entries[key].ScheduleManager.ClearAll();
    }
  }

  public GetItem(id: string): IEffectItem | null
  {
    return this.entries[id]?.Item ?? null;
  }

  public GetCountInternal(id: string): number
  {
    return this.entries[id].Entries.length;
  }

  public GetAmountInternal(id: string): number
  {
    return this.entries[id].Amount;
  }

  public GetDurationInternal(id: string): number
  {
    const entry = this.entries[id];
    if(entry.Entries.length === 0)
    {
      return 0;
    }
    const [scheduleEntry] = entry.Entries[entry.Entries.length - 1];
    return scheduleEntry.Duration;
  }

  public IsEffectiveInternal(id: string): boolean
  {
    return this.entries[id].Entries.length > 0;
  }

  public GetElapsedDurationInternal(id: string): number
  {
    const entry = this.entries[id];
    if(entry.Entries.length === 0)
    {
      return 0;
    }
    const [scheduleEntry] = entry.Entries[entry.Entries.length - 1];
    return scheduleEntry.Elapsed;
  }

  public ApplyInternal(item: IEffectItem, config: IEffectItemConfig, duration: number, amount: number): void
  {
    const entry = this.entries[item.Id];
    const scheduleManager = entry.ScheduleManager;
    const scheduleEntry = scheduleManager.ScheduleOnce(duration, (e) =>
    {
      this.RemoveEntry(item, config, e, amount);
    });
    this.AddEntry(item, config, scheduleEntry, amount);
  }

  private AddEntry(item: IEffectItem, config: IEffectItemConfig, scheduleEntry: IScheduleEntry, amount: number): void
  {
    const entry = this.entries[item.Id];
    entry.Entries.push([scheduleEntry, amount]);
    entry.Amount += amount;
    const count = entry.Entries.length;
    item.DispatchEvent((observer) => observer.OnCountChanged?.(count, +1));
    this.DispatchEvent((observer) => observer.OnItemCountChanged?.(item, count, +1));
    config.Begin(count, scheduleEntry.Duration);
    item.DispatchEvent((observer) => observer.OnBegin?.());
    this.DispatchEvent((observer) => observer.OnItemBegin?.(item));

    if(entry.Entries.length > config.MaxCount)
    {
      const [oldScheduleEntry, oldAmount] = entry.Entries[0];
      this.RemoveEntry(item, config, oldScheduleEntry, oldAmount);
    }
  }

  private RemoveEntry(item: IEffectItem, config: IEffectItemConfig, scheduleEntry: IScheduleEntry, amount: number): void
  {
    const entry = this.entries[item.Id];
    Assert.IsTrue(entry.Entries.length > 0, "Entry list must not be empty");
    const count = entry.Entries.length;
    config.End(count);
    item.DispatchEvent((observer) => observer.OnEnd?.());
    this.DispatchEvent((observer) => observer.OnItemEnd?.(item));

    entry.Amount -= amount;
    const index = entry.Entries.findIndex(([entry, a]) => entry === scheduleEntry && a === amount);
    if(index !== -1)
    {
      entry.Entries.splice(index, 1);
    }
    scheduleEntry.Clear();
    item.DispatchEvent((observer) => observer.OnCountChanged?.(count, -1));
    this.DispatchEvent((observer) => observer.OnItemCountChanged?.(item, count, -1));
  }

  public StopInternal(item: IEffectItem, config: IEffectItemConfig, all: boolean): void
  {
    const entry = this.entries[item.Id];
    if(entry.Entries.length === 0)
    {
      return;
    }
    if(all)
    {
      while(entry.Entries.length > 0)
      {
        const [scheduleEntry, amount] = entry.Entries[0];
        this.RemoveEntry(item, config, scheduleEntry, amount);
      }
    } else
    {
      const [scheduleEntry, amount] = entry.Entries[0];
      this.RemoveEntry(item, config, scheduleEntry, amount);
    }
  }

  public StopAll(): void
  {
    for(const key in this.entries)
    {
      this.entries[key].Item.Stop(true);
    }
  }
}

export class MultiEffectManager extends ObserverManager<EffectManagerObserver> implements IEffectManager
{
  private readonly managers: ReadonlyArray<IEffectManager>;
  private readonly handle: ObserverHandle;

  constructor(...managers: ReadonlyArray<IEffectManager>)
  {
    super();
    this.managers = managers;
    this.handle = new ObserverHandle();
    for(const manager of this.managers)
    {
      this.handle.AddObserver(manager, {
        OnItemBegin: (item) =>
        {
          this.DispatchEvent((observer) => observer.OnItemBegin?.(item));
        },
      });
    }
  }

  public Dispose(): void
  {
    for(const manager of this.managers)
    {
      manager.Dispose();
    }
    this.handle.Dispose();
  }

  public GetItem(id: string): IEffectItem | null
  {
    for(const manager of this.managers)
    {
      const item = manager.GetItem(id);
      if(item !== null)
      {
        return item;
      }
    }
    return null;
  }

  public StopAll(): void
  {
    for(const manager of this.managers)
    {
      manager.StopAll();
    }
  }
}


