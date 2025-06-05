import {SkillCharacterStatsID, SkillRecoveryID} from "Config_Skills";
import {IDamageReceiverObservable} from "IDamageReceiver";
import {IEffectManager} from "IEffectManager";
import {IAttackBehaviorConfig, IBodyConfig} from "IEntityConfig";
import {IHealReceiverObservable} from "IHealReceiver";
import {IObserverManager, ObserverManager} from "IObserverManager";
import {ObserverHandle} from "ObserverHandle";
import {HEAL_CONFIG} from "Skill_Const";

export enum Stats
{
  Health = "Health",
  MaxHealth = "MaxHealth",
  HealthBonus = "HealthBonus",
  HealthMultiplier = "HealthMultiplier",

  MovementSpeed = "MovementSpeed",
  MovementSpeedMultiplier = "MovementSpeedMultiplier",

  Damage = "Damage",
  DamageBonus = "DamageBonus",
  DamageMultiplier = "DamageMultiplier",
  AttackSpeed = "AttackSpeed",
  AttackSpeedMultiplier = "AttackSpeedMultiplier",

  CriticalRate = "CriticalRate",
  CriticalRateBonus = "CriticalRateBonus",

  CriticalDamage = "CriticalDamage",
  CriticalDamageBonus = "CriticalDamageBonus",

  Defense = "Defense",
  DefenseBonus = "DefenseBonus",

  BoostHeartHealing = "BoostHeartHealing",
  // RangedDefense = "RangedDefense",

  DodgeRate = "DodgeRate",
  DodgeRateBonus = "DodgeRateBonus",
}


export class StatsManagerObserver
{
  public OnStatsChanged?: (stat: string, value: number) => void;
}

export interface IStatsManager extends IObserverManager<StatsManagerObserver>
{
  GetStats(stat: string): number;
  Dispose(): void;
}

export class StatsManagerExtension
{
  static WithBody(
    statsManager: IStatsManager,
    config: IBodyConfig,
    damageReceiver: IDamageReceiverObservable,
    healthPercentage: number,
    healReceiver?: IHealReceiverObservable,
  ): IStatsManager
  {
    return new BodyStatsManager(statsManager, config, damageReceiver, healthPercentage, healReceiver);
  }

  static WithAttack(
    statsManager: IStatsManager,
    config: IAttackBehaviorConfig,
  ): IStatsManager
  {
    return new AttackStatsManager(statsManager, config);
  }
}

export class StatsManager extends ObserverManager<StatsManagerObserver> implements IStatsManager
{
  private readonly effectManager: IEffectManager;
  private readonly handle: ObserverHandle;

  constructor(effectManager: IEffectManager)
  {
    super();
    this.effectManager = effectManager;
    this.handle = new ObserverHandle();

    this.handle.AddObserver(effectManager, {
      OnItemCountChanged: (item, count) =>
      {
        const stat: Stats | null = (() =>
        {
          switch(item.Id)
          {
            // case UpgradeId.MaxHealth: return Stats.HealthBonus;
            // case UpgradeId.AttackDamage: return Stats.DamageBonus;
            // case UpgradeId.AttackSpeed: return Stats.AttackSpeedMultiplier;
            // case UpgradeId.DefenseRanged: return Stats.RangedDefense;

            case SkillCharacterStatsID.DefenseUp: return Stats.DefenseBonus;
            case SkillCharacterStatsID.MaxHealthUp: return Stats.HealthMultiplier;
            case SkillCharacterStatsID.AttackDamageUp: return Stats.DamageMultiplier;
            case SkillCharacterStatsID.AttackSpeedUp: return Stats.AttackSpeedMultiplier;
            case SkillCharacterStatsID.CriticalRateUp: return Stats.CriticalRateBonus;
            case SkillCharacterStatsID.CritecalDamageUp: return Stats.CriticalDamageBonus;
            case SkillCharacterStatsID.MoveSpeedUp: return Stats.MovementSpeedMultiplier;

            case SkillRecoveryID.BoostHeartHealing: return Stats.BoostHeartHealing;
            // case UpgradeId.DefenseRanged: return Stats.RangedDefense;
            case SkillCharacterStatsID.DodgeChanceUp: return Stats.DodgeRateBonus;
            default: return null;
          }
        })();

        if(stat !== null)
        {
          this.DispatchEvent(observer =>
            observer.OnStatsChanged?.(stat, this.GetStats(stat))
          );
        }
      },
    });
  }

  Dispose(): void
  {
    this.handle.Dispose();
  }

