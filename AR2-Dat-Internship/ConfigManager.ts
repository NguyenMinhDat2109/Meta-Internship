import {Bullet_Mortar} from 'Bullet_Mortar';
import {Bullet_Parabol} from 'Bullet_Parabol';
import {Bullet_Straight} from 'Bullet_Straight';
import {Config_Enemies} from 'Config_Enemies';
import {CONFIG_MAP1} from 'Config_Map1';
import {SkillDataConfig, UISkillID, SkillRequirementsConfig} from 'Config_Skills';
import {BulletID, EnemyID, MAP_ID, WAVE_ID} from 'Enemy_Const';
import {BulletConfig, MapWavesConfig, WaveConfig} from 'Enemy_Data';
import {IEnemyConfig} from 'IEntityConfig';
import {SkillData} from 'Skill_Const';

export interface IConfigManager
{
  Initilized(): void;
  CreateWavesConfig(mapID: MAP_ID): Map<WAVE_ID, WaveConfig>;
  CreateBulletConfig(bulletID: BulletID): BulletConfig;
  CreateEnemyConfig(enemyID: EnemyID): IEnemyConfig;
  GetBulletMoveSpeed(bulletID: BulletID): number;
  GetBulletBounce(bulletID: BulletID): number;
  GetEnemyConfig(enemyID: EnemyID): IEnemyConfig;
}

export class ConfigManager implements IConfigManager
{

  private waveConfigMap: Map<MAP_ID, MapWavesConfig> = new Map([
    [ // MAP 1 config
      MAP_ID.MAP_1,
      CONFIG_MAP1
    ],
  ]);

  private skillConfigMap: Map<UISkillID, SkillData> = SkillDataConfig;
  private skillRequirementConfig: Map<UISkillID, UISkillID> = SkillRequirementsConfig;
  private bulletEnemyConfigMap = new Map<BulletID, BulletConfig>();
  private enemyConfigMap: Map<string, IEnemyConfig> = new Map();

  public Initilized(): void
  {
    this.bulletEnemyConfigMap = new Map<BulletID, BulletConfig>([
      [
        BulletID.BULLET_STRAIGHT_01, {
          ID: BulletID.BULLET_STRAIGHT_01,
          AssetID: "9952908011400548",
          MoveSpeed: 7,
          Damage: 20,
          AliveTime: 5,
          Elemental: "",
          MoveBehavior: new Bullet_Straight(),
          Bounce: 0,
        }
      ],
      [
        BulletID.BULLET_STRAIGHT_02, {
          ID: BulletID.BULLET_STRAIGHT_02,
          AssetID: "9952908011400548",
          MoveSpeed: 6,
          Damage: 25,
          AliveTime: 5,
          MoveBehavior: new Bullet_Straight(),
          Elemental: "",
          Bounce: 1,
        }
      ],

      [
        BulletID.BULLET_PARABOL_01, {
          ID: BulletID.BULLET_PARABOL_01,
          AssetID: "9952908011400548",
          MoveSpeed: 4,
          Damage: 20,
          AliveTime: 30,
          MoveBehavior: new Bullet_Parabol(),
          Elemental: "",
          Bounce: 1,
        }
      ],
      [
        BulletID.BULLET_MORTAL_01, {
          ID: BulletID.BULLET_MORTAL_01,
          AssetID: "9952908011400548",
          MoveSpeed: 6,
          Damage: 2,
          AliveTime: 2,
          MoveBehavior: new Bullet_Mortar(),
          Elemental: "",
          Bounce: 0,
        }
      ],

      [
        BulletID.BULLET_PLAYER_01, {
          ID: BulletID.BULLET_PLAYER_01,
          AssetID: "1174756777991925",
          MoveSpeed: 20,
          Damage: 50,
          AliveTime: 10,
          MoveBehavior: new Bullet_Straight(),
          Elemental: "",
          Bounce: 0,
        }
      ],

      [
        BulletID.BULLET_PROTO_BOSS_01, {
          ID: BulletID.BULLET_PROTO_BOSS_01,
          AssetID: "9952908011400548",
          MoveSpeed: 6,
          Damage: 50,
          AliveTime: 10,
          Elemental: "",
          MoveBehavior: new Bullet_Straight(),
          Bounce: 0,
        }
      ],

      [
        BulletID.BULLET_PROTO_BOSS_02, {
          ID: BulletID.BULLET_PROTO_BOSS_02,
          AssetID: "9952908011400548",
          MoveSpeed: 7,
          Damage: 60,
          AliveTime: 10,
          Elemental: "",
          MoveBehavior: new Bullet_Straight(),
          Bounce: 1,
        }
      ],
    ]);

    this.enemyConfigMap = Config_Enemies.Initilized();
  }

