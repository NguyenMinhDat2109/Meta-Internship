import {BulletBase} from 'BulletBase';
import {BulletConfig, BulletPlayerFeature} from 'Enemy_Data';
import {Enemy} from 'Enemy';
import {EnemyEvent} from 'EventContainer';
import {FinderTargetHelper} from 'FinderTargetHelper';
import * as hz from 'horizon/core';
import {EntityManager} from 'EntityManager';
import {CharacterManager} from 'CharacterManager';

export class Bullet_Player extends BulletBase<typeof Bullet_Player>
{

  private amountRicochet: number = 0;
  private amountPiercing: number = 0;
  private enemiesAvoidList: Array<hz.Entity> = [];

  private enemiesRicocheted: Array<Enemy> = [];
  protected knockBackDistance: number = 0;
  private weapon: hz.ParticleGizmo | undefined

  OnColliderEvent(): void
  {
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnEntityEnterTrigger, (entity) =>
    {
      if(entity && entity.tags.contains('enemy'))
      {
        if(!this.IsAlive)
        {
          return;
        }


        if(!this.enemiesAvoidList.includes(entity))
        {
          this.sendLocalEvent(entity, EnemyEvent.EnemyTakeDamage, {damage: this.damage, knockback: {distance: this.knockBackDistance, direction: this.Direction}});
          this.enemiesAvoidList.push(entity);
        } else
        {
          return
        }

        if(this.HandleRicochet(entity))
        {
          return;
        } else
          if(this.HandlePiercing())
          {
            return;
          }

        this.Kill();
      }
    });
  }
  override Kill(): boolean
  {
    if(this.weapon)
    {
      this.weapon.stop();
    }
    return super.Kill();
  }
  override start(): void
  {
    super.start()
    this.weapon = this.props.renderer?.children.get()[0].as(hz.ParticleGizmo);

    if(this.weapon)
    {
      this.weapon.owner.set(this.currentPlayer)
    }
  }

  override OnBegin()
  {
    this.entityManager = this.ServiceLocator.Resolve<EntityManager>(EntityManager);
    this.characterManager = this.ServiceLocator.Resolve<CharacterManager>(CharacterManager);
    this.elapsedTime = 0;
    this.Enable(true);
  }

  override SetBullet()
  {
    super.SetBullet()
    if(this.weapon)
    {
      this.weapon.play();
    }
  }

  public override BounceLimitCheck()
  {
    this.enemiesAvoidList = []
    super.BounceLimitCheck()
  }
  protected OnEnd()
  {
    super.OnEnd();
    this.enemiesRicocheted = [];
    this.amountRicochet = 0;
    this.knockBackDistance = 0;
  }

  private HandlePiercing(): boolean
  {

    if(this.amountPiercing > 0)
    {

      this.amountPiercing--
      return true
    }

    return false;
  }

  private HandleRicochet(entity: hz.Entity): boolean
  {
    if((this.amountRicochet > 0) && this.entityManager)
    {
      let enemies = this.entityManager.FindEntities(Enemy).slice();;
      let enemyTrigger: Enemy | undefined = undefined;
      //Find enemy by entity trigger.
      for(const enemy of enemies)
      {
        if(enemy.Entity.id === entity.id)
        {
          enemyTrigger = enemy;
          break;
        }
      }
      //Add to ricochet list and remove enemy in enemies array to find nearest enemy not duplicate.
      if(enemyTrigger)
      {
        this.enemiesRicocheted.push(enemyTrigger);
        for(const enemyRicocheted of this.enemiesRicocheted)
        {
          const index = enemies.indexOf(enemyRicocheted, 0);
          if(index > -1)
          {
            enemies.splice(index, 1);
          }
        }
      }

      let neareatEnemyPosition = FinderTargetHelper.GetNearestEntityPosistion(this.Position, enemies);
      if(neareatEnemyPosition)
      {
        this.SetTarget(neareatEnemyPosition);
        this.SetBullet(); // Call fire again to update new direction
        this.amountRicochet--;
      }
      return neareatEnemyPosition != undefined;
    }
    return false;
  }


  override SetBulletConfig(bulletConfig: BulletConfig & BulletPlayerFeature): void
  {
    super.SetBulletConfig(bulletConfig);
    this.amountRicochet = bulletConfig.Ricochet;
    this.knockBackDistance = bulletConfig.KnockBackDistance;
    this.amountPiercing = bulletConfig.Piercing

  }
}
hz.Component.register(Bullet_Player);