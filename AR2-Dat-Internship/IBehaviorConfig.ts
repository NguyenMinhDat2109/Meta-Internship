
//FACTORY
import {ActionNode, ITask} from "BehaviorTreeManager";
import {Component} from "horizon/core";
import {IAgent} from "IAgent";
import {IBehaviorAgent} from "IBehaviorAgent";
import {ITimeMonitor} from "ITimeMonitor";
import {IServiceLocator} from "ServiceLocator";


// USING FOR converted json to data.
// AttackBehaviorFactory: Centralized factory for creating attack behaviors
export class AttackBehaviorFactory
{
  private static behaviorRegistry: {[key: string]: any} = {};

  // Register a behavior type (static method)
  public static RegisterBehavior(type: string, behaviorClass: any): void
  {
    this.behaviorRegistry[type] = behaviorClass;
  }

  // Create an instance of a behavior based on type and parameters
  public static CreateBehavior(data: any): IBehaviorConfig
  {
    const BehaviorClass = this.behaviorRegistry[data.Type];
    if(!BehaviorClass)
    {
      throw new Error(`Attack behavior type "${data.Type}" is not registered.`);
    }
    // Dynamically create an instance with parameters
    return new BehaviorClass(...Object.values(data));
  }
}

export interface IBehaviorConfig
{
  CreateAction(serviceLocator: IServiceLocator, timeMonitor: ITimeMonitor, agent: IBehaviorAgent, comp: Component): ITask;
  // Clone method to create a new instance of the class with the same properties.
  Clone(): IBehaviorConfig;

}

export class NullBehavior implements IBehaviorConfig
{
  CreateAction(serviceLocator: IServiceLocator, timeMonitor: ITimeMonitor, agent: IAgent, comp: Component): ITask
  {
    return new ActionNode(() =>
    {
      // No thing
      return true;
    });
  }

  public Clone(): IBehaviorConfig
  {
    return new NullBehavior();
  }
}


