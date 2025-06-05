import * as hz from 'horizon/core';
import {EntityManager} from 'EntityManager';
import {Local_PoolManager} from 'Local_PoolManager';
import {IServiceLocator, ServiceLocator} from 'ServiceLocator';
import {SD_LocalDataManager} from 'SD_LocalDataManager';
import {ConfigManager} from 'ConfigManager';
import {WaveConfigManager} from 'WaveConfigManager';
import {ITextManager, TextManager} from 'TextManager';
import {CharacterManager} from 'CharacterManager';
import {IStateManager, StateManager} from 'IStateManager';
import {ObserverHandle} from 'ObserverHandle';
import {IObserverManager, ObserverManager} from 'IObserverManager';
import {Camera_Activity} from 'Camera_Activity';
import {WaveManager} from 'WaveManager';
import {CharacterLevelManager} from 'CharacterLevelManager';
import {BulletAcquireManager} from 'BulletAcquireManager';
import {EntityAssetIDs} from 'ConfigAssets';
import {SkillSelectionManager} from 'SkillSelectionManager';
import {EffectManager, IEffectManager} from 'IEffectManager';
import {IScheduleManager, ScheduleActivity, ScheduleManager} from 'IScheduleManager';
import {EffectItemConfig} from 'IEffectItemConfig';
import {SkillBulletStatsID, SkillCharacterStatsID, SkillRecoveryID} from 'Config_Skills';
import {IStatsManager, StatsManager} from 'IStatsManager';
import {Delay} from 'Utilities';
import {EnemyID} from 'Enemy_Const';
import {DelayTask, IDelayTask} from 'IDelayTask_DelayTask';
import {DelayTaskController} from 'IDelayTaskController';

export class LevelObserver
{
  /**
   * Called when the character takes damage.
   */
  public OnCharacterTakeDamage?: () => void;

  /**
   * Called when the level is completed.
   */
  public OnLevelCompleted?: () => void;

  /**
   * Called when the level fails.
   */
  public OnLevelFailed?: () => void;

  public OnWaveChanged?: (wave: number) => void;

  public OnCollectExp?: (expPercent: number) => void;

  public OnCharacterLevelUp?: (level: number, expPercent: number) => void;
}

export class GameManager extends hz.Component<typeof GameManager>
{
  static propsDefinition = {
    playerSpawnPoint: {type: hz.PropTypes.Entity},
  };

  private updateEvent: hz.EventSubscription | undefined;
  public currentPlayer: hz.Player | undefined;
  private entityManager: EntityManager | undefined; //FIX ME: change to interface
  private serviceLocator: IServiceLocator = new ServiceLocator();
  private playerDataManager: SD_LocalDataManager | undefined;
  private textManager: ITextManager | undefined;
  private stateManager: IStateManager | undefined; // TODO: Define the type of stateManager
  private effectManager: IEffectManager | undefined;
  private scheduleManager: IScheduleManager | undefined;
  private delayTaskController: DelayTaskController | undefined;

  private handle: ObserverHandle = new ObserverHandle();
  private cameraActivity: Camera_Activity | undefined;
  private configManager: ConfigManager | undefined;
  private waveConfigManager!: WaveConfigManager;
  private _isPaused: boolean = false;
  private isPlaying: boolean = true;


  public get isPaused()
  {
    return this._isPaused;
  }

  public set isPaused(value: boolean)
  {
    if(this._isPaused === value)
    {
      return;
    }
    this.stateManager?.DispatchEvent((observer) => observer.OnPaused?.(value));
    this._isPaused = value;

  }
  public characterManager: CharacterManager | undefined;
  public characterStatsManager: IStatsManager | undefined;
  public waveManager!: WaveManager;
  public skillSelectionManager: SkillSelectionManager | undefined;
  public levelManager: CharacterLevelManager | undefined;
  public ObserverManager: IObserverManager<LevelObserver> = new ObserverManager<LevelObserver>();


