import {IBulletMoveBehavior} from 'Bullet_MoveBehavior';
import {BulletBase} from 'BulletBase';
import * as hz from 'horizon/core';
import {IEntity} from 'IEntity';
import {BulletConfig} from 'Enemy_Data';

export class Bullet_Mortar implements IBulletMoveBehavior
{
  private elapsed = 0;
  private firePos = hz.Vec3.zero;
  private endPos = hz.Vec3.zero;
  private lerpEndA = hz.Vec3.zero;
  private lerpEndB = hz.Vec3.zero;

  public SetUpBullet(bullet: BulletBase<any>)
  {
    this.firePos = bullet.Position;
    let targetPos = bullet.Target;
    targetPos.y = bullet.Position.y;
    this.endPos = targetPos;
    this.elapsed = 0;
    const midPos = (this.firePos.add(targetPos)).mul(0.5).componentMul(new hz.Vec3(1, 20, 1));
    this.lerpEndA = this.firePos.add(midPos.sub(targetPos));
    this.lerpEndB = targetPos.add(midPos.sub(this.firePos));
  }

public Process(entity: IEntity, bulletConfig: BulletConfig, deltaTime: number): void {
  this.elapsed += deltaTime;

  if (this.elapsed < bulletConfig.AliveTime) {
    const t = this.elapsed / bulletConfig.AliveTime;

    // Precompute lerps to clarify the motion path
    const firstLerp = hz.Vec3.lerp(this.firePos, this.lerpEndA, t);
    const secondLerp = hz.Vec3.lerp(this.endPos, this.lerpEndB, 1 - t);
    const position = hz.Vec3.lerp(firstLerp, secondLerp, t);
    entity.Position = position;
  } else {
    entity.Kill();
  }
}

  public Clone(): IBulletMoveBehavior
  {
    return new Bullet_Mortar();
  }
}