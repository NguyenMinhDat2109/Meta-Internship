import * as hz from 'horizon/core';

export class Obstacle_Moving extends hz.Component<typeof Obstacle_Moving> {
  static propsDefinition = {
    speed: {type: hz.PropTypes.Number, default: 8}
  };
  
  private privateUptade : hz.EventSubscription | undefined
  private test = -1;

  start() {

  }
  private Update(deltaTime: number) {
    let rotation = this.entity.rotation.get();
    rotation = rotation.mul(hz.Quaternion.fromEuler(new hz.Vec3(this.props.speed,0,0)));
    this.entity.rotation.set(rotation);
    this.entity.position.set(this.entity.position.get().add(new hz.Vec3(0,0,deltaTime * -this.props.speed)));
  }
  public ObstacleApplyForce(direction : hz.Vec3)
  {
    this.entity.as(hz.PhysicalEntity).zeroVelocity()
    this.entity.as(hz.PhysicalEntity).applyForce(direction.normalize().mul(this.props.speed),hz.PhysicsForceMode.Impulse)
  }
  public Active(pos: hz.Vec3)
  {
    this.entity.as(hz.PhysicalEntity).zeroVelocity()
    this.entity.position.set(pos);
    this.privateUptade = this.connectLocalBroadcastEvent(hz.World.onUpdate, (data) => {
      this.Update(data.deltaTime)
    })
  }

  public DeSpawnAfter(delayTime: number,postion: hz.Vec3) {
    this.async.clearTimeout(this.test)
    this.test = this.async.setTimeout(()=>{
      this.entity.position.set(postion);
      this.privateUptade?.disconnect();
    },delayTime)
  }
}
hz.Component.register(Obstacle_Moving);