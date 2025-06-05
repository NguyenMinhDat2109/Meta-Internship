import {BulletID, EnemyID, EnemyType, ENEMY_EXP_DEFAULT, EXPERIENCE_ITEM_QUANTITY_MAP, HEAL_ITEM_CHANGE_MAP, MAP_ID} from "Enemy_Const";
import {Enemy} from "Enemy";
import {EntityManager} from "EntityManager";
import {GameManager, LevelObserver} from "GameManager";
import {Component, EventSubscription, Vec3} from "horizon/core";
import {IObserverManager, ObserverManager} from "IObserverManager";
import {StateManager} from "IStateManager";
import {CharacterLevelManager} from "CharacterLevelManager";
import {LootItem} from "LootItem";
import {IServiceLocator, ServiceLocator} from "ServiceLocator";
import {ProcessQueue} from "Ult_ProcessQueue";
import {Assert, Delay, RandomFloat} from "Utilities";
import {WaveConfigManager} from "WaveConfigManager";
import {ConfigManager, IConfigManager} from "ConfigManager";
import {EnemyEvent} from "EventContainer";
import {Bullet_Player} from "Bullet_Player";
import {Bullet_Enemy} from "Bullet_Enemy";
import {EntityAssetIDs} from "ConfigAssets";
import {CharacterManager} from "CharacterManager";
import {LootItemExperience} from "LootItemExperience";
import {LootItemHealing} from "LootItemHealing";
import {LootItemConsumable} from "LootItemConsumable";
import {ObserverHandle} from "ObserverHandle";
import {WaveConfig} from "Enemy_Data";

export class WaveObserver
{
  public OnInitialWaveSuccess?: (wave: number) => void;
  public OnCompletedWave?: () => void;
  public OnInitialWaveBoss?: () => void;
  public OnCompletedWaveBoss?: () => void;
}

export interface IWaveObserver extends IObserverManager<WaveObserver>
{
  SetupWaveManager(): void;
  SpawnEnemies(): Promise<void>;
  InitialWave(wave: number): void;
  EndWave(): void;
  CollectExperienceItems(): void;
}

const MAX_WAVE = 50;
const MIN_ENTITIES_NEED = 2;
const LOOT_ITEM_RADIUS = 1;
const DELAY_BETWEEN_SPAWN = 0.1;

export class WaveManager extends ObserverManager<WaveObserver> implements IWaveObserver
{
  start(): void
  {
  }
  private configManager: IConfigManager;
  private gameManagerComp: GameManager;
  private servieLocator: IServiceLocator;
  private entityManager: EntityManager | undefined;
  private waveConfigManager: WaveConfigManager;
  private stateManager: StateManager | undefined;
  private levelManager: CharacterLevelManager | undefined;
  public procassQueue: ProcessQueue = new ProcessQueue();
  public currentWave: number = 0;
  public currentAliveEnemiesAmmount: number = 0;
  private currentWaveConfig: WaveConfig | undefined;
  // public currentWaveExp: number = 0;
  private enemyDeathEvent: EventSubscription | undefined; // Improve me: need to change to wave manager

  constructor(gameManagerComp: GameManager, serviceLocator: IServiceLocator, waveConfigManager: WaveConfigManager, configManager: IConfigManager)
  {
    super();
    this.gameManagerComp = gameManagerComp;
    this.servieLocator = serviceLocator;
    this.waveConfigManager = waveConfigManager;
    this.configManager = configManager;
  }

  public SetupWaveManager()
  {
    this.entityManager = this.servieLocator.Resolve<EntityManager>(EntityManager);
    this.stateManager = this.servieLocator.Resolve<StateManager>(StateManager);
    this.levelManager = this.servieLocator.Resolve<CharacterLevelManager>(CharacterLevelManager);
  }

  public async SpawnEnemies(): Promise<void>
  {
    if(!this.waveConfigManager)
    {
      console.error("Wave Manager is null");
      return;
    }
    this.currentWaveConfig = this.waveConfigManager.GetWaveConfig(this.currentWave);
    // this.currentWaveExp = currentWaveConfig.EnemiesMapSpawm.length * ENEMY_EXP_DEFAULT;
    this.currentAliveEnemiesAmmount = this.currentWaveConfig.EnemiesMapSpawm.length;
    let tcs = [];
    for(let i = 0; i < this.currentWaveConfig.EnemiesMapSpawm.length; i++)
    {
      let enemyTcs = this.CreateEnemy(this.currentWaveConfig.EnemiesMapSpawm[i].EnemyID, this.currentWaveConfig.EnemiesMapSpawm[i].Position);
      tcs.push(enemyTcs);
    }
    await Promise.all(tcs);
  }


