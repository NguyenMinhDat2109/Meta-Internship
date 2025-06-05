
import {EnemyID} from 'Enemy_Const';
import {BulletsRequire as BulletsAcquire, BulletsRequire as BulletsRequire} from 'Enemy_Data';

export interface IBulletAcquireManager
{
  /**
   * For tracking duplicate set bullet require
   */
  SetBulletRequire(id: EnemyID, bulletRequire: BulletsRequire): void;
  GetBulletAcquire(enemyID: EnemyID): BulletsAcquire | undefined;

}

//#region Instance Service
export class BulletAcquireManager implements IBulletAcquireManager
{

  private bulletRequireMap: Map<EnemyID, BulletsRequire> = new Map();

  private IsValidate(id: EnemyID): boolean
  {
    return this.bulletRequireMap.has(id);
  }

  public SetBulletRequire(id: EnemyID, bulletRequire: BulletsRequire): void
  {
    if(this.IsValidate(id))
    {
      return;
    }
    this.bulletRequireMap.set(id, bulletRequire);
  }

  public GetBulletAcquire(enemyID: EnemyID): BulletsAcquire | undefined
  {
    let bulletAcquire = this.bulletRequireMap.get(enemyID);
    return bulletAcquire;

  }
}
