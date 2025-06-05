import * as hz from 'horizon/core';
import {BehaviorTreeBuilder} from 'BehaviorTreeManager';
import {CharacterManager} from 'CharacterManager';
import {EnemyID, EnemyType, KNOCK_BACK_TIME_DEFAULT} from 'Enemy_Const';
import {Entity} from 'Entity';
import {EntityManager} from 'EntityManager';
import {Entity_Shadow} from 'Entity_Shadow';
import {EnemyEvent} from 'EventContainer';
import {EnemySpawnerEffect, SPAWNER_EFFECT_ASSET_ID} from 'E_EnemySpawnerEffect';
import {HealthBar} from 'E_HealthBar';
import {ConfigManager} from 'ConfigManager';
import {ServiceLocator} from 'ServiceLocator';
import {DamageObserverController, IDamageReceiver, IDamageReceiverObservable} from 'IDamageReceiver';
import {CustomTimeMonitor, ITimeMonitor} from 'ITimeMonitor';
import {ITextManager, TextManager} from 'TextManager';
import {Delay, Assert, Approximately, RoundToPrecision} from 'Utilities';
import {EntityAssetIDs} from 'ConfigAssets';
import {SHADOW_SCALE_CONFIG} from 'Config_Enemies';
import {IBehaviorAgent, IEnemyBehaviorAgent} from 'IBehaviorAgent';
import {IStatsManager, Stats, StatsManager, StatsManagerExtension} from 'IStatsManager';
import {ObserverHandle} from 'ObserverHandle';
import {EnemyConfig} from 'IEntityConfig';
import {IScheduleManager, ScheduleManager} from 'IScheduleManager';
import {EffectManager, IEffectManager} from 'IEffectManager';
import {Set_Boss_Hp_Percent as Set_Boss_Hp_Percent_Event, Set_Boss_Name_Event} from 'UI_IngameDialog';
import {ENEMY_ANIMATION_STATE, EnemyAnimationHandler, IEnemyAnimationHandler} from 'IEnemyAnimationHandler';

enum State
{
  None,
  Initialized,
  Spawning,
  Active,
  Dead,
}

export class Enemy extends Entity<typeof Enemy> implements IEnemyBehaviorAgent, IDamageReceiver
{
  static propsDefinition = {
    renderer: {type: hz.PropTypes.Entity},
    vfxEnemy: {type: hz.PropTypes.Entity},
    enemyTrigger: {type: hz.PropTypes.Entity},
  };

  private rotation = hz.Vec3.zero;
  private knockBackResistance = 0;
  private collisionDamage = 0;
  private renderer: hz.Entity | undefined;
  private shadow: Entity_Shadow | undefined;
  private observerHandler = -1;
  private healthBar: HealthBar | undefined;
  private state: State = State.None;
  private timeMonitor: ITimeMonitor = new CustomTimeMonitor();
  private behaviorTree: BehaviorTreeBuilder | undefined;
  private entityManager: EntityManager | undefined;
  private textManager: ITextManager | undefined;
  private characterManager: CharacterManager | undefined;
  private knockBackHandlers: Array<(deltaTime: number) => void> = [];
  private statsManager: IStatsManager | undefined;
  private scheduleManager: IScheduleManager = new ScheduleManager();
  private effectManager: IEffectManager = new EffectManager(this.scheduleManager, []);
  private handle: ObserverHandle = new ObserverHandle();
  private enemyVFX: hz.ParticleGizmo | undefined
  public IsKnockBacked = false;
  public EnemyID: EnemyID | undefined;
  public Speed: number = 0;
  public EnemyType: EnemyType = EnemyType.NORMAL;
  public IsInvicible = true;
  public IsEnable = false;
  public DamageReceiverObserver: DamageObserverController = new DamageObserverController(this);
  public EnemyAnimationHandler: IEnemyAnimationHandler = new EnemyAnimationHandler(this);


  public get Rotation()
  {
    return this.rotation;
  }

  public set Rotation(value)
  {
    //All renderer need to be have pivot at bottom, means: at 0 position in world.
    //Block rotate Y (up, down rotation).
    value.y = 0;
    if(this.rotation == value)
    {
      return;
    }
    this.rotation = value;
    this.renderer?.lookAt(this.rotation);
  }