  public GetBulletConfig(bulletID: BulletID): BulletConfig
  {
    let config = this.bulletEnemyConfigMap.get(bulletID);
    if(!config)
    {
      console.error(`Bullet ID "${bulletID}" not found in configs.`);
      throw new Error(`Bullet ID "${bulletID}" not found in configs.`);
    }
    return config;
  }

  public CreateWavesConfig(mapID: MAP_ID): Map<WAVE_ID, WaveConfig>
  {
    let config = this.waveConfigMap.get(mapID);
    if(!config)
    {
      console.error(`MAP ID "${mapID}" not found in configs.`);
      throw new Error(`MAP ID "${mapID}" not found in configs.`);
    }

    return config.WavesConfig;
  }

  public CreateBulletConfig(bulletID: BulletID): BulletConfig
  {
    let config = this.bulletEnemyConfigMap.get(bulletID);
    if(!config)
    {
      throw new Error(`Bullet ID "${bulletID}" not found in configs.`);
    }
    return {
      ...config,
      MoveBehavior: config.MoveBehavior.Clone(),
    };
  }

  public CreateEnemyConfig(enemyID: EnemyID): IEnemyConfig
  {
    let config = this.enemyConfigMap.get(enemyID);
    if(!config)
    {
      throw new Error(`Enemy ID "${enemyID}" not found in configs.`);
    }
    return {
      ...config,
      BehaviorConfig: config.BehaviorConfig.Clone(),
    };
  }

  public GetEnemyConfig(enemyID: EnemyID): IEnemyConfig
  {
    let config = this.enemyConfigMap.get(enemyID);
    if(!config)
    {
      throw new Error(`Enemy ID "${enemyID}" not found in configs.`);
    }
    return {
      ...config,
    };
  }


  public GetBulletMoveSpeed(bulletID: BulletID): number
  {
    let config = this.bulletEnemyConfigMap.get(bulletID);
    if(!config)
    {
      throw new Error(`Bullet ID "${bulletID}" not found in configs.`);
    }
    return config.MoveSpeed;
  }

  public GetBulletBounce(bulletID: BulletID): number
  {
    let config = this.bulletEnemyConfigMap.get(bulletID);
    if(!config)
    {
      throw new Error(`Bullet ID "${bulletID}" not found in configs.`);
    }
    return config.Bounce;
  }

  public GetAllSkillDataArray(): SkillData[]
  {
    return Array.from(this.skillConfigMap.values());
  }

  public GetLockedSkillsID(): UISkillID[]
  {
    return Array.from(this.skillRequirementConfig.values());
  }

  public GetSkillConfig(skillID: UISkillID): SkillData
  {
    let config = this.skillConfigMap.get(skillID);
    if(!config)
    {
      console.error(`Skill ID "${skillID}" not found in configs.`);
      throw new Error(`Skill ID "${skillID}" not found in configs.`);
    }
    return config;
  }

  public GetSkillRequirement(skillID: UISkillID): SkillData | undefined
  {
    const unlockSkillID = this.skillRequirementConfig.get(skillID);
    if(!unlockSkillID)
    {
      console.log("Skill not unlocked new skill ");
      return undefined;
    }

    return this.GetSkillConfig(unlockSkillID);
  }
}
