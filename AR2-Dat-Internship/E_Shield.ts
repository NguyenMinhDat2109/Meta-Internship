import {Entity_Attachement} from 'Entity_Attachement';
import {VFXParticleGizmo} from 'horizon/2p';
import * as hz from 'horizon/core';

export class Shield extends Entity_Attachement<typeof Shield> {
  private shieldDuration: number = 0;
  private shieldTime: number = 0;

  Process(deltaTime: number)
  {
    this.shieldTime += deltaTime;
    if(this.shieldTime >= this.shieldDuration)
    {
      this.shieldTime = 0;
      this.Kill();
    }
  }

  OnBegin(): void
  {
    this.entity.as(VFXParticleGizmo).play();
  }

  OnEnd(): void
  {
    this.ClearTranformConstraint();
    this.entity.as(VFXParticleGizmo).stop();
  }

  public SetShield(parent: hz.Entity, duration: number)
  {
    this.shieldDuration = duration;
    this.shieldTime = 0;
    this.SetTranformConstraint(parent, hz.Vec3.zero, hz.Vec3.one, hz.Quaternion.zero);
  }
}
hz.Component.register(Shield);