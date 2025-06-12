import * as hz from 'horizon/core';
import {Bullet_Player} from 'Bullet_Player';
import {Bullet_Straight} from 'Bullet_Straight';
import {BulletConfig, BulletPlayerFeature} from 'Enemy_Data';
import {Entity} from 'Entity';
import {EntityManager} from 'EntityManager';
import {FinderTargetHelper} from 'FinderTargetHelper';
import {HealthBar} from 'E_HealthBar';
import {InGameData, IngameDataEnum} from 'IngameData';
import {EnemyMarker} from 'E_EnemyMarker';
import {IStateManager, StateManager} from 'IStateManager';
import {ITextManager, TextManager} from 'TextManager';
import {Shield} from 'E_Shield';
import {ObserverHandle} from 'ObserverHandle';
import {AnimationRendererExtensions, CharacterAnimate, CharacterAnimationRenderer, CharacterAnimationState, IAnimationRenderer} from 'IAnimationRenderer';
import {Approximately, Assert, Delay, RandomBoolean, RandomFloat, RandomInt, RotateAroundY, RoundToPrecision} from 'Utilities';
import {ANIMATION_PLAYER_SHOOT_CONFIG, EntityAssetIDs} from 'ConfigAssets';
import {IBehaviorAgent} from 'IBehaviorAgent';
import {DamageObserverController, IDamageReceiver, IDamageReceiverObservable} from 'IDamageReceiver';
import {AttackStatsManager, BodyStatsManager, IStatsManager, Stats, StatsManager, StatsManagerExtension} from 'IStatsManager';
import {IAttackBehaviorConfig, IPlayerConfig} from 'IEntityConfig';
import {NullBehavior} from 'IBehaviorConfig';
import {IScheduleManager, ScheduleManager} from 'IScheduleManager';
import {EffectManager, EffectManagerExtensions, IEffectManager} from 'IEffectManager';
import {BulletStats, StatsBulletManager} from 'IStatsBulletManager';
import {HealObserverController, IHealReceiver, IHealReceiverObservable} from 'IHealReceiver';
import {HEAL_CONFIG} from 'Skill_Const';
import {SkillCharacterStatsID, SkillRecoveryID} from 'Config_Skills';

//FOR TEST
const JOYSTICK_DEATHZONE = 0.03;
const DISTANCE_PROJECTILE_OFFSET = 0.2
const PROJECTILE_LENGTH = 1
const BOW_ITEM = "BowItem";

// For Test
const PlayerBulletConfig: BulletConfig & BulletPlayerFeature = {
  ID: 'bulllet',
  AssetID: '1174756777991925',
  MoveSpeed: 20,
  Damage: 0,
  KnockBackDistance: 1,
  AliveTime: 10,
  Elemental: '',
  MoveBehavior: new Bullet_Straight(),
  Bounce: 0,
  Piercing: 0,
  Ricochet: 0,
};

const PLAYER_BODY_CONFIG: IPlayerConfig = {
  MaxHealth: 150,
  MoveSpeed: 5,
  Defense: 1,
  BehaviorConfig: new NullBehavior(), // Fix me
  DodgeRate: 0.01,
}

export class PlayerController extends Entity<typeof PlayerController> implements IBehaviorAgent, IDamageReceiver, IHealReceiver
{

  private xAxis!: hz.PlayerInput;
  private zAxis!: hz.PlayerInput;
  private isShooting: boolean = true;
  private canShoot: boolean = false;
  private observerHandler = -1;
  private entityManager: EntityManager | undefined;
  private stateManager: IStateManager | undefined;
  private scheduleManager: IScheduleManager = new ScheduleManager();
  private effectManager: IEffectManager | undefined;
  private statsManager: IStatsManager | undefined;
  private textManager: ITextManager | undefined;
  private healthBar: HealthBar | undefined;
  private enemyMarker: EnemyMarker | undefined;
  private handle: ObserverHandle = new ObserverHandle();
  private animationRenderer: IAnimationRenderer | undefined;
  private nearestEnemyPosition: hz.Vec3 | undefined;
  private shootRate: number = 0;
  private bulletConfig = PlayerBulletConfig;
  private firePosition: hz.Entity | undefined

