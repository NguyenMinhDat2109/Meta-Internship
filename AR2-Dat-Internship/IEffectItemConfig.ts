
export interface IEffectItemConfig {
  /** Gets the unique ID. */
  Id: Readonly<string>;

  /** Max stack count. */
  MaxCount: Readonly<number>;

  /** Occurs when this booster is applied. */
  Begin(stackCount: number, duration: number): void;

  /** Occurs when this booster is expired (for booster with duration). */
  End(stackCount: number): void;
}

export class EffectItemConfig implements IEffectItemConfig {
  private readonly onBegin?: (stackCount: number, duration: number) => void;
  private readonly onEnd?: (stackCount: number) => void;

  Id: Readonly<string>;
  MaxCount: Readonly<number>;

  constructor(
    id: string,
    maxCount: number,
    onBegin?: (stackCount: number, duration: number) => void,
    onEnd?: (stackCount: number) => void,
  ) {
    this.Id = id;
    this.MaxCount = maxCount;
    this.onBegin = onBegin;
    this.onEnd = onEnd;
  }

  static CreateStackablePermanentConfig(id: string): IEffectItemConfig {
    return new EffectItemConfig(id, 999);
  }

  static CreateTemporaryConfig(
    id: string,
    onBegin?: (duration: number) => void,
    onExtend?: (duration: number) => void,
    onEnd?: () => void,
  ): IEffectItemConfig {
    return new EffectItemConfig(
      id,
      1,
      (stackCount, duration) => {
        if (stackCount === 1) {
          onBegin?.(duration);
        } else {
          onExtend?.(duration);
        }
      },
      (stackCount) => {
        if (stackCount === 1) {
          onEnd?.();
        }
      },
    );
  }

  Begin(stackCount: number, duration: number): void {
    this.onBegin?.(stackCount, duration);
  }

  End(stackCount: number): void {
    this.onEnd?.(stackCount);
  }
}
