import {Entity_Attachement} from 'Entity_Attachement';
import {VFXParticleGizmo} from 'horizon/2p';
import * as hz from 'horizon/core';
const PROCESS_PARA = 'Process';
const Color_PARA = 'Color';
const Size_PARA = 'Size';

export class HealthBar extends Entity_Attachement<typeof HealthBar> {
  static propsDefinition = {
    vfxHeathBar: {type: hz.PropTypes.Entity},
  };

  private particleVFXView: VFXParticleGizmo | undefined;
  private health: number = 0;
  private maxHealth: number = 0;
  start()
  {
    super.start();
    this.particleVFXView = this.props.vfxHeathBar?.as(VFXParticleGizmo);
  }

  OnBegin()
  {
    super.OnBegin();
    this.entity.rotation.set(new hz.Quaternion(0, 1, 0, 0));
  }

  OnEnd()
  {
    super.OnEnd();
    this.ToggleVisibility(false);
  }

  private UpdateView()
  {
    let percentage = this.maxHealth == 0 ? 0 : hz.clamp(this.health / this.maxHealth, 0, 1);
    this.particleVFXView?.setVFXParameterValue(PROCESS_PARA, percentage);
  }

  public ToggleVisibility(enable: boolean)
  { 
    enable ? this.particleVFXView?.play() : this.particleVFXView?.stop();
  }

  public SetHealth(health: number)
  {
    this.health = health;
    this.UpdateView();
  }

  public SetMaxHealth(maxHealth: number)
  {
    this.maxHealth = maxHealth;
    this.UpdateView();
  }

  public SetColor(color: hz.Color)
  {
    this.particleVFXView?.setVFXParameterValue(Color_PARA, [color.r, color.g, color.b, 1]);
  }

  public SetSize(scaler: number)
  {
    this.particleVFXView?.setVFXParameterValue(Size_PARA, scaler);
  }
}
hz.Component.register(HealthBar);