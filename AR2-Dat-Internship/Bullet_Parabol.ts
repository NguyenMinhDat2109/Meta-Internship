import {IBulletMoveBehavior} from 'Bullet_MoveBehavior';
import {BulletBase} from 'BulletBase';
import * as hz from 'horizon/core';
import {IEntity} from 'IEntity';
import {BulletConfig} from 'Enemy_Data';

export class Bullet_Parabol implements IBulletMoveBehavior
{

  private elapsed = 0;
  private firePos = hz.Vec3.zero;
  private amplitude = 0.6;
  private frequency = 360;
  private direction = hz.Vec3.zero;
  private perpendicular = hz.Vec3.zero;

  public Process(entity: IEntity, bulletConfig: BulletConfig, deltaTime: number): void
  {
    this.elapsed += deltaTime;
    let waveOffset = Math.sin(hz.degreesToRadians(this.elapsed * this.frequency)) * this.amplitude;
    let zigzagMovementOffset = this.perpendicular.mul(waveOffset);
    let zigzagMovement = this.firePos.add(this.direction.mul(bulletConfig.MoveSpeed * this.elapsed)).add(zigzagMovementOffset);
    entity.Position = new hz.Vec3(zigzagMovement.x, this.firePos.y, zigzagMovement.z);
  }

  public SetUpBullet(bullet: BulletBase<any>): void
  {
    this.firePos = bullet.Position;
    let targetPos = bullet.Target;
    targetPos.y = bullet.Position.y;
    this.direction = targetPos.sub(this.firePos).normalize();
    this.perpendicular = this.direction.cross(hz.Vec3.up);
    this.elapsed = 0;
  }

  public Clone(): IBulletMoveBehavior
  {
    return new Bullet_Parabol();
  }

}