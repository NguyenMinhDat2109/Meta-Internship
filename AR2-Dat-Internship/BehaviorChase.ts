import {ActionGeneric, ITask, TaskStatus} from "BehaviorTreeManager";
import {CharacterManager} from "CharacterManager";
import {Component, Vec3} from "horizon/core";
import {IBehaviorAgent, IEnemyBehaviorAgent} from "IBehaviorAgent";
import {IBehaviorConfig} from "IBehaviorConfig";
import {ENEMY_ANIMATION_STATE, EnemyAnimationHandler} from "IEnemyAnimationHandler";
import {ITimeMonitor} from "ITimeMonitor";
import {IServiceLocator} from "ServiceLocator";

const GAMEPLAY_Y_AXIS = 0;

export class BehaviorChase implements IBehaviorConfig
{
    private readonly chaseSpeed;
    private direction: Vec3 = Vec3.zero;

    constructor(chaseSpeed: number)
    {
        this.chaseSpeed = chaseSpeed;
    }

    CreateAction(serviceLocator: IServiceLocator, timeMonitor: ITimeMonitor, agent: IEnemyBehaviorAgent, comp: Component): ITask
    {
        let characterManager = serviceLocator.Resolve<CharacterManager>(CharacterManager);
        let initLogic = () =>
        {
        }
        let updateLogic = () =>
        {
            if(agent.IsKnockBacked)
            {
                return TaskStatus.FAILURE;
            }
            
            agent.EnemyAnimationHandler?.SetAnimationState(ENEMY_ANIMATION_STATE.MOVE)
            let targetPosition = characterManager.Position;
            let chaseMovementDelta = this.direction.mul(this.chaseSpeed * timeMonitor.DeltaTime);
            this.direction = targetPosition.sub(agent.Position).normalize();
            agent.Rotation = targetPosition;
            let updatedChasePosition = chaseMovementDelta.add(agent.Position);
            updatedChasePosition.y = GAMEPLAY_Y_AXIS; 
            agent.Position = updatedChasePosition;
            return TaskStatus.SUCCESS;
        }

        return new ActionGeneric(
            initLogic,
            updateLogic,
        );
    }

    Clone(): IBehaviorConfig
    {
        return new BehaviorChase(this.chaseSpeed);
    }
}