  private async CreateEnemy(enemyID: EnemyID, position: Vec3): Promise<void>
  {
    let enemyConfig = this.configManager.GetEnemyConfig(enemyID);
    let assetID = enemyConfig?.AssetID;
    if(!assetID)
    {
      //To do log error
      return;
    }
    let enemy = await this.entityManager?.CreateEntity(assetID, (entity) =>
    {
      entity.Position = position;
      let enemyInitilizerComp = entity as Enemy;
      enemyInitilizerComp.SetEnemyID(enemyID);
    });
    let enemyComp = enemy as Enemy;
    await enemyComp.Spawn();
  }

  public async InitialWave(wave: number)
  {
    if(!this.waveConfigManager)
    {
      console.error("Wave Manager is null");
      return;
    }

    this.waveConfigManager.GetWaveBulletsNeed(this.currentWave + 2).forEach((value, key) =>
    { // acquire bullets for the next 2 waves
      this.AddProcessQueue(key, value);
    });
    this.currentWave = wave;


    //Enable Boss UI
    this.currentWaveConfig = this.waveConfigManager.GetWaveConfig(this.currentWave);
    if(this.currentWaveConfig?.IsBossWave)
    {
      this.DispatchEvent((observer) => observer.OnInitialWaveBoss?.());
    }
    await this.gameManagerComp.ScheduleDelay(0.5);

    this.SpawnEnemies();
    this.DispatchEvent((observer) => observer.OnInitialWaveSuccess?.(wave));
    this.gameManagerComp.world.ui.showPopupForEveryone('Wave ' + (this.currentWave + 1), 2, {position: new Vec3(0, 0.4, 0), fontSize: 3.5});

  }

  public EnemyDeathHandle()
  {
    //IMPROVE ME:....
    this.enemyDeathEvent = this.gameManagerComp.connectLocalBroadcastEvent(EnemyEvent.EnemyDeath, (data) =>
    {
      this.OnEnemyDeath(data.enemy);
    });
  }

  public async FirstWaveHandle()
  {
    this.currentWave = 0;
    this.currentAliveEnemiesAmmount = 0;

    let config = this.waveConfigManager.GetConfig(MAP_ID.MAP_1);
    if(!config)
    {
      console.error('Wave config is null');
      throw new Error('Wave config is null');
    }

    // acquire bullets need for enemy for first two waves
    this.waveConfigManager.GetWaveBulletsNeed(this.currentWave).forEach((value, key) =>
    { // acquire bullets for first wave
      this.AddProcessQueue(key, value);
    });

    this.waveConfigManager.GetWaveBulletsNeed(this.currentWave + 1).forEach((value, key) =>
    { // acquire bullets for second wave
      this.AddProcessQueue(key, value);
    });

    this.InitialWave(0);
  }

  private async OnEnemyDeath(enemy: Enemy)
  {
    await this.DropLootItem(enemy);
    this.currentAliveEnemiesAmmount--;
    if(this.currentAliveEnemiesAmmount <= 0)
    {
      await Delay(this.gameManagerComp, 1); // delay for feeling end wave
      this.RemoveBullets();
      await Delay(this.gameManagerComp, 1); // delay for handle end wave
      this.EndWave();

    }
  }


  private async DropLootItem(enemy: Enemy)
  {
    let amount = EXPERIENCE_ITEM_QUANTITY_MAP.get(enemy.EnemyType) ?? 0;
    await this.CreateLootItem(enemy, EntityAssetIDs.LootItemExperienceID, amount);

    let chanceToGetHealing = HEAL_ITEM_CHANGE_MAP.get(enemy.EnemyType) ?? 0;
    if(Math.random() <= chanceToGetHealing)
    {
      await this.CreateLootItem(enemy, EntityAssetIDs.LootItemHealingID, 1);
    }

  }

  private async CreateLootItem(enemy: Enemy, assetID: string, amount: number)
  {
    //Add promise to make the item finish boucing then collect it after unpause
    let bouncePromises: Promise<void>[] = [];
    const createLootEntityAtPosition = async (position: Vec3) =>
    {
      //delay spawn item when pausing game
      await this.gameManagerComp.ScheduleDelay(0.01);
      const entityComp = await this.entityManager?.CreateEntity(assetID,
        (entityComp) =>
        {
          let lootItem = entityComp as LootItem;
          const bounceTime = enemy.EnemyType == EnemyType.BOSS ? 2 : 1;
          const bouncePromise = lootItem.SetupBounceToTarget(enemy.Position, position, bounceTime);
          bouncePromises.push(bouncePromise); // Track each bounce completion
        }
      );
      if(entityComp)
      {
        entityComp.Position = position;
      }
      else
      {
        console.error('LOOT get failed');
      }
    };


    let positions = this.GenerateOrbPositions(amount, LOOT_ITEM_RADIUS);

    //await Promise.all(positions.map(async value => await createEntityAtPosition(value.add(enemy.Position))))
    for(let i = 0; i < positions.length; i++)
    {
      const position = positions[i].add(enemy.Position);
      await createLootEntityAtPosition(position);
      // Spawn Orb once each; the game logic requires a slight delay.
      await Delay(this.gameManagerComp, DELAY_BETWEEN_SPAWN);
    }
    //Wait for the bounce to complete to start collecting XP orbs after exiting Pause Mode
    await Promise.all(bouncePromises);
  }