  private bodyStatsManager: BodyStatsManager | undefined;
  private attackStatsManager: IStatsManager | undefined;
  private bulletStatsManager: IStatsManager | undefined;

  public HealReceiverObserver: IHealReceiverObservable = new HealObserverController(this);
  public DamageReceiverObserver: DamageObserverController = new DamageObserverController(this);

  public IsInvicible: boolean = false;
  public Speed = 0;
  Rotation = hz.Vec3.zero;
  IsKnockBacked: Readonly<boolean> = false;
  IsEnable: Readonly<boolean> = true;

  public get Position()
  {
    return this.currentPlayer.position.get();
  }

  public set Position(value)
  {
    this.currentPlayer.position.set(value);
  }

  public get RotationQuanternion()
  {
    return this.currentPlayer.rotation.get();
  }

  public set RotationQuanternion(value)
  {
    this.currentPlayer.rootRotation.set(value);
  }


  start(): void
  {
    super.start();

    if(this.currentPlayer == this.world.getServerPlayer()) return;
    this.scheduleManager = new ScheduleManager();

    this.observerHandler = this.AddObserver({
      OnBegin: () =>
      {
        this.entityManager = this.ServiceLocator.Resolve<EntityManager>(EntityManager);
        this.stateManager = this.ServiceLocator.Resolve<StateManager>(StateManager);
        this.textManager = this.ServiceLocator.Resolve<TextManager>(TextManager);
        this.Initialize();

        this.handle.AddObserver(this.stateManager, {
          OnRevived: () =>
          {
            this.Revive();
          },
          OnCompleted: () =>
          {
            this.currentPlayer.velocity.set(hz.Vec3.zero);
          },
          OnPaused: (isPaused) =>
          {
            if(isPaused)
            {
              this.currentPlayer.velocity.set(hz.Vec3.zero);
              this.ClearShootAnimation(); // IMPPROVE ME, animation renderer should be has clear current animation.
            }
          }
        })
      },
      OnEnd: () =>
      {
        this.scheduleManager.ClearAll();
        this.handle.Dispose();
        this.healthBar?.Kill();
        this.healthBar = undefined;
        this.enemyMarker?.Kill();
        this.enemyMarker = undefined;
        this.xAxis.disconnect();
        this.zAxis.disconnect();
      },
    });
    let shootAnimate = new CharacterAnimate(
      this.currentPlayer,
      new hz.Asset(BigInt(ANIMATION_PLAYER_SHOOT_CONFIG.AssetID), BigInt(ANIMATION_PLAYER_SHOOT_CONFIG.VersionID)),
      ANIMATION_PLAYER_SHOOT_CONFIG.Duration);
    // Work around animation bug first time.
    shootAnimate.PlayAnimation();
    shootAnimate.Clear();
    // End work
    shootAnimate.SetLoop(true);

    let animateRecord: Record<CharacterAnimationState, CharacterAnimate> = {
      [CharacterAnimationState.Shoot]: shootAnimate,
    };
    this.animationRenderer = new CharacterAnimationRenderer(animateRecord, this.currentPlayer);

    //IMPROVE WHEN HAVE EQUIPMENT SYSTEM
    this.firePosition = this.world.getEntitiesWithTags([BOW_ITEM])[0]

  }

