import {IObserverManager} from "IObserverManager";

/**
 * Dispose: Executes all rollback functions to remove observers and clears the array. Must call when no need.
 * AddObserver: Adds an observer to a manager, 
 * captures its removal logic, and returns 
 * the current instance for chaining.
 */
export class ObserverHandle
{
  private rollbacks: (() => void)[] = [];

  Dispose(): void
  {
    for(const rollback of this.rollbacks)
    {
      rollback();
    }
    this.rollbacks = []; // Clear the array
  }

  AddObserver<T>(manager: IObserverManager<T>, observer: T): ObserverHandle
  {
    const id = manager.AddObserver(observer);
    this.rollbacks.push(() => manager.RemoveObserver(id));
    return this;
  }
}



