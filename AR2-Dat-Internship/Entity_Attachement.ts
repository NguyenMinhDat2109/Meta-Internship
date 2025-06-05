import {Entity} from 'Entity';
import {Entity2p} from 'horizon/2p';
import * as hz from 'horizon/core';
import {Delay} from 'Utilities';

export abstract class Entity_Attachement<T> extends Entity<typeof Entity_Attachement & T> {
  static propsDefinition = {};

  private observerHandler = -1;

  start(): void
  {
    super.start();
    if(this.currentPlayer == this.world.getServerPlayer()) return;
    this.observerHandler = this.AddObserver({
      OnBegin: () =>
      {
        this.OnBegin();
        this.Enable(true);
      },
      OnEnd: () =>
      {
        this.OnEnd();
        this.Enable(false);
        this.ClearTranformConstraint();
      },
    });
  }

  protected OnBegin(): void {}

  protected OnEnd(): void {}

  private Enable(enable: boolean)
  {
    this.entity.visible.set(enable);
  }

  public SetTranformConstraint(entity: hz.Entity, localPosition: hz.Vec3, scale = hz.Vec3.one, localRotation: hz.Quaternion = hz.Quaternion.zero)
  {
    this.entity.as(Entity2p).setTransformConstraint(entity, localPosition, localRotation, scale);
  }

  public async ClearTranformConstraint()
  {
    await Delay(this, 0.5); // the bug: sometime entity attach clear early. So i let the delay for checking bug. Improve me.
    this.entity.as(Entity2p).clearTransformConstraint();
  }
}