  private UpdateConfig()
  {
    this.effectManager = this.ServiceLocator.Resolve<EffectManager>(EffectManager);
    this.statsManager = this.ServiceLocator.Resolve<StatsManager>(StatsManager);
    this.bodyStatsManager = StatsManagerExtension.WithBody(this.statsManager, PLAYER_BODY_CONFIG, this.DamageReceiverObserver, 1, this.HealReceiverObserver) as BodyStatsManager;
    let attackConfig: IAttackBehaviorConfig = {
      Damage: InGameData.GetAttribute(IngameDataEnum.BaseAttackPower),
      DamageMultiplier: 1,
      CriticalRate: InGameData.GetAttribute(IngameDataEnum.BaseCritChance),
      CriticalDamage: InGameData.GetAttribute(IngameDataEnum.BaseCritDamage),
      AttackSpeed: InGameData.GetAttribute(IngameDataEnum.BaseAttackSpeed),
    }

    this.attackStatsManager = StatsManagerExtension.WithAttack(this.statsManager, attackConfig);
    this.bulletStatsManager = new StatsBulletManager(this.effectManager, this.bulletConfig);

    this.DamageReceiverObserver.SetConfig(this.bodyStatsManager, true);

    this.handle.AddObserver(this.bodyStatsManager, {
      OnStatsChanged: (stat, value) =>
      {
        switch(stat)
        {
          case Stats.MaxHealth:
            this.healthBar?.SetMaxHealth(value);
            break;
          case Stats.Health:
            this.healthBar?.SetHealth(value);
            if(Approximately(RoundToPrecision(value, 2), 0))
            {
              this.Die();
            }
            break;
          case Stats.MovementSpeed:
            this.Speed = RoundToPrecision(value, 2);
            break;
        }
      }
    });

    this.handle.AddObserver(this.attackStatsManager, {
      OnStatsChanged: (stat, value) =>
      {
        switch(stat)
        {
          case Stats.AttackSpeed:
            this.SetShootRate(value);
            break;
        }
      },
    });

    this.handle.AddObserver(this.bulletStatsManager, {
      OnStatsChanged: (stat, value) =>
      {
        switch(stat)
        {
          case BulletStats.Bounce:
            break;
          // case Bullet
          case BulletStats.DoubleAttack:
            break;
        }
      }
    })
    this.Speed = PLAYER_BODY_CONFIG.MoveSpeed;
    this.SetShootRate(attackConfig.AttackSpeed);

  }