  preStart()
  {
    this.currentPlayer = this.entity.owner.get();
  }

  start()
  {
    if(this.currentPlayer == this.world.getServerPlayer()) return;

  }

  public async ScheduleDelay(delay: number)
  {
    const task = new DelayTask(delay);
    this.delayTaskController?.AddTask(task);
    return task.promise;
  }

  private async AcquireEntity()
  {
    if(!this.entityManager || !this.characterManager)
    {
      return;
    }
    let allsRequest: Array<Promise<void>> = [];
    // IMPROVE ME: need to set up require amount. avoid spawn delay make game not feel. And sometime wrong flow.
    const acquireAmounts = {
      enemyRequire: 6,
      lootExperience: 10,
      lootHealing: 10,
      shadow: 30,
      characterBullet: 60,
      healthBar: 10,
      enemyMarker: 1,
      playerController: 1,
      shield: 1,
      enemySpawnerEffect: 10,
    };

    let enemyIDs = [
      EnemyID.SLIME,
      EnemyID.RANGER_SLIME,
      EnemyID.SKELETON,
      EnemyID.ANDROID,
    ];

    for(let i = 0; i < enemyIDs.length; i++)
    {
      const element = enemyIDs[i];
      let enemyConfig = this.configManager?.GetEnemyConfig(element);
      if(enemyConfig)
      {
        let acquireEnemy = this.entityManager.AcquireEntity(enemyConfig.AssetID, acquireAmounts.enemyRequire);
        allsRequest.push(acquireEnemy);
      }
    }
    // Acquire other entities
    allsRequest.push(
      this.entityManager.AcquireEntity(EntityAssetIDs.LootItemExperienceID, acquireAmounts.lootExperience),
      this.entityManager.AcquireEntity(EntityAssetIDs.LootItemHealingID, acquireAmounts.lootHealing),
      this.entityManager.AcquireEntity(EntityAssetIDs.ShadowID, acquireAmounts.shadow),
      this.entityManager.AcquireEntity(EntityAssetIDs.PlayerBulletID, acquireAmounts.characterBullet),
      this.entityManager.AcquireEntity(EntityAssetIDs.HealthBarID, acquireAmounts.healthBar),
      this.entityManager.AcquireEntity(EntityAssetIDs.MarkerID, acquireAmounts.enemyMarker),
      this.entityManager.AcquireEntity(EntityAssetIDs.PlayerControllerID, acquireAmounts.playerController),
      this.entityManager.AcquireEntity(EntityAssetIDs.ShieldID, acquireAmounts.shield), // TODO: Define the shield asset ID
      this.entityManager.AcquireEntity(EntityAssetIDs.SpawnerEffectID, acquireAmounts.enemySpawnerEffect),
    );
    await Promise.all(allsRequest);
  }

  public LoadLevel()
  {
    // this.playerController?.OnStart();
    if(this.stateManager)
    {
      this.stateManager.IsPlaying = true;
      this.stateManager.IsTriggered = false;

    }
    this.isPlaying = true;
    this.waveManager?.SetupWaveManager();
    this.characterManager?.CreateCharacter();
    this.ConnectUpdate();
    this.waveManager?.EnemyDeathHandle();
    this.waveManager.FirstWaveHandle();
  }

  public Revive()
  {
    this.stateManager?.Revive();
  }

