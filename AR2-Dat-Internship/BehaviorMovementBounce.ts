import {TaskStatus, ActionGeneric, ITask} from "BehaviorTreeManager";
import {CharacterManager} from "CharacterManager";
import {Enemy} from "Enemy";
import {Component, ComponentWithConstructor, SerializableState, Vec3} from "horizon/core";
import {IBehaviorAgent, IEnemyBehaviorAgent} from "IBehaviorAgent";
import {IBehaviorConfig} from "IBehaviorConfig";
import {ENEMY_ANIMATION_STATE} from "IEnemyAnimationHandler";
import {ITimeMonitor} from "ITimeMonitor";
import {MapManager} from "MapManager";
import {IServiceLocator} from "ServiceLocator";

export class BehaviorMovementBounce implements IBehaviorConfig
{
    protected direction: Vec3 = Vec3.zero;
    protected characterManager: CharacterManager | undefined;
    CreateAction(serviceLocator: IServiceLocator, timeMonitor: ITimeMonitor, agent: IEnemyBehaviorAgent, comp: Component): ITask
    {
        let initLogic = () =>
        {
        };
        let targetPosition: Vec3 | null = null;
        let direction = Vec3.zero;
        let moveStep = Vec3.zero;
        let randomX = 0;
        let randomZ = 0;
        let updateLogic = () =>
        {
            // Pick a new target if none or reached
            if(!targetPosition || agent.Position.distance(targetPosition) < 0.1)
            {
                randomX = Math.random() * (MapManager.RIGHT - MapManager.LEFT) + MapManager.LEFT;
                randomZ = Math.random() * (MapManager.TOP - MapManager.BOTTOM) + MapManager.BOTTOM;
                targetPosition = new Vec3(randomX, agent.Position.y, randomZ); // keep Y the same
            }

            agent.EnemyAnimationHandler?.SetAnimationState(ENEMY_ANIMATION_STATE.MOVE)
            
            // Move toward target
            direction = targetPosition.sub(agent.Position).normalize();
            moveStep = direction.mul(agent.Speed * timeMonitor.DeltaTime);
            agent.Position = agent.Position.add(moveStep);

            // Optional: Rotate toward target
            agent.Rotation = targetPosition;

            // Always return success for behavior tree
            return TaskStatus.SUCCESS;
        };

        return new ActionGeneric(
            initLogic,
            updateLogic,
        );
    }

    public Clone(): IBehaviorConfig
    {
        return new BehaviorMovementBounce();
    }
}
