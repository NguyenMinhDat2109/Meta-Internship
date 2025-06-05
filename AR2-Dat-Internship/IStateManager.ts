//#region Entity Service
import {IObserverManager, ObserverManager} from "IObserverManager";

/**
 * Observer interface for the StateManager.
 * Defines the callbacks that observers can implement to respond to state changes.
 */
export interface StateManagerObserver
{
  /** Called when the state is triggered. */
  OnTriggered?: () => void;

  /** Called when the state is revived. */
  OnRevived?: () => void;

  /** Called when the state fails. */
  OnFailed?: () => void;

  /** Called when the state is completed. */
  OnCompleted?: () => void;

  /** Called when state is pause or unpause */
  OnPaused?: (isPause: boolean) => void;
}

/**
 * Interface for the StateManager.
 * Provides methods to manage and observe the state of the application.
 */
export interface IStateManager extends IObserverManager<StateManagerObserver>
{
  /** Indicates whether the application is currently playing. */
  IsPlaying: boolean;

  /** Indicates whether the state has been triggered. */
  IsTriggered: boolean;

  /** Triggers the state and notifies observers. */
  Trigger(): void;

  /** Revives the state and notifies observers. */
  Revive(): void;

  /** Fails the state and notifies observers. */
  Fail(): void;

  /** Completes the state and notifies observers. */
  Complete(): void;
}

/**
 * Manages the state of the application and notifies observers of state changes.
 * Extends the ObserverManager to handle StateManagerObserver callbacks.
 */
export class StateManager extends ObserverManager<StateManagerObserver> implements IStateManager
{
  /** Indicates whether the application is currently playing. */
  public IsPlaying: boolean = true;

  /** Indicates whether the state has been triggered. */
  public IsTriggered: boolean = false;

  /**
   * Triggers the state and notifies observers.
   * Does nothing if the state is already triggered.
   */
  public Trigger(): void
  {
    if(this.IsTriggered)
    {
      return;
    }
    this.IsTriggered = true;
    this.DispatchEvent(observer => observer.OnTriggered?.());
  }

  /**
   * Revives the state and notifies observers.
   * Does nothing if the application is already playing.
   */
  public Revive(): void
  {
    if(this.IsPlaying)
    {
      return;
    }
    this.IsPlaying = true;
    this.IsTriggered = false;
    this.DispatchEvent(observer => observer.OnRevived?.());
  }

  /**
   * Fails the state and notifies observers.
   * Does nothing if the application is not playing.
   */
  public Fail(): void
  {
    if(!this.IsPlaying)
    {
      return;
    }
    this.IsPlaying = false;
    this.DispatchEvent(observer => observer.OnFailed?.());
  }

  /**
   * Completes the state and notifies observers.
   * Does nothing if the application is not playing.
   */
  public Complete(): void
  {
    if(!this.IsPlaying)
    {
      return;
    }
    this.IsPlaying = false;
    this.DispatchEvent(observer => observer.OnCompleted?.());
  }
}