  private async Initialize()
  {
    this.CreateHealthBar();
    this.CreateEnemyMarker();
    this.UpdateConfig()
    this.Position = this.currentPlayer.position.get();
    this.Entity.as(hz.AttachableEntity).attachToPlayer(this.currentPlayer, hz.AttachablePlayerAnchor.Torso);

    // Register movement input 
    hz.PlayerControls.disableSystemControls();
    this.xAxis = hz.PlayerControls.connectLocalInput(hz.PlayerInputAction.LeftXAxis, hz.ButtonIcon.None, this);
    this.zAxis = hz.PlayerControls.connectLocalInput(hz.PlayerInputAction.LeftYAxis, hz.ButtonIcon.None, this);

    this.nearestEnemyPosition = undefined;
    this.currentPlayer.jumpSpeed.set(0);
    this.currentPlayer.locomotionSpeed.set(0);
    this.isShooting = false;
    this.IsInvicible = false;
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitWorld, (player) =>
    {
      this.xAxis.disconnect();
      this.zAxis.disconnect();
    });
  }

  private async Die()
  {
    this.ClearShootAnimation();
    this.nearestEnemyPosition = undefined;
    this.currentPlayer.velocity.set(hz.Vec3.zero);
    this.stateManager?.Fail();
  }

  private SetShootRate(rate: number)
  {
    this.shootRate = rate;
    this.SetAnimationShootRate(rate);
  }

  private async CreateHealthBar()
  {
    await this.entityManager?.CreateEntity(EntityAssetIDs.HealthBarID, (it) =>
    {
      let healhBarComp = it as HealthBar;
      healhBarComp.Position = this.Position;
      const offset = new hz.Vec3(-0.5, 2.5, 0.5); // x base on scaler of size vfx. 
      healhBarComp.SetColor(new hz.Color(0, 1, 0)); //Red color, For test.
      healhBarComp.SetSize(0.5);
      healhBarComp.SetTranformConstraint(this.Entity, offset, hz.Vec3.one, new hz.Quaternion(0, 1, 0, 0));
      this.healthBar = healhBarComp;
      this.healthBar.entity.owner.set(this.currentPlayer)
      this.healthBar.ToggleVisibility(true);
      this.healthBar.SetMaxHealth(PLAYER_BODY_CONFIG.MaxHealth);
      this.healthBar.SetHealth(PLAYER_BODY_CONFIG.MaxHealth);
    })
  }

  private async CreateEnemyMarker()
  {
    await this.entityManager?.CreateEntity(EntityAssetIDs.MarkerID, (it) =>
    {
      let enemyMarker = it as EnemyMarker;
      this.enemyMarker = enemyMarker;
    })
  }

  private UpdateEnemyMarkerPosition(target: hz.Vec3 | undefined)
  {
    if(!this.enemyMarker || !this.enemyMarker.IsAlive)
    {
      return;
    }
    this.enemyMarker.ToggleVisibility(target !== undefined);
    if(target)
    {
      this.enemyMarker.Position = target;
    }
  }

  private IsInDeathZoneJoystick(xAxisValue: number, zAxisValue: number): boolean
  {
    return (Math.abs(xAxisValue) <= JOYSTICK_DEATHZONE) && (Math.abs(zAxisValue) <= JOYSTICK_DEATHZONE);
  }

  private async Shoot()
  {
    Assert.IsNotNull(this.bulletStatsManager, "BulletStatsManager not Valid");
    Assert.IsNotNull(this.entityManager, "Entity Manager not Valid");
    Assert.IsNotNull(this.firePosition, "Entity Manager not Valid");
    let attackAmount = this.bulletStatsManager!.GetStats(BulletStats.DoubleAttack);

    //Not found the nearest enemy. 
    if(!this.nearestEnemyPosition)
    {
      return;
    }

    this.isShooting = true;
    let nearestEnemyPosition = this.nearestEnemyPosition;

    // Adjust shooting animation rate.

    this.animationRenderer?.SetTimerCallback(
      CharacterAnimationState.Shoot,
      ANIMATION_PLAYER_SHOOT_CONFIG.Timer / 30,
      async () =>
      {
        for(let index = 0; index <= attackAmount; index++)
        {

          const directionToEnemy = nearestEnemyPosition.sub(this.Position).normalize();
          const offset = directionToEnemy.mul((PROJECTILE_LENGTH + DISTANCE_PROJECTILE_OFFSET) * index);
          const firePos = this.firePosition!.position.get().add(offset);
          //IMPROVE ME.
          if(this.bulletStatsManager && this.bulletStatsManager.GetStats(BulletStats.SpreadShoot) > 0)
          {
            await this.ShootSpreadStrategy(directionToEnemy, firePos);
          } else
          {
            await this.ShootSingleStrategy(nearestEnemyPosition, firePos);
          }
        }
      })
    await this.PlayAnimation(CharacterAnimationState.Shoot);
    this.isShooting = false;


  }

  //Improve me: Make me to system shoot strategy
  private async ShootSingleStrategy(target: hz.Vec3, position: hz.Vec3)
  {
    Assert.IsNotNull(this.entityManager, `Entity Manager not Valid`);
    let bullet = await this.entityManager!.CreateEntity(EntityAssetIDs.PlayerBulletID);
    bullet.Position = position;
    let bulletCom = bullet as Bullet_Player;
    bulletCom.SetBulletConfig({
      ...this.bulletConfig,
      Damage: this.DamageCaculator(),
      Bounce: this.bulletStatsManager?.GetStats(BulletStats.Bounce) ?? 0,
      Ricochet: this.bulletStatsManager?.GetStats(BulletStats.Richochet) ?? 0,
      Piercing: this.bulletStatsManager?.GetStats(BulletStats.Piercing) ?? 0,
    });
    bulletCom.SetFirePosition(position);
    bulletCom.SetTarget(target);
    bulletCom.SetBullet();
  }

  private DamageCaculator(): number
  {
    let critRate = this.attackStatsManager?.GetStats(Stats.CriticalRate) ?? 0;
    let criticalDamage = this.attackStatsManager?.GetStats(Stats.CriticalDamage) ?? 1;
    let isCritical = RandomBoolean(critRate);
    let damage = (this.attackStatsManager?.GetStats(Stats.Damage) ?? 0) +
      (this.bulletStatsManager?.GetStats(BulletStats.Damage) ?? 0)
    return RoundToPrecision((isCritical ? damage * criticalDamage : damage), 2);
  }
  private async ShootSpreadStrategy(targetDirection: hz.Vec3, position: hz.Vec3)
  {
    Assert.IsNotNull(this.entityManager, `Entity Manager not Valid`);
    const spreadAmount = 3;
    const spreadAngle = 60;
    const shootDirection = targetDirection;
    for(let i = 0; i < spreadAmount; i++)
    {
      let bullet = await this.entityManager!.CreateEntity(EntityAssetIDs.PlayerBulletID);
      bullet.Position = position;
      let bulletCom = bullet as Bullet_Player;
      let angle = -spreadAngle / 2 + spreadAngle / (spreadAmount - 1) * i;
      let spreadDirection = RotateAroundY(shootDirection, angle);
      let targetSpread = position.add(spreadDirection);
      bulletCom.SetBulletConfig({
        ...this.bulletConfig,
        Damage: this.DamageCaculator(),
        Bounce: this.bulletStatsManager?.GetStats(BulletStats.Bounce) ?? 0,
        Ricochet: this.bulletStatsManager?.GetStats(BulletStats.Richochet) ?? 0,
        Piercing: this.bulletStatsManager?.GetStats(BulletStats.Piercing) ?? 0,
      });
      bulletCom.SetFirePosition(position);
      bulletCom.SetTarget(targetSpread);
      bulletCom.SetBullet();
    }
  }

  private ClearShootAnimation()
  {
    this.animationRenderer?.ClearAnimation(CharacterAnimationState.Shoot);
    this.isShooting = false;
  }

  private ProcessShoot()
  {
    if(this.canShoot && !this.isShooting)
    {
      this.Shoot();
    }
    if(!this.canShoot)
    {
      this.ClearShootAnimation();
    }
  }

  private SetAnimationShootRate(rate: number)
  {
    this.animationRenderer?.SetRateAnimation(CharacterAnimationState.Shoot, rate);
  }

  private async PlayAnimation(id: string)
  {
    if(this.animationRenderer == undefined)
    {
      console.error(`Animation Renderer Was Null`);
      return;
    }
    await AnimationRendererExtensions.PlayAnimationAsync(this.animationRenderer, id);
  }

  public Process(deltaTime: number)
  {
    this.scheduleManager.ProcessUpdate(deltaTime);
    this.animationRenderer?.ProcessUpdate(deltaTime);
    this.ProcessShoot();
    this.Entity.moveRelativeToPlayer(this.currentPlayer, hz.PlayerBodyPartType.Torso, hz.Vec3.zero);
    // FIX ME: There a issue when I try set locomotionSpeed in start
    this.currentPlayer.locomotionSpeed.set(0);

    let xAxisValue = this.xAxis.axisValue.get();
    let zAxisValue = this.zAxis.axisValue.get();
    let isPlayerNotMoving = this.IsInDeathZoneJoystick(xAxisValue, zAxisValue);

    if(this.stateManager && this.stateManager.IsTriggered)
    {
      // Update enemy marker position
      if(this.entityManager)
      {
        this.nearestEnemyPosition = FinderTargetHelper.GetNearestEnemyPosition(this.Position, this.entityManager)
      };

      this.UpdateEnemyMarkerPosition(this.nearestEnemyPosition); // IMPROVE ME: bring me to another scripts to control
      this.canShoot = isPlayerNotMoving && this.nearestEnemyPosition !== undefined;
      if(isPlayerNotMoving && this.nearestEnemyPosition)
      {
        this.RotationQuanternion = hz.Quaternion.lookRotation(this.nearestEnemyPosition.sub(this.Position).normalize());
      }
    } else
    {
      this.UpdateEnemyMarkerPosition(undefined); // IMPROVE ME: bring me to another scripts to control
    }

    if(isPlayerNotMoving)
    {
      this.currentPlayer.velocity.set(hz.Vec3.zero);
      return;
    }
    // Player movement
    let moveDirection = hz.Vec3.forward.mul(zAxisValue).add(hz.Vec3.right.mul(xAxisValue)).normalize();
    this.currentPlayer.velocity.set(moveDirection.mul(this.Speed));
  }

  /**
   * 
   * @param duration duration in seconds
   */
  public SetInvulnerable(duration: number = 0)
  {
    this.IsInvicible = true;
    this.scheduleManager.ScheduleOnce(duration, () =>
    {
      this.IsInvicible = false;
    })

  }

  public GetPlayer()
  {
    return this.currentPlayer;
  }

  CanTakeDamage(): boolean
  {
    return this.IsAlive && !this.IsInvicible && this.IsEnable;
  }

  AddEffect(id: string, duration: number, amount: number): void
  {
    //To do
  }

  public TakeDamage(damage: number, isCritical: boolean = false)
  {
    if(!this.IsAlive)
    {
      return;
    }
    this.SetInvulnerable(0.5); // For test, set invulnerable for 0.5 seconds after taking damage
    let offsetDamageNumber = new hz.Vec3(0, 2, 0.5); // For test, set offset for damage number
    this.textManager?.SpawnAllyDamageText(this.Entity, offsetDamageNumber, damage);
  }

  public Heal(isHealedByHeart: boolean, amount: number): void
  {
    if(!isHealedByHeart)
    {
      return;
    }

    Assert.IsNotNull(this.effectManager, 'Effect Manager was null');

    this.TryIncreaseStat(SkillRecoveryID.HeartIncreaseMaxHP, SkillCharacterStatsID.MaxHealthUp);
    this.TryIncreaseStat(SkillRecoveryID.HeartIncreaseAttackPower, SkillCharacterStatsID.AttackDamageUp);
  }

  private TryIncreaseStat(itemID: string, skillID: string): void
  {
    const effectItem = this.effectManager?.GetItem(itemID);

    if(effectItem && effectItem.Amount > 0)
    {
      //Improve config if stat change
      const chance = HEAL_CONFIG.IncreaseStatChance;

      if(Math.random() <= chance)
      {
        EffectManagerExtensions.ApplyItem(this.effectManager!, skillID, 999, undefined, effectItem.Amount);
      }
    }
  }


  public Revive()
  {
    const timeInvulnerableRevive = 3; // 3 is time invisible for revive. for test
    this.SetInvulnerable(timeInvulnerableRevive);
    this.HealReceiverObserver.Heal(false, 1);

    this.entityManager?.CreateEntity(EntityAssetIDs.ShieldID, (it) =>
    {
      it.Position = this.Position;
      let shield = it as Shield;
      shield.SetShield(this.Entity, timeInvulnerableRevive);
    })
  }

  public GetStats(stat: string): number
  {
    switch(stat)
    {
      case Stats.Health:
      case Stats.MaxHealth:
      case Stats.MovementSpeed:
      case Stats.Defense:
      case Stats.DodgeRate:
        return this.bodyStatsManager?.GetStats(stat) ?? 0;
      case Stats.Damage:
      case Stats.CriticalRate:
      case Stats.CriticalDamage:
      case Stats.AttackSpeed:
        return this.attackStatsManager?.GetStats(stat) ?? 0;
      default: return this.statsManager?.GetStats(stat) ?? 0;
    }
  }
}
hz.Component.register(PlayerController);