  public async Initialize()
  {
    if(this.currentPlayer == undefined)
    {
      console.error(`Player undefine`);
      return;
    }
    ServiceLocator.Instance.RegisterService(ConfigManager, 'ConfigManager');
    ServiceLocator.Instance.RegisterService(BulletAcquireManager, 'BulletAcquireManager');

    // Bullet require rely on config manager, so need to initialize config manager after provive Bullet Acquire.
    let bulletAcquireManager = new BulletAcquireManager();
    ServiceLocator.Instance.Provide(BulletAcquireManager, bulletAcquireManager);

    this.configManager = new ConfigManager();
    ServiceLocator.Instance.Provide(ConfigManager, this.configManager);
    this.configManager.Initilized();

    let poolManager = new Local_PoolManager(this);
    this.cameraActivity = new Camera_Activity(this.currentPlayer);
    this.delayTaskController = new DelayTaskController();
    this.serviceLocator.RegisterService(EntityManager, 'EntityManager');
    this.serviceLocator.RegisterService(SD_LocalDataManager, 'SD_LocalDataManager');
    this.serviceLocator.RegisterService(TextManager, 'TextManager');
    this.serviceLocator.RegisterService(CharacterManager, 'CharacterManager');
    this.serviceLocator.RegisterService(StateManager, 'StateManager');
    this.serviceLocator.RegisterService(WaveConfigManager, 'WaveConfigManager');
    this.serviceLocator.RegisterService(WaveManager, 'WaveManager');
    this.serviceLocator.RegisterService(CharacterLevelManager, 'LevelManager');
    this.serviceLocator.RegisterService(SkillSelectionManager, 'SkillSelectionManager');
    this.serviceLocator.RegisterService(EffectManager, 'EffectManager');
    this.serviceLocator.RegisterService(ScheduleManager, 'ScheduleManager');
    this.serviceLocator.RegisterService(StatsManager, 'StatsManager');
    this.serviceLocator.RegisterService(DelayTaskController, 'DelayTaskController');
    this.entityManager = new EntityManager(this, this.serviceLocator, poolManager);
    this.playerDataManager = new SD_LocalDataManager(this, this.currentPlayer);
    this.textManager = new TextManager(this.entityManager);
    this.characterManager = new CharacterManager(this, this.serviceLocator);
    this.stateManager = new StateManager();
    this.waveConfigManager = new WaveConfigManager(this);
    this.waveManager = new WaveManager(this, this.serviceLocator, this.waveConfigManager, this.configManager);
    this.levelManager = new CharacterLevelManager();
    this.skillSelectionManager = new SkillSelectionManager(this.serviceLocator);
    this.scheduleManager = new ScheduleManager();

    // this.entityManager.AddActivity(new ScheduleActivity(this.scheduleManager));
    this.effectManager = new EffectManager(this.scheduleManager, [
      // Todo: Add config effect
      EffectItemConfig.CreateStackablePermanentConfig(SkillCharacterStatsID.AttackDamageUp),
      EffectItemConfig.CreateStackablePermanentConfig(SkillCharacterStatsID.AttackSpeedUp),
      EffectItemConfig.CreateStackablePermanentConfig(SkillCharacterStatsID.CritecalDamageUp),
      EffectItemConfig.CreateStackablePermanentConfig(SkillCharacterStatsID.CriticalRateUp),
      EffectItemConfig.CreateStackablePermanentConfig(SkillCharacterStatsID.DefenseUp),
      EffectItemConfig.CreateStackablePermanentConfig(SkillCharacterStatsID.MaxHealthUp),
      EffectItemConfig.CreateStackablePermanentConfig(SkillCharacterStatsID.MoveSpeedUp),
      EffectItemConfig.CreateStackablePermanentConfig(SkillCharacterStatsID.DodgeChanceUp),
      EffectItemConfig.CreateStackablePermanentConfig(SkillBulletStatsID.Bounce),
      EffectItemConfig.CreateStackablePermanentConfig(SkillBulletStatsID.Piercing),
      EffectItemConfig.CreateStackablePermanentConfig(SkillBulletStatsID.DoubleAttack),
      EffectItemConfig.CreateStackablePermanentConfig(SkillBulletStatsID.Ricochet),
      EffectItemConfig.CreateStackablePermanentConfig(SkillBulletStatsID.SpreadShoot),
      EffectItemConfig.CreateStackablePermanentConfig(SkillRecoveryID.HPRecovery),
      EffectItemConfig.CreateStackablePermanentConfig(SkillRecoveryID.BoostHeartHealing),
      EffectItemConfig.CreateStackablePermanentConfig(SkillRecoveryID.HeartIncreaseAttackPower),
      EffectItemConfig.CreateStackablePermanentConfig(SkillRecoveryID.HeartIncreaseMaxHP),
    ]);
    this.characterStatsManager = new StatsManager(this.effectManager);

    this.serviceLocator.Provide(EntityManager, this.entityManager);
    this.serviceLocator.Provide(CharacterManager, this.characterManager);
    this.serviceLocator.Provide(SD_LocalDataManager, this.playerDataManager);
    this.serviceLocator.Provide(TextManager, this.textManager);
    this.serviceLocator.Provide(StateManager, this.stateManager);
    this.serviceLocator.Provide(WaveConfigManager, this.waveConfigManager);
    this.serviceLocator.Provide(WaveManager, this.waveManager);
    this.serviceLocator.Provide(CharacterLevelManager, this.levelManager);
    this.serviceLocator.Provide(SkillSelectionManager, this.skillSelectionManager);
    this.serviceLocator.Provide(ScheduleManager, this.scheduleManager);
    this.serviceLocator.Provide(EffectManager, this.effectManager);
    this.serviceLocator.Provide(StatsManager, this.characterStatsManager);
    this.serviceLocator.Provide(DelayTaskController, this.delayTaskController);


    this.handle.AddObserver(this.stateManager, {
      OnRevived: () =>
      {
        this.isPlaying = true;
        this.stateManager?.Trigger();
      },
      OnFailed: () =>
      {
        //To do: show result
        this.isPlaying = false;
        this.ObserverManager.DispatchEvent(observer => observer.OnLevelFailed?.());
      },
      OnCompleted: () =>
      {
        this.isPlaying = false;
        this.ObserverManager.DispatchEvent(observer => observer.OnLevelCompleted?.());
      }
    });

    this.handle.AddObserver(this.levelManager, {
      OnCollectExp: (expPercent: number) =>
      {
        this.ObserverManager.DispatchEvent((observer) => observer.OnCollectExp?.(expPercent));
      },
      OnCharacterLevelUp: (level: number, expPercent: number) =>
      {
        this.ObserverManager.DispatchEvent((observer) => observer.OnCharacterLevelUp?.(level, expPercent));
      }
    });

    this.handle.AddObserver(this.waveManager, {
      OnInitialWaveSuccess: (wave) =>
      {
        this.stateManager?.Trigger();
        this.ObserverManager.DispatchEvent((observer) => observer.OnWaveChanged?.(wave));
      },
      OnCompletedWave: () =>
      {
        if(this.stateManager)
        {
          this.stateManager.IsTriggered = false;
        }
      }
    });


    //Camera activity
    this.connectLocalBroadcastEvent(hz.World.onUpdate, (time) =>
    {
      this.cameraActivity?.Process(time.deltaTime);
      this.scheduleManager?.ProcessUpdate(time.deltaTime);
    });

    //IMPROVE ME: need spawn amount enemy by config GD give.
    await this.AcquireEntity();
  }

  private ConnectUpdate()
  {
    this.updateEvent = this.connectLocalBroadcastEvent(hz.World.onUpdate, (time) =>
    {
      this.Process(time.deltaTime);
    });
  }

  private Process(deltaTime: number)
  {
    if(!this.isPlaying || this.isPaused)
    {
      return;
    }
    this.entityManager?.ProcessUpdate(deltaTime);
    this.delayTaskController?.Process(deltaTime);
  }

  public async OnReset()
  {
    this.effectManager?.StopAll();
    this.updateEvent?.disconnect();
    this.updateEvent = undefined;
    this.waveManager.Reset();
    this.entityManager?.EliminateAllEntities();
    this.currentPlayer && this.props.playerSpawnPoint?.as(hz.SpawnPointGizmo).teleportPlayer(this.currentPlayer);
  }
}
hz.Component.register(GameManager);