import {IBulletMoveBehavior} from 'Bullet_MoveBehavior';
import {CharacterManager} from 'CharacterManager';
import {EntityAssetIDs} from 'ConfigAssets';
import {BulletConfig} from 'Enemy_Data';
import {Entity} from 'Entity';
import {EntityManager} from 'EntityManager';
import {Entity_Shadow} from 'Entity_Shadow';
import * as hz from 'horizon/core';
import {IEntity} from 'IEntity';
import {MapManager} from 'MapManager';
import {IsBounce} from 'Utilities';


export abstract class BulletBase<T> extends Entity<typeof BulletBase & T>
{
  static propsDefinition = {
    renderer: {type: hz.PropTypes.Entity},
  };

  protected isFlying = false;
  protected updateEvent?: hz.EventSubscription;
  protected speed = 0;
  protected aliveTime = 0;
  protected elapsedTime = 0;
  protected damage = 0;
  protected bulletConfig: BulletConfig | undefined;
  protected moveBehavior: IBulletMoveBehavior | undefined;
  protected bounceAmount: number = 0;

  private observerHandler = -1;
  private shadow: IEntity | undefined;
  protected entityManager: EntityManager | undefined;
  protected characterManager: CharacterManager | undefined;
  private canMove = false;

  public Direction = hz.Vec3.zero;
  public Target = hz.Vec3.zero;
  start()
  {
    super.start();
    this.OnColliderEvent();
    if(this.currentPlayer == this.world.getServerPlayer())
    {
      return;
    }
    this.HandleObserver();
  }

  protected HandleObserver()
  {
    this.AddObserver({
      OnBegin: () =>
      {
        this.OnBegin();
      },
      OnEnd: () =>
      {
        this.OnEnd();
      },
    });
  }


  private async CreateShadow()
  {
    await this.entityManager?.CreateEntity(EntityAssetIDs.ShadowID, (it) =>
    {
      let shaderComp = it as Entity_Shadow;
      const offsetShadow = new hz.Vec3(0, 0, -0.5);
      const scaleShadow = new hz.Vec3(0.3, 0.002, 0.3);
      shaderComp.Position = this.Position;
      shaderComp.SetTranformConstraint(this.entity, offsetShadow, scaleShadow);
      this.shadow = it;
    });
  }

  protected OnEnd()
  {
    this.Enable(false);
    this.shadow?.Kill();
    this.shadow = undefined;
    this.canMove = false;
  }

  protected OnBegin()
  {
    this.entityManager = this.ServiceLocator.Resolve<EntityManager>(EntityManager);
    this.characterManager = this.ServiceLocator.Resolve<CharacterManager>(CharacterManager);
    this.elapsedTime = 0;
    this.Enable(true);
    this.CreateShadow();
  }

  abstract OnColliderEvent(): void;

   private ProcessBounceWall(deltaTime: number): void
  {
    if(this.bounceAmount < 0)
    {
      return;
    }
    //Check bounce and change direction
    //IMPROVE me: need to plus with bounce object(scale, witdh, height).
    
    if(IsBounce(this.Position.x, {minValue: MapManager.LEFT, maxValue: MapManager.RIGHT}))
    {
      this.BounceLimitCheck();
      this.Direction.x *= -1;
      this.SetDirection(this.Direction)

    }
    if(IsBounce(this.Position.z, {minValue: MapManager.BOTTOM, maxValue: MapManager.TOP}))
    {
      this.BounceLimitCheck();
      this.Direction.z *= -1;
      this.SetDirection(this.Direction)
    }

  }

  protected BounceLimitCheck()
  {
    this.bounceAmount--;
    if(this.bounceAmount >= 0)
    {
      return;
    }
    this.Kill();
  }

  private ProcessAlive(deltaTime: number)
  {
    if(this.elapsedTime > this.aliveTime)
    {
      this.elapsedTime = 0;
      this.Kill();
      return;
    }
    this.elapsedTime += deltaTime;
    if(this.canMove && this.moveBehavior && this.bulletConfig)
    {
      this.moveBehavior.Process(this, this.bulletConfig, deltaTime);
    }
  }

  protected Enable(enable: boolean)
  {
    this.entity.as(hz.TriggerGizmo).enabled.set(enable);
    this.props.renderer?.visible.set(enable);
  }

  public SetBulletConfig(bulletConfig: BulletConfig)
  {
    this.bulletConfig = bulletConfig;
    this.aliveTime = bulletConfig.AliveTime;
    this.speed = bulletConfig.MoveSpeed;
    this.damage = bulletConfig.Damage;
    this.bounceAmount = bulletConfig.Bounce;
    // IF difference behavior clone new instance. 
    if(this.moveBehavior !== bulletConfig.MoveBehavior)
    {
      this.moveBehavior = undefined;
      this.moveBehavior = bulletConfig.MoveBehavior.Clone();
    }
  }

  public SetDirection(direction: hz.Vec3)
  {
    this.Direction = direction;
    this.entity.rotation.set(hz.Quaternion.lookRotation(direction, hz.Vec3.up))
  }

  public SetTarget(target: hz.Vec3)
  {
    this.Target = target;
  }

  public SetFirePosition(position: hz.Vec3)
  {
    this.Position = position;
  }

  public SetBullet()
  {
    this.moveBehavior?.SetUpBullet(this);
    this.canMove = true;
  }

  public Process(deltaTime: number): void
  {
    if(!this.IsAlive)
    {
      return;
    }
    this.ProcessBounceWall(deltaTime);
    this.ProcessAlive(deltaTime);
  }
}