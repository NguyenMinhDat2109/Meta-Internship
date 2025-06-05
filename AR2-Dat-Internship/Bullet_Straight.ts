import {IBulletMoveBehavior} from 'Bullet_MoveBehavior';
import {BulletBase} from 'BulletBase';
import * as hz from 'horizon/core';
import {BulletConfig} from 'Enemy_Data';

export class Bullet_Straight implements IBulletMoveBehavior
{
  private firePos = hz.Vec3.zero;

  public SetUpBullet(bullet: BulletBase<any>)
  {
    this.firePos = bullet.Position;
    let targetPos = bullet.Target;
    targetPos.y = bullet.Position.y;
    bullet.SetDirection(targetPos.sub(this.firePos).normalize());
  }

  public Process(bullet: BulletBase<any>, bulletConfig: BulletConfig, deltaTime: number)
  {
    let nextPosition = bullet.Direction.mul(bulletConfig.MoveSpeed * deltaTime);
    bullet.Position = bullet.Position.add(nextPosition);
  }

  public Clone(): Bullet_Straight
  {
    return new Bullet_Straight();
  }
}