  start()
  {
    super.start();
    this.OnColliderEvent();
    this.renderer = this.props.renderer;
    if(this.props.vfxEnemy)
    {
      this.enemyVFX = this.props.vfxEnemy.as(hz.ParticleGizmo);
    }

    if(this.currentPlayer == this.world.getServerPlayer()) return;


    this.entity.tags.add('enemy');

    this.observerHandler = this.AddObserver({
      OnBegin: () =>
      {
        this.entityManager = this.ServiceLocator.Resolve<EntityManager>(EntityManager);
        this.textManager = this.ServiceLocator.Resolve<TextManager>(TextManager);
        this.characterManager = this.ServiceLocator.Resolve<CharacterManager>(CharacterManager);
        this.state = State.Initialized;
        this.IsInvicible = true;
        this.IsEnable = true;
        this.Enable(false);
        this.SetupEnemy();
      },
      OnEnd: () =>
      {
        this.Enable(false);
        this.shadow?.Kill();
        this.IsEnable = false;
        this.shadow = undefined;
        this.healthBar = undefined;
        this.entityManager = undefined;
        if(this.enemyVFX)
        {
          this.enemyVFX.stop()
        }
        this.IsInvicible = true;
        this.statsManager?.Dispose();
        this.statsManager = undefined;
        this.handle.Dispose();
        this.sendLocalBroadcastEvent(EnemyEvent.EnemyDeath, {enemy: this});
      },
    });

  }

  private async CreateHealthBar(config: EnemyConfig)
  {
    await this.entityManager?.CreateEntity(EntityAssetIDs.HealthBarID, (it) =>
    {
      let healhBarComp = it as HealthBar;
      const offset = new hz.Vec3(-0.5, 1, 0.5); // x base on scaler of size vfx. 
      healhBarComp.Position = this.Position;
      healhBarComp.SetColor(new hz.Color(1, 0, 0)); //Red color, For test.
      healhBarComp.SetSize(0.5);
      healhBarComp.SetTranformConstraint(this.entity, offset, hz.Vec3.one, new hz.Quaternion(0, 1, 0, 0));
      healhBarComp.ToggleVisibility(false);
      this.healthBar = healhBarComp;
      this.healthBar?.SetMaxHealth(config.MaxHealth);
      this.healthBar?.SetHealth(config.MaxHealth);
    });
  }

  private CreateShadow()
  {
    this.entityManager?.CreateEntity(EntityAssetIDs.ShadowID, (it) =>
    {
      const shadowComp = it as Entity_Shadow;
      let shadowScale = hz.Vec3.zero;
      if(this.EnemyID)
      {
        shadowScale = SHADOW_SCALE_CONFIG.get(this.EnemyID) ?? shadowScale;
      }
      const offsetShader = new hz.Vec3(0, 0, -0.15);
      shadowComp.Position = this.Position;
      shadowComp.SetTranformConstraint(this.entity, offsetShader, shadowScale);
      this.shadow = shadowComp;
    });
  }

  private async HandleKnockBack(direction: hz.Vec3, distance: number)
  {
    if(this.knockBackResistance == 1 || !this.IsAlive) return; // No knockback when resistance = 1.
    this.IsKnockBacked = true;
    const startPosition = this.Position;
    startPosition.y = 0
    const endPosition = this.Position.add(direction.normalize().mul(distance * (1 - this.knockBackResistance)));

    const knockBackTime = KNOCK_BACK_TIME_DEFAULT * (1 - this.knockBackResistance);
    this.EnemyAnimationHandler.SetAnimationState(ENEMY_ANIMATION_STATE.HIT);

    let timeEslapse = 0;
    let knockBackProcess = async (deltaTime: number) =>
    {
      if(timeEslapse < knockBackTime)
      {
        timeEslapse += deltaTime;
        this.Position = hz.Vec3.lerp(startPosition, endPosition, timeEslapse / knockBackTime);
      } else
      {
        this.Position = endPosition;
        this.knockBackHandlers = this.knockBackHandlers.filter((it) => it !== knockBackProcess);
        // Delay for 0.2 second to make enemy stun after knockback.
        await Delay(this, 0.2);
        this.IsKnockBacked = false;
      }
    };

    this.knockBackHandlers.push(knockBackProcess);
  }

  private ClearAllKnockBackProcess()
  {
    this.IsKnockBacked = false;
    this.knockBackHandlers = [];
  }

  private Enable(enable: boolean)
  {
    this.entity.visible.set(enable);
    this.entity.collidable.set(enable);
  }

