import {Entity} from 'Entity';
import * as hz from 'horizon/core';

const ANIMATED_DURATION = 0.2;
const ANIMATED_STANDING_DURATION = 0.3;
const DESTINATION_Z = 1;
export class DamageNumber extends Entity<typeof DamageNumber> {
  static propsDefinition = {
    text: {type: hz.PropTypes.Entity},
  };

  private damageTextGizmo!: hz.TextGizmo;
  private parent: hz.Entity | undefined;
  public followingSpeed: number = 0;
  private animationActive: boolean = false;
  private elapsedTime: number = 0;
  private offset: hz.Vec3 = hz.Vec3.zero;

  start()
  {
    super.start();
    if(!this.props.text)
    {
      throw new Error('TextGizmo is required');
    }
    this.damageTextGizmo = this.props.text.as(hz.TextGizmo);
    if(this.currentPlayer == this.world.getServerPlayer()) return;
    this.AddObserver({
      OnEnd: () =>
      {
        this.EnableVisible(false);
      },
    });
  }

  private EnableVisible(enable: boolean)
  {
    this.entity.visible.set(enable);
  }

  public DisplayDamageText(offset: hz.Vec3, value: number, color: hz.Color, parent: hz.Entity)
  {
    this.Position = parent.position.get().add(offset);
    this.offset = offset;
    this.damageTextGizmo.text.set(`-${value.toString()}`);
    this.damageTextGizmo.color.set(color);
    this.damageTextGizmo.transform.localPosition.set(hz.Vec3.zero);
    this.parent = parent;
    this.animationActive = true;
    this.elapsedTime = 0;
    this.EnableVisible(true);
  }

  Process(deltaTime: number)
  {
    if(!this.animationActive || !this.IsAlive)
    {
      return;
    }

    this.elapsedTime += deltaTime;
    if(this.elapsedTime >= ANIMATED_STANDING_DURATION + ANIMATED_DURATION)
    {
      // fix me
    }

    // Follow parent's x and z positions with followingSpeed if a parent exists
    if(this.parent)
    {
      let position = this.Position;
      const parentPosition = this.parent.position.get().add(this.offset);
      position.x += (parentPosition.x - position.x) * this.followingSpeed * deltaTime;
      position.z += (parentPosition.z - position.z) * this.followingSpeed * deltaTime;
      this.Position = position;
    }

    if(this.elapsedTime >= ANIMATED_DURATION)
    {
      this.elapsedTime = 0;
      this.animationActive = false;
      this.Kill();
      return;
    }

    // Move up with ANIMATED_SPEED
    let animatedZPosition = hz.Vec3.lerp(hz.Vec3.zero, new hz.Vec3(0, 0, DESTINATION_Z), this.elapsedTime / ANIMATED_DURATION);
    this.damageTextGizmo.moveRelativeTo(this.entity, animatedZPosition, hz.Space.Local);
    // this.textObject.lookAt(LocalCamera.position.get());

  }
}
hz.Component.register(DamageNumber);