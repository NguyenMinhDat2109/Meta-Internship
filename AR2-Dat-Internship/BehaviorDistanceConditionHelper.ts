import {ActionGeneric, ITask, TaskStatus} from 'BehaviorTreeManager';
import {CharacterManager} from 'CharacterManager';
import * as hz from 'horizon/core';
import {IBehaviorAgent, IEnemyBehaviorAgent} from 'IBehaviorAgent';
import {IBehaviorConfig} from 'IBehaviorConfig';
import {ENEMY_ANIMATION_STATE} from 'IEnemyAnimationHandler';
import {ITimeMonitor} from 'ITimeMonitor';
import {IServiceLocator} from 'ServiceLocator';

export class BehaviorDistanceConditionHelper implements IBehaviorConfig
{
  private readonly minDistance: number;
  private readonly maxDistance: number;

  constructor(minDistance: number, maxDistance: number)
  {
    this.minDistance = minDistance;
    this.maxDistance = maxDistance;
  }
  CreateAction(serviceLocator: IServiceLocator, timeMonitor: ITimeMonitor, agent: IEnemyBehaviorAgent, comp: hz.Component): ITask
  {
    let characterManager = serviceLocator.Resolve<CharacterManager>(CharacterManager);
    let initLogic = () =>
    {
    }
    let updateLogic = () =>
    {

      let characterPosition = characterManager.Position;
      let distance = characterPosition.distance(agent.Position);
      if(distance < this.minDistance || distance > this.maxDistance)
      {
        agent.EnemyAnimationHandler?.SetAnimationState(ENEMY_ANIMATION_STATE.ATTACK)
        return TaskStatus.FAILURE;
      }
      return TaskStatus.SUCCESS;
    }

    return new ActionGeneric(
      initLogic,
      updateLogic,
    );
  }
  Clone(): IBehaviorConfig
  {
    return new BehaviorDistanceConditionHelper(this.minDistance, this.maxDistance);
  }

}
