import {ITask, ITaskParent, ParallelNode, ProgressiveSequenceNode, RaceNode, SelectorNode, SelectorWithRunningNode, SequenceNode} from 'BehaviorTreeManager';
import * as hz from 'horizon/core';
import {IBehaviorAgent, IEnemyBehaviorAgent} from 'IBehaviorAgent';
import {IBehaviorConfig} from 'IBehaviorConfig';
import {ITimeMonitor} from 'ITimeMonitor';
import {IServiceLocator} from 'ServiceLocator';

export enum MultiBehaviorType
{
  Sequence,
  Selector,
  SelectorWithRunning,
  Parallel,
  Race,
  ProgressiveSequence
}

export class BehaviorMultiConfig implements IBehaviorConfig
{
  private readonly configs: IBehaviorConfig[];
  private readonly multiBehaviorType: MultiBehaviorType;

  constructor(multiBehaviorType: MultiBehaviorType, configs: IBehaviorConfig[])
  {
    this.configs = configs;
    this.multiBehaviorType = multiBehaviorType;
  }

  CreateAction(serviceLocator: IServiceLocator, timeMonitor: ITimeMonitor, agent: IBehaviorAgent, comp: hz.Component): ITask
  {
    let parentAction: ITaskParent;
    let items: ITask[] = [];
    for(let i = 0; i < this.configs.length; i++)
    {
      const config = this.configs[i];
      const cloned = config.Clone();
      const action = cloned.CreateAction(serviceLocator, timeMonitor, agent, comp);
      items.push(action);
    }

    switch(this.multiBehaviorType)
    {
      case MultiBehaviorType.Sequence:
        parentAction = new SequenceNode(items);
        break;
      case MultiBehaviorType.Selector:
        parentAction = new SelectorNode(items);
        break;
      case MultiBehaviorType.SelectorWithRunning:
        parentAction = new SelectorWithRunningNode(items);
        break;
      case MultiBehaviorType.Parallel:
        // Don't have ParallelNode yet
        parentAction = new ParallelNode(items);
        break;
      case MultiBehaviorType.Race:
        // Don't have RaceNode yet
        parentAction = new RaceNode(items);
        break;
      case MultiBehaviorType.ProgressiveSequence:
        parentAction = new ProgressiveSequenceNode(items);
        break;
      default:
        throw new Error("Invalid MultiBehaviorType");
    }
    return parentAction;
  }

  Clone(): IBehaviorConfig
  {
    return new BehaviorMultiConfig(this.multiBehaviorType, this.configs);
  }
}
