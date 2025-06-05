import {SkillBulletStatsID} from 'Config_Skills';
import {BulletConfig} from 'Enemy_Data';
import * as hz from 'horizon/core';
import {IEffectManager} from 'IEffectManager';
import {ObserverManager} from 'IObserverManager';
import {StatsManagerObserver, IStatsManager, Stats} from 'IStatsManager';
import {ObserverHandle} from 'ObserverHandle';

export enum BulletStats
{
  MovementSpeed = "MovementSpeed",
  Damage = "Damage",
  Richochet = "Richochet",
  Bounce = "Bounce",
  Piercing = "Piercing",
  DoubleAttack = "DoubleAttack",
  SpreadShoot = "SpreadShoot",
}

export class StatsBulletManager extends ObserverManager<StatsManagerObserver> implements IStatsManager
{
  private readonly effectManager: IEffectManager;
  private readonly handle: ObserverHandle;
  private readonly config: BulletConfig;

  constructor(effectManager: IEffectManager, config: BulletConfig)
  {
    super();
    this.config = config;
    this.effectManager = effectManager;
    this.handle = new ObserverHandle();

    this.handle.AddObserver(effectManager, {
      OnItemCountChanged: (item, count) =>
      {
        const stat: BulletStats | null = (() =>
        {
          switch(item.Id)
          {
            case SkillBulletStatsID.Bounce: return BulletStats.Bounce;
            case SkillBulletStatsID.DoubleAttack: return BulletStats.DoubleAttack;
            case SkillBulletStatsID.SpreadShoot: return BulletStats.SpreadShoot;
            case SkillBulletStatsID.Ricochet: return BulletStats.Richochet;
            case SkillBulletStatsID.Piercing: return BulletStats.Piercing;
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

  GetStats(stat: BulletStats): number
  {
    switch(stat)
    {
      case BulletStats.Damage:
        return (
          this.config.Damage
        );
      case BulletStats.Richochet:
        return (
          this.effectManager.GetItem(SkillBulletStatsID.Ricochet)?.Amount ?? 0
        )
      case BulletStats.Bounce:
        return (
          this.config.Bounce + (this.effectManager.GetItem(SkillBulletStatsID.Bounce)?.Amount ?? 0)
        )
      case BulletStats.Piercing:
        return (
          this.effectManager.GetItem(SkillBulletStatsID.Piercing)?.Amount ?? 0
        )
      case BulletStats.DoubleAttack:
        return (
          this.effectManager.GetItem(SkillBulletStatsID.DoubleAttack)?.Amount ?? 0
        )
      case BulletStats.SpreadShoot:
        return (
          this.effectManager.GetItem(SkillBulletStatsID.SpreadShoot)?.Amount ?? 0
        )
      default:
        throw new Error(`Unhandled stat type: ${BulletStats[stat]}`);
    }
  }
}