  private GetRandomPosition(radius: number): Vec3
  {
    return new Vec3(
      (Math.random() - 0.5) * 2 * radius,
      0,
      (Math.random() - 0.5) * 2 * radius
    );
  }

  // private IsTooClose(pos: Vec3, others: Vec3[], minDistance: number): boolean
  // {
  //   return others.some(other =>
  //   {
  //     return pos.distance(other) < minDistance;
  //   });
  // }

  private GenerateOrbPositions(count: number, radius: number): Vec3[]
  {
    const positions: Vec3[] = [];

    while(positions.length < count)
    {
      const newPos = this.GetRandomPosition(radius);
      positions.push(newPos);
    }

    return positions;
  }

  private RemoveBullets()
  {
    let playerBullets = this.entityManager?.FindEntities(Bullet_Player);
    let enemiesBullets = this.entityManager?.FindEntities(Bullet_Enemy);
    playerBullets?.forEach((entity) =>
    {
      if(entity.IsAlive)
      {
        entity.Kill();
      }
    });

    enemiesBullets?.forEach((entity) =>
    {
      if(entity.IsAlive)
      {
        entity.Kill();
      }
    });
  }

  public async EndWave()
  {
    this.DispatchEvent((observer) => observer.OnCompletedWave?.());
    //Disable Boss UI
    if(this.currentWaveConfig?.IsBossWave)
    {
      this.DispatchEvent((observer) => observer.OnCompletedWaveBoss?.());
    }

    this.CollectExperienceItems();
    await this.WaitProcessExperience();
    if(this.currentWave < MAX_WAVE - 1)
    {
      Delay(this.gameManagerComp, 1.5); // Delay for initialize new wave
      this.InitialWave(this.currentWave + 1);
    }
    else
    {
      this.stateManager?.Complete();
    }
  }

  public AddProcessQueue(bulletID: BulletID, amount: number)
  {
    let configManager = ServiceLocator.Instance.Resolve<ConfigManager>(ConfigManager);
    let config = configManager.GetBulletConfig(bulletID);
    this.procassQueue.QueueEntityAcquisition(bulletID, amount, () => this.AcquireEntities(config.AssetID, amount));
  }

  private async AcquireEntities(assetID: string, amount: number): Promise<void>
  {
    if(!this.entityManager) return;
    let currentPoolLength = this.entityManager.GetCurrentPoolLength(assetID);
    await this.entityManager.AcquireEntity(assetID, Math.max(amount - currentPoolLength + MIN_ENTITIES_NEED, 0));
    return;
  }

  private async WaitProcessExperience(): Promise<void>
  {
    Assert.IsNotNull(this.levelManager, `Level Experience was null`);
    const handle = new ObserverHandle();
    const completetionPromise = new Promise<void>((resolve) =>
    {
      handle.AddObserver(this.levelManager!, {
        OnCompletedLevelUpProcess: () =>
        {
          resolve();
          handle.Dispose();
        }
      });
    });

    await completetionPromise;
  }
  public async CollectExperienceItems()
  {
    let characterManager = this.servieLocator.Resolve<CharacterManager>(CharacterManager);
    let character = characterManager.Player;
    let expItems = this.entityManager?.FindEntities(LootItemExperience);

    if(!expItems || expItems.length === 0)
    {
      return;
    }

    Assert.IsNotNull(this.levelManager, "levelManager is null");
    const length = expItems.length;
    // const flyPromises = expItems.map(item => item.ConnectFlyToTargetToProcessUpdate(character));
    const flyPromises = expItems.map(item => item.ConnectFlyToTargetToProcessUpdate(character));
    await Promise.all(flyPromises);
    this.levelManager?.AddExperience(ENEMY_EXP_DEFAULT * length);
  }


  public Reset()
  {
    this.enemyDeathEvent?.disconnect();
    this.enemyDeathEvent = undefined;
    this.currentWave = 0;
    this.currentAliveEnemiesAmmount = 0;
  }
}