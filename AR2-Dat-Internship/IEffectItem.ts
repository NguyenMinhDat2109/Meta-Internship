import {IEffectItemConfig} from "IEffectItemConfig";
import {EffectManager} from "IEffectManager";
import {IObserverManager, ObserverManager} from "IObserverManager";

export type EffectItemObserver = {
  OnCountChanged?: (oldCount: number, newCount: number) => void;
  OnBegin?: () => void;
  OnEnd?: () => void;
};

export interface IEffectItem extends IObserverManager<EffectItemObserver> {
  /**
   * Gets the unique ID.
   */
  Id: Readonly<string>;

  /**
   * Gets the current stackable count.
   */
  Count: Readonly<number>;

  /**
   * Gets the current stackable amount.
   */
  Amount: Readonly<number>;

  /**
   * Gets the effect duration.
   */
  Duration: Readonly<number>;

  /**
   * Checks whether this effect is effective.
   */
  IsEffective: Readonly<boolean>;

  /**
   * Gets elapsed duration.
   */
  ElapsedDuration: Readonly<number>;

  /**
   * Applies this effect.
   */
  Apply(duration: number, count?: number, amount?: number): void;

  /**
   * Stops this effect.
   */
  Stop(all: boolean): void;
}

export class EffectItem extends ObserverManager<EffectItemObserver> implements IEffectItem {
  private readonly config: Readonly<IEffectItemConfig>;
  private readonly effectManager: Readonly<EffectManager>;

  public get Id(): Readonly<string> {
    return this.config.Id;
  }

  public get Count(): Readonly<number> {
    return this.effectManager.GetCountInternal(this.Id);
  }

  public get Amount(): Readonly<number> {
    return this.effectManager.GetAmountInternal(this.Id);
  }

  public get Duration(): Readonly<number> {
    return this.effectManager.GetDurationInternal(this.Id);
  }

  public get IsEffective(): Readonly<boolean> {
    return this.effectManager.IsEffectiveInternal(this.Id);
  }

  public get ElapsedDuration(): Readonly<number> {
    return this.effectManager.GetElapsedDurationInternal(this.Id);
  }

  constructor(config: Readonly<IEffectItemConfig>, effectManager: Readonly<EffectManager>) {
    super();
    this.config = config;
    this.effectManager = effectManager;
  }

  public Apply(duration: number, count: number = 1, amount: number = 0): void {
    for (let i = 0; i < count; ++i) {
      this.effectManager.ApplyInternal(this, this.config, duration, amount);
    }
  }

  public Stop(all: boolean): void {
    this.effectManager.StopInternal(this, this.config, all);
  }
}