  private SetConfig(config: EnemyConfig)
  {
    this.statsManager = StatsManagerExtension.WithBody(new StatsManager(this.effectManager), config, this.DamageReceiverObserver, 1);
    this.healthBar?.SetMaxHealth(config.MaxHealth);
    this.healthBar?.SetHealth(config.MaxHealth);

    this.knockBackResistance = config.KnockBackResistance;
    this.Speed = config.MoveSpeed;
    this.EnemyType = config.EnemyType;
    this.collisionDamage = config.CollisionDamage;

    if(this.renderer && this.EnemyID)
    {
      this.EnemyAnimationHandler.SetupAnimationRoot(this.renderer, this.EnemyID)
      this.EnemyAnimationHandler.SetAnimationState(ENEMY_ANIMATION_STATE.IDLE);
    }

    //Set Boss UI Name
    if(this.EnemyType === EnemyType.BOSS)
    {
      this.sendLocalBroadcastEvent(Set_Boss_Name_Event, {name: config.Name});
    }

    this.handle.AddObserver(this.statsManager, {
      OnStatsChanged: (stat, value) =>
      {
        if(stat === Stats.Health)
        {
          this.healthBar?.SetHealth(value);

          //Set Boss UI Hp Bar
          if(this.EnemyType === EnemyType.BOSS)
            this.sendLocalBroadcastEvent(Set_Boss_Hp_Percent_Event, {hp: value, maxHp: config.MaxHealth});

          if(Approximately(value, 0) && this.state != State.Dead)
          {
            this.StartDeathProcess();
          }
        }
      },
    });
    this.DamageReceiverObserver.SetConfig(this.statsManager, false);

    this.knockBackResistance = config.KnockBackResistance;
    this.Speed = config.MoveSpeed;
    this.EnemyType = config.EnemyType;
    this.collisionDamage = config.CollisionDamage;
    let behaviorConfigClone = config.BehaviorConfig.Clone();
    let behaviorConfig = behaviorConfigClone.CreateAction(this.ServiceLocator, this.timeMonitor, this, this);
    this.behaviorTree = new BehaviorTreeBuilder(behaviorConfig);
  }

  private OnColliderEvent(): void
  {
    this.connectLocalEvent(this.entity, EnemyEvent.EnemyTakeDamage, (data) =>
    {
      this.DamageReceiverObserver.TakeDamage(data.damage, false);
      this.HandleKnockBack(data.knockback.direction, data.knockback.distance);
    });

    if(this.props.enemyTrigger)
    {
      this.connectCodeBlockEvent(this.props.enemyTrigger, hz.CodeBlockEvents.OnPlayerEnterTrigger, async () =>
      {
        if(this.IsAlive && !this.IsInvicible)
        {
          if(this.characterManager?.DamageReceive.CanTakeDamage())
          {
            this.characterManager?.DamageReceive.TakeDamage(this.collisionDamage, false);
          }
        }
      });
    }
  }

  private SetupEnemy()
  {
    if(this.EnemyID == undefined)
    {
      return;
    }
    let configManager = ServiceLocator.Instance.Resolve<ConfigManager>(ConfigManager);
    let config = configManager.CreateEnemyConfig(this.EnemyID);
    if(config == undefined)
    {
      console.error("Do not have enemy config");
      return;
    }
    if(config.EnemyType !== EnemyType.BOSS)
    {
      this.CreateHealthBar(config);
    }
    this.SetConfig(config);
  }

  private async StartDeathProcess()
  {
    this.healthBar?.Kill();
    this.IsInvicible = true;
    this.state = State.Dead;
    this.entity.collidable.set(false);
    await this.EnemyAnimationHandler.SetAnimationState(ENEMY_ANIMATION_STATE.DEATH);
    this.ClearAllKnockBackProcess();
    this.Kill();
  }
  CanTakeDamage(): boolean
  {
    return !this.IsInvicible && this.IsEnable && this.IsAlive;
  }

  AddEffect(id: string, duration: number, amount: number): void
  {
    //
  }


  public TakeDamage(amount: number, isCritical: boolean = false): void
  {
    if(!this.IsAlive)
    {
      return;
    }
    let spawnTextOffset = new hz.Vec3(0, 2, 0.5);
    this.textManager?.SpawnDamageText(this.Entity, spawnTextOffset, RoundToPrecision(amount, 2), isCritical, '');
  }


  public Process(deltaTime: number)
  {
    this.scheduleManager.ProcessUpdate(deltaTime);
    this.timeMonitor.DeltaTime = deltaTime;
    if(this.state !== State.Active)
    {
      return;
    }
    this.behaviorTree?.Tick();
    if(this.IsKnockBacked)
    {
      this.knockBackHandlers.forEach((processKnockBack) =>
      {
        processKnockBack(deltaTime);
      });
    }
  }

  public SetEnemyID(enemyID: EnemyID)
  {
    this.EnemyID = enemyID;
  }

  public async Spawn(): Promise<void>
  {
    Assert.IsTrue(this.state === State.Initialized, 'Invalid state');
    Assert.IsNotNull(this.entityManager, `Invalid Manager`);
    this.state = State.Spawning; // Improve me: add spawn animation, then set to active.
    let spawner = await this.entityManager!.CreateEntity(SPAWNER_EFFECT_ASSET_ID);
    let spawnerComponent = spawner as EnemySpawnerEffect;
    await spawnerComponent.Show(this.Position);
    this.CreateShadow();
    this.healthBar?.ToggleVisibility(true);
    if(this.enemyVFX)
    {
      this.enemyVFX.play()
    }
    this.Enable(true);
    await spawnerComponent.Hide();
    this.IsInvicible = false;
    this.state = State.Active;
  }
}

hz.Component.register(Enemy);