  GetStats(stat: Stats): number
  {
    switch(stat)
    {
      case Stats.HealthBonus: {
        // const count = this.effectManager.GetItem(UpgradeId.MaxHealth)?.Count ?? 0;
        // return count === 0 ? 0 : 100 + (count - 1) * 50;
        return 0;

      }

      case Stats.HealthMultiplier: {
        const rateBase = 0.1;
        const count = this.effectManager.GetItem(SkillCharacterStatsID.MaxHealthUp)?.Amount ?? 0;
        return 1 + count * rateBase;
      }

      case Stats.BoostHeartHealing: {
        const count = this.effectManager.GetItem(SkillRecoveryID.BoostHeartHealing)?.Amount ?? 0;
        return 1 + count;
      }


      case Stats.DamageBonus: {
        // const count = this.effectManager.GetItem(UpgradeId.AttackDamage)?.Count ?? 0;
        // return count === 0 ? 0 : 10 + (count - 1) * 5;
        return 0;
      }

      case Stats.DamageMultiplier: {
        const rateBase = 0.1;//10% on max
        const count = this.effectManager.GetItem(SkillCharacterStatsID.AttackDamageUp)?.Amount ?? 0;
        return 1 + count * rateBase;
      }

      case Stats.AttackSpeedMultiplier: {
        // const upgradeCount = this.effectManager.GetItem(UpgradeId.AttackSpeed)?.count ?? 0;
        const rateBase = 0.1;
        const skillCount = this.effectManager.GetItem(SkillCharacterStatsID.AttackSpeedUp)?.Amount ?? 0;
        const upgradeMultiplier = 0;
        return (1 + upgradeMultiplier) * (1 + skillCount * rateBase);
      }

      case Stats.CriticalRateBonus: {
        const count = this.effectManager.GetItem(SkillCharacterStatsID.CriticalRateUp)?.Amount ?? 0;
        return count;
      }

      case Stats.CriticalDamageBonus: {
        const count = this.effectManager.GetItem(SkillCharacterStatsID.CritecalDamageUp)?.Amount ?? 0;
        return count;
      }

      case Stats.MovementSpeedMultiplier: {
        const valueBase = 1;
        const rateBase = 0.1;
        const count = this.effectManager.GetItem(SkillCharacterStatsID.MoveSpeedUp)?.Amount ?? 0;
        return valueBase + rateBase * count;
      }

      case Stats.DefenseBonus: {
        const valueBase = 1;
        const rateBase = 0.1;
        const amount = this.effectManager.GetItem(SkillCharacterStatsID.DefenseUp)?.Amount ?? 0;
        return valueBase + amount * rateBase;
      }

      // case Stats.RangedDefense: {
      //   // const count = this.effectManager.GetItem(UpgradeId.DefenseRanged)?.Count ?? 0;
      //   const count = 0;
      //   return count === 0 ? 0 : 10 + (count - 1) * 5;
      // }

      case Stats.DodgeRateBonus: {
        const amount = this.effectManager.GetItem(SkillCharacterStatsID.DodgeChanceUp)?.Amount ?? 0;
        return amount;
      }

      default:
        {
          console.error(`Unhandled stat type: ${Stats[stat]}`);
          throw new Error(`Unhandled stat type: ${Stats[stat]}`);
        }
    }
  }
}

export class BodyStatsManager extends ObserverManager<StatsManagerObserver> implements IStatsManager
{
  private readonly statsManager: IStatsManager;
  private readonly config: IBodyConfig;
  private readonly handle: ObserverHandle;
  private healthPercentage: number;

  constructor(
    statsManager: IStatsManager,
    config: IBodyConfig,
    damageReceiver: IDamageReceiverObservable,
    healthPercentage: number,
    healReceiver?: IHealReceiverObservable,
  )
  {
    super();
    this.statsManager = statsManager;
    this.config = config;
    this.healthPercentage = healthPercentage;
    this.handle = new ObserverHandle();
    this.handle.AddObserver(statsManager, {
      OnStatsChanged: (stat, value) =>
      {
        this.DispatchEvent(observer => observer.OnStatsChanged?.(stat, value));
        const affectedStats = (() =>
        {
          switch(stat)
          {

            case Stats.Health:
            case Stats.HealthBonus:
            case Stats.HealthMultiplier:
              return [Stats.Health, Stats.MaxHealth];
            case Stats.MovementSpeedMultiplier:
              return [Stats.MovementSpeed];
            case Stats.DefenseBonus:
              return [Stats.Defense];
            default:
              return [];
          }
        })();

        for(const s of affectedStats)
        {
          this.DispatchEvent(observer => observer.OnStatsChanged?.(s, this.GetStats(s)));
        }
      },
    });

    this.handle.AddObserver(damageReceiver, {
      OnDamageTaken: (amount: number) =>
      {
        const maxHealth = this.GetStats(Stats.MaxHealth);
        const percentage = amount / maxHealth;
        this.healthPercentage = Math.max(this.healthPercentage - percentage, 0);
        this.DispatchEvent(observer => observer.OnStatsChanged?.(Stats.Health, this.GetStats(Stats.Health)));
      },
    });

    if(healReceiver)
    {

      this.handle.AddObserver(healReceiver, {
        OnHeal: (amount: number, isHealByHeart: boolean) =>
        {
          this.RestoreHealth(amount, isHealByHeart)
        },
      });

    }
  }

