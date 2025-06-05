import {ITask} from 'BehaviorTreeManager';
import {BulletAcquireManager} from 'BulletAcquireManager';
import {ConfigManager} from 'ConfigManager';
import {BulletID, EnemyID} from 'Enemy_Const';
import {MAP_DIAGONAL} from 'Enemy_Data';
import * as hz from 'horizon/core';
import {IBehaviorConfig} from 'IBehaviorConfig';
import {ITimeMonitor} from 'ITimeMonitor';
import {IServiceLocator, ServiceLocator} from 'ServiceLocator';
import {IBehaviorAgent} from 'IBehaviorAgent';

export abstract class BehaviorShootStrategyBase implements IBehaviorConfig
{
  protected coolDown: number;
  protected bulletID: BulletID;
  protected numOfBullet: number;
  protected enemyID: EnemyID;

  constructor(coolDown: number, bulletID: BulletID, numOfBullet: number, enemyID: EnemyID)
  {
    this.coolDown = coolDown;
    this.bulletID = bulletID;
    this.numOfBullet = numOfBullet;
    this.enemyID = enemyID;
    this.InitilizerBulletRequire();
  }

  abstract CreateAction(serviceLocator: IServiceLocator, timeMonitor: ITimeMonitor, agent: IBehaviorAgent, comp: hz.Component /* for test delay need to be in await action... */): ITask;
  abstract Clone(): IBehaviorConfig;

  private InitilizerBulletRequire()
  {
    let configManager = ServiceLocator.Instance.Resolve<ConfigManager>(ConfigManager);
    let bulletsAcquire = this.CalculateRequiredBullets(this.coolDown, this.numOfBullet, configManager.GetBulletMoveSpeed(this.bulletID), configManager.GetBulletBounce(this.bulletID));
    let bulletAcquireManager = ServiceLocator.Instance.Resolve<BulletAcquireManager>(BulletAcquireManager);
    bulletAcquireManager.SetBulletRequire(this.enemyID, {BulletID: this.bulletID, Quantity: bulletsAcquire});
  }
  /**
   * Calculates the number of bullets needed to maintain a continuous stream.
   *
   * @param coolDown The cooldown period between consecutive shots (in the same time unit as bulletSpeed).
   * @param numOfBulletsPerShot The number of bullets fired with each shot.
   * @param bulletSpeed The speed of the bullets (in units of distance per the same time unit as coolDown).
   * @param boundTime A scaling factor for bullet lifetime (set to 1 for normal lifetime).
   * @returns The estimated number of bullets needed to ensure bullets are continuously present on the map.
   */
  private CalculateRequiredBullets(coolDown: number, numOfBulletsPerShot: number, bulletSpeed: number, boundTime: number): number
  {
    // Maximum time a bullet can exist on the map
    const oneBulletMaxAliveTime = (MAP_DIAGONAL / bulletSpeed);

    // Calculate the rate at which bullets are fired
    const fireRate = 1 / coolDown; // Number of shots per second
    const bulletsPerSecond = fireRate * numOfBulletsPerShot; // Total bullets per second

    // Compute the required number of bullets
    let bulletsNeed = Math.ceil(bulletsPerSecond * oneBulletMaxAliveTime * (boundTime + 1));

    // Round up to the nearest multiple of numOfBulletsPerShot
    if(bulletsNeed % numOfBulletsPerShot !== 0)
    {
      bulletsNeed += numOfBulletsPerShot - (bulletsNeed % numOfBulletsPerShot);
    }

    return bulletsNeed;
  }
}

