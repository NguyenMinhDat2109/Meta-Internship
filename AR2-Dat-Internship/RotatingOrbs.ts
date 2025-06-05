import {IBulletMoveBehavior} from 'Bullet_MoveBehavior';
import {BulletBase} from 'BulletBase';
import {EntityManager} from 'EntityManager';
import {EnemyEvent} from 'EventContainer';
import {Entity2p} from 'horizon/2p';
import * as hz from 'horizon/core';
// Assume entity.Position is a Vec3 representing the player's position
export const ORB_ASSET_ID = '1002421361822579';

// Calculate orb0 and orb1 positions using sine and cosine
export class RotatingDamageOrbBase extends BulletBase<typeof RotatingDamageOrbBase>
{
  rootAngle = 0; // Starting angle (can be any angle)
  damage = 1; // Random default value
  radius = 3;// Random default value
  staticY = 0;
  public SetupOrbData(data: {
    damage: number;
    radius: number;
  })
  {
    this.damage = data.damage;
    this.radius = data.radius;
  }
  start(): void
  {
    super.start();
    if(this.currentPlayer == this.world.getServerPlayer()) return;
    this.staticY = this.currentPlayer.position.get().y;
    // this.connectLocalBroadcastEvent(hz.World.onUpdate, (tick) => {
    //   this.Process(tick.deltaTime);
    // });
  }

  OrbProcess(offset: number)
  {
    if(!this.currentPlayer) return;
    let playerPos = this.currentPlayer.position.get();
    // Update angle
    let angle = this.rootAngle + offset;
    if(angle > Math.PI * 2)
    {
      angle -= Math.PI * 2;
    }
    // Calculate position
    const x = this.radius * Math.cos(angle) + playerPos.x;
    const y = this.staticY;
    const z = this.radius * Math.sin(angle) + playerPos.z;
    this.entity.as(Entity2p).position.set(new hz.Vec3(x, y, z));
  }

  override OnColliderEvent(): void
  {
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnEntityEnterTrigger, (entity) =>
    {
      this.OnOrbHitEnemy(entity);
    });
  }

  OnOrbHitEnemy(entity: hz.Entity)
  {
    if(this.IsAlive)
    {
      console.log('Orb hit enemy');
      if(entity && entity.tags.contains('enemy'))
      {
        this.sendLocalEvent(entity, EnemyEvent.EnemyTakeDamage, {damage: this.damage, knockback: {distance: 0, direction: hz.Vec3.zero}});
      }
    }
  }

  UpdateRootAngle(angle: number)
  {
    this.rootAngle = angle
  }
}
const AngularSpeed = Math.PI;

export class RotatingOrbManager
{
  orbs: RotatingDamageOrbBase[] = [];
  rotationAngleOffset = 0;
  numberOfOrbs = 20;
  entityManager: EntityManager | undefined;
  onUpdateSubscription!: hz.EventSubscription;
  constructor(entityManager: EntityManager)
  {
    this.entityManager = entityManager;
    this.CreateOrbs();
  }

  private async CreateOrbs()
  {
    this.AddOrbs(RotatingDamageOrbBase)
  }
  /**
  * Adds two rotating orbs of type `T` to the `orbs` list and assigns them alternating angles.
  * 
  * **Functionality:**
  * 1. **Checks if `entityManager` exists** - Exits if undefined.
  * 2. **Creates two orbs**:
  *    - Calls `CreateEntity(ORB_ASSET_ID)` twice.
  *    - If the created entity matches `OrbClass`, it is added to `orbs` and initialized with:
  *      - `damage: 1`
  *      - `radius: 3`
  * 3. **Assigns alternating angles**:
  *    - Even-indexed orbs: Angle is calculated using `(Math.PI * 2 / this.numberOfOrbs) * Math.ceil(i / 2)`.
  *    - Odd-indexed orbs: Offset by **π radians** (180°) from the previous orb.
  *    - Calls `UpdateRootAngle(baseAngle)` to apply the computed angle.
  * 
  * **Effects:**
  * - Ensures even distribution of orbs around the player.
  * - Every odd orb is placed exactly opposite its preceding even-indexed orb.
  * - Supports any subclass of `RotatingDamageOrbBase` for flexible orb types.
  */
  public async AddOrbs<T extends RotatingDamageOrbBase>(OrbClass: new (...args: any[]) => T)
  {
    if(!this.entityManager) return;

    let orbEntity = await this.entityManager.CreateEntity(ORB_ASSET_ID); // Should be add correct ID
    if(orbEntity instanceof OrbClass)
    {
      let orbComp = orbEntity as T;
      this.orbs.push(orbComp);
      orbComp.SetupOrbData({
        damage: 1,
        radius: 3,
      });
    }

    let orbEntity2 = await this.entityManager.CreateEntity(ORB_ASSET_ID);
    if(orbEntity2 instanceof OrbClass)
    {
      let orbComp2 = orbEntity2 as T;
      this.orbs.push(orbComp2);
      orbComp2.SetupOrbData({
        damage: 1,
        radius: 3,
      });
    }
    let baseAngle = 0;
    for(let i = 0; i < this.orbs.length; i++)
    {

      if(i % 2 === 0)
      {
        // Even index: base on ceil(i / 2)
        baseAngle = (Math.PI * 2 / this.orbs.length) * Math.ceil(i / 2);
      } else
      {
        // Odd index: π offset from the previous even-indexed orb
        baseAngle += + Math.PI;
      }
      this.orbs[i].UpdateRootAngle(baseAngle);
    }
  }

  public Process(deltaTime: number): void
  {
    this.rotationAngleOffset += AngularSpeed * deltaTime;
    if(this.rotationAngleOffset > Math.PI * 2)
    {
      this.rotationAngleOffset -= Math.PI * 2;
    }
    this.orbs.forEach((orb, index) =>
    {
      orb.OrbProcess(this.rotationAngleOffset);
    });
  }
}
hz.Component.register(RotatingDamageOrbBase);
