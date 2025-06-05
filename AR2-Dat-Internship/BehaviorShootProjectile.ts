import {ITask} from "BehaviorTreeManager";
import {Bullet_Enemy} from "Bullet_Enemy";
import {CharacterManager} from "CharacterManager";
import {CooldownActivator} from "CoolDownActivator";
import {BulletID, EnemyID} from "Enemy_Const";
import {BulletConfig} from "Enemy_Data";
import {EntityManager} from "EntityManager";
import {Component} from "horizon/core";
import {AimCharacterStrategy} from "IAimStrategy";
import {IBehaviorConfig} from "IBehaviorConfig";
import {TargetLocker} from "ITargetLocker";
import {ITimeMonitor} from "ITimeMonitor";
import {IServiceLocator, ServiceLocator} from "ServiceLocator";
import {SkillAction} from "SkillAction";
import {Delay} from "Utilities";
import {ConfigManager} from "ConfigManager";
import {BehaviorShootStrategyBase} from "BehaviorShootStrategyBase";
import {IBehaviorAgent, IEnemyBehaviorAgent} from "IBehaviorAgent";
import {ENEMY_ANIMATION_STATE} from "IEnemyAnimationHandler";

export class BehaviorShootProjectile extends BehaviorShootStrategyBase
{
  constructor(coolDown: number, bulletID: BulletID, enemyID: EnemyID)
  {
    super(coolDown, bulletID, 1, enemyID);
    this.coolDown = coolDown;
    this.bulletID = bulletID;
  }


  CreateAction(serviceLocator: IServiceLocator, timeMonitor: ITimeMonitor, agent: IEnemyBehaviorAgent, comp: Component): ITask
  {
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
      async () =>
      {
        await agent.EnemyAnimationHandler?.SetAnimationState(ENEMY_ANIMATION_STATE.ATTACK)
      },
      async (targets) =>
      {
        if(targets.length === 0)
        {
          return;
        }
        agent.Rotation = targets[0].Position; // Rotate when shoot
        await Delay(comp, 0.5); // for test need to be in await action...
        // Improve me: need to check condition in other position. Not alive here.
        if(!agent.IsEnable)
        {
          return;
        }
        agent.Rotation = targets[0].Position; // Rotate when shoot
        let bullet = await entityManager.CreateEntity(bulletConfig.AssetID);
        let bulletCpn = bullet as Bullet_Enemy;
        bulletCpn.SetFirePosition(agent.Position);
        bulletCpn.SetTarget(targets[0].Position);
        bulletCpn.SetBulletConfig(bulletConfig);
        bulletCpn.SetBullet();
      },
    );
  }

  public Clone(): IBehaviorConfig
  {
    return new BehaviorShootProjectile(this.coolDown, this.bulletID, this.enemyID);
  }
}