  Dispose(): void
  {
    this.handle.Dispose();
  }

  GetStats(stat: Stats): number
  {
    switch(stat)
    {
      case Stats.Health:
        return this.healthPercentage * this.GetStats(Stats.MaxHealth);

      case Stats.MaxHealth:
        return (
          (this.config.MaxHealth + this.statsManager.GetStats(Stats.HealthBonus)) *
          (this.statsManager.GetStats(Stats.HealthMultiplier))
        );
      case Stats.MovementSpeed:
        return (
          this.config.MoveSpeed *
          this.statsManager.GetStats(Stats.MovementSpeedMultiplier)
        );
      case Stats.Defense:
        return (
          this.config.Defense * this.statsManager.GetStats(Stats.DefenseBonus)
        );
      case Stats.DodgeRate:
        return (
          this.config.DodgeRate + this.statsManager.GetStats(Stats.DodgeRateBonus)
        )
      default:
        return this.statsManager.GetStats(stat);
    }
  }

  private RestoreHealth(percentage: number, isHealByHeart: boolean): void
  {
    let HealingIncrease = isHealByHeart ? this.statsManager.GetStats(Stats.BoostHeartHealing) : 1;
    let amountHealing = (percentage * HealingIncrease)
    amountHealing = Math.min(amountHealing, 1 - this.healthPercentage);
    if(amountHealing === 0) return;
    this.healthPercentage += amountHealing;
    this.DispatchEvent(observer =>
      observer.OnStatsChanged?.(Stats.Health, this.GetStats(Stats.Health))
    );
  }

}

export class AttackStatsManager extends ObserverManager<StatsManagerObserver> implements IStatsManager
{
  private readonly statsManager: IStatsManager;
  private readonly config: IAttackBehaviorConfig;
  private readonly handle: ObserverHandle;

  constructor(statsManager: IStatsManager, config: IAttackBehaviorConfig)
  {
    super();
    this.statsManager = statsManager;
    this.config = config;
    this.handle = new ObserverHandle();

    this.handle.AddObserver(statsManager, {
      OnStatsChanged: (stat, value) =>
      {
        this.DispatchEvent(observer => observer.OnStatsChanged?.(stat, value));

        const affectedStats = (() =>
        {
          switch(stat)
          {
            case Stats.DamageBonus:
            case Stats.DamageMultiplier:
              return [Stats.Damage];
            case Stats.CriticalRateBonus:
              return [Stats.CriticalRate];
            case Stats.CriticalDamageBonus:
              return [Stats.CriticalDamage];
            case Stats.AttackSpeedMultiplier:
              return [Stats.AttackSpeed];
            default:
              return [];
          }
        })();

        for(const s of affectedStats)
        {
          this.DispatchEvent(observer => observer.OnStatsChanged?.(s, this.GetStats(s)));
        }
      },
    });


  }

  Dispose(): void
  {
    this.handle.Dispose();
  }

  GetStats(stat: Stats): number
  {
    switch(stat)
    {
      case Stats.Damage:
        return (
          (this.config.Damage + this.statsManager.GetStats(Stats.DamageBonus)) *
          this.config.DamageMultiplier *
          this.statsManager.GetStats(Stats.DamageMultiplier));
      case Stats.CriticalRate:
        return this.config.CriticalRate + this.statsManager.GetStats(Stats.CriticalRateBonus);
      case Stats.CriticalDamage:
        return this.config.CriticalDamage + this.statsManager.GetStats(Stats.CriticalDamageBonus);
      case Stats.AttackSpeed:
        return this.config.AttackSpeed * this.statsManager.GetStats(Stats.AttackSpeedMultiplier);
      default:
        return this.statsManager.GetStats(stat);
    }
  }
}
