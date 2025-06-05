import {BulletBase} from 'BulletBase';
import {BulletConfig} from 'Enemy_Data';
import * as hz from 'horizon/core';
import {IEntity} from 'IEntity';

export interface IBulletMoveBehavior
{
  SetUpBullet(bullet: BulletBase<any>): void;
  Process(entity: IEntity, bulletConfig: BulletConfig, deltaTime: number): void;
  Clone(): IBulletMoveBehavior;
}

export class NullBulletMoveBehavior implements IBulletMoveBehavior
{
  SetUpBullet(bullet: BulletBase<any>): void
  {
    //NOTHING
  }
  Process(entity: IEntity, bulletConfig: BulletConfig, deltaTime: number): void
  {
    //NOTHING
  }
  Clone(): IBulletMoveBehavior
  {
    return new NullBulletMoveBehavior();
  }
}
