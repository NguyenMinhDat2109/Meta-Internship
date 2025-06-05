import {Entity} from 'Entity';
import {VFXParticleGizmo} from 'horizon/2p';
import * as hz from 'horizon/core';

export class EnemyMarker extends Entity<typeof EnemyMarker> {
  static propsDefinition = {
    marker: {type: hz.PropTypes.Entity},
  };

  private marker: VFXParticleGizmo | undefined;
  private enable: boolean = false;
  start()
  {
    super.start();
    this.marker = this.props.marker?.as(VFXParticleGizmo);

    this.AddObserver({
      OnBegin: () =>
      {
        this.entity.visible.set(true);
      },
      OnEnd: () =>
      {
        this.entity.visible.set(false);
      },
    });
  }

  public ToggleVisibility(enable: boolean)
  {
    if(this.enable === enable)
    {
      return;
    }
    this.enable = enable;
    // enable ? this.marker?.play() : this.marker?.stop(); // For VFX
    this.props.marker?.visible.set(enable); // For Entity
  }
}
hz.Component.register(EnemyMarker);