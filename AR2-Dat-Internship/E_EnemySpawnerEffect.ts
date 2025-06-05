import {Entity} from 'Entity';
import {VFXParticleGizmo} from 'horizon/2p';
import * as hz from 'horizon/core';
import {Delay} from 'Utilities';

export const SPAWNER_EFFECT_ASSET_ID = '964715399203385';
export class EnemySpawnerEffect extends Entity<typeof EnemySpawnerEffect> {
  private particleVFXView!: VFXParticleGizmo;

  start()
  {
    super.start();
    this.particleVFXView = this.entity.as(VFXParticleGizmo);
    if(!this.particleVFXView)
    {
      throw new Error("Don't have VFX in this Entity Name: " + this.entity.name.get());
    }
  }

  public async Show(position: hz.Vec3): Promise<void>
  {
    this.Position = position;
    this.particleVFXView.play();
    await Delay(this, 2); // For now, use 2 second for this VFX duration. Must be in config
  }

  public async Hide(): Promise<void>
  {
    this.particleVFXView.stop();
    await Delay(this, 3); // For test, this VFX i use have the end of animation VFX.
    this.Kill();
  }
}
hz.Component.register(EnemySpawnerEffect);