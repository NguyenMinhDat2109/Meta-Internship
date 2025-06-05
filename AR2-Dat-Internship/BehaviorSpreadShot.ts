import {Bullet_Enemy} from "Bullet_Enemy";
import {ConfigManager} from "ConfigManager";
import {BulletID, EnemyID} from "Enemy_Const";
import {BulletConfig} from "Enemy_Data";
import {EntityManager} from "EntityManager";
import {IBehaviorConfig} from "IBehaviorConfig";
import {IServiceLocator, ServiceLocator} from "ServiceLocator";
import {Delay, RotateAroundY} from "Utilities";
import {Component} from "horizon/core";
import {CharacterManager} from "CharacterManager";
import {ITask} from "BehaviorTreeManager";
import {CooldownActivator} from "CoolDownActivator";
import {AimCharacterStrategy} from "IAimStrategy";
import {TargetLocker} from "ITargetLocker";
import {ITimeMonitor} from "ITimeMonitor";
import {SkillAction} from "SkillAction";
import {IBehaviorAgent, IEnemyBehaviorAgent} from "IBehaviorAgent";
// import {EnemyID} from "Config_Enemies";
import {BehaviorShootStrategyBase} from "BehaviorShootStrategyBase";
import {IEntity} from "IEntity";
import {ENEMY_ANIMATION_STATE} from "IEnemyAnimationHandler";

export class BehaviorSpreadShot extends BehaviorShootStrategyBase
{
  private spreadAngle: number;
  constructor(coolDown: number, bulletID: BulletID, enemyID: EnemyID, numOfBullet: number, spreadAngle: number)
  {
    super(coolDown, bulletID, numOfBullet, enemyID);
    this.coolDown = coolDown;
    this.bulletID = bulletID;
    this.numOfBullet = numOfBullet;
    this.spreadAngle = spreadAngle;
  }

  CreateAction(serviceLocator: IServiceLocator, timeMonitor: ITimeMonitor, agent: IEnemyBehaviorAgent, comp: Component /* for test delay need to be in await action... */): ITask
  {
    console.log("CreateAction BehaviorSpreadShot");
    let configManager = ServiceLocator.Instance.Resolve<ConfigManager>(ConfigManager);
    const bulletConfig = configManager.CreateBulletConfig(this.bulletID);
    const characterManager = serviceLocator.Resolve<CharacterManager>(CharacterManager);
    const entityManager = serviceLocator.Resolve<EntityManager>(EntityManager);
    let coolDownActivator = new CooldownActivator(this.coolDown);
    let aimStrategy = new AimCharacterStrategy(characterManager, agent);
    let targetLocker = new TargetLocker(aimStrategy, 999); // Range need to be in config

    return new SkillAction(
      timeMonitor,
      coolDownActivator,
      targetLocker,
      async (targets) =>
      {
        //Improve me: casting time should be moved to enemy config
        let castingTime = 1;
        await agent.EnemyAnimationHandler?.SetAnimationState(ENEMY_ANIMATION_STATE.ATTACK)
        
        await this.CastAndRotate(agent, comp, targets, castingTime);
      },
      async (targets) =>
      {
        if(targets.length === 0)
        {
          return;
        }
        agent.Rotation = targets[0].Position; // Rotate when shoot
        await Delay(comp, 0.1); // for test need to be in await action...
        // Improve me: need to check condition in other position. Not alive here.
        if(!agent.IsEnable)
        {
          return;
        }
        agent.Rotation = targets[0].Position; // Rotate when shoot
        let shootDir = characterManager.Position.sub(agent.Position).normalize();

        if(this.numOfBullet < 2)
        {
          console.error("Spread shot must have at least 2 bullets");
          return;
        }

        // This piece of code is to avoid the first and the last bullet overlap
        // For example, 8 bullets with 360 spreadAngle would show the result of 7 bullets
        // with deltaAngle == 51.43 instead of 8 bullet with deltaAngle == 45
        let deltaAngle = (this.spreadAngle / (this.numOfBullet - 1));
        if(this.spreadAngle % 360 === 0)
        {
          deltaAngle = ((this.spreadAngle) / (this.numOfBullet));
        }

        for(let i = 1; i <= this.numOfBullet; i++)
        {
          let bullet = await entityManager.CreateEntity(bulletConfig.AssetID);
          let bulletCpn = bullet as Bullet_Enemy;
          bulletCpn.Position = agent.Position;
          bulletCpn.SetBulletConfig(bulletConfig);

          let spreadAngle = 0;
          let spreadDirection = RotateAroundY(shootDir, spreadAngle);
          if(i % 2 === 1)
          {
            //If the index is odd, the spreadAngle would be negative
            //The first bullet have index 1, mean the speadAngle equals 0 (first bullet alway shot straight at player)
            spreadAngle = - deltaAngle * ((i - 1) / 2);
            spreadDirection = RotateAroundY(shootDir, spreadAngle);
          }
          else
          {
            //If the index is even, the spreadAngle would be positive
            spreadAngle = deltaAngle * (i / 2);
            spreadDirection = RotateAroundY(shootDir, spreadAngle);
          }

          let newPosition = agent.Position.add(spreadDirection);
          bulletCpn.SetFirePosition(agent.Position);
          bulletCpn.SetTarget(newPosition);
          bulletCpn.SetBullet();
        }
      },
    );
  }

  private async CastAndRotate(agent: IBehaviorAgent, comp: Component, targets: Array<IEntity>, time: number)
  {
    if(targets.length === 0)
    {
      return;
    }
    agent.Rotation = targets[0].Position; // Rotate when shoot
    if(time > 0)
    {
      await Delay(comp, 0.02); // test wait to be casting
      await this.CastAndRotate(agent, comp, targets, time - 0.02);
    }
    else
    {

      return;
    }
  }

  public Clone(): IBehaviorConfig
  {
    return new BehaviorSpreadShot(this.coolDown, this.bulletID, this.enemyID, this.numOfBullet, this.spreadAngle);
  }
}
