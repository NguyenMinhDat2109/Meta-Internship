import * as hz from 'horizon/core';
import {UIComponent, UINode, View} from 'horizon/ui';
import {DialogObserver, IDialog} from 'IDialog';
import {IObserverManager, ObserverManager} from 'IObserverManager';

/**
 * Base class for Dialog, extending UIComponent.
 * 
 * Main functionalities:
 * - Manages the visibility state of the dialog.
 * - Supports transition effects via ShowTransitionFactory and HideTransitionFactory.
 * - Handles observer management to track show/hide events.
 */
export abstract class Dialog extends UIComponent<typeof Dialog> implements IDialog
{
  private observerManager: IObserverManager<DialogObserver> = new ObserverManager<DialogObserver>();
  isActive: boolean = false;
  ShowTransitionFactory?: () => Promise<void>;
  HideTransitionFactory?: () => Promise<void>;

  initializeUI(): UINode
  {
    return this.Content();
  }

  public Content(): UINode
  {
    return View({});
  }

  start(): void
  {
  }

  public AddObserver(observer: DialogObserver): number
  {
    return this.observerManager.AddObserver(observer);
  }

  public RemoveObserver(id: number): boolean
  {
    return this.observerManager.RemoveObserver(id);
  }

  public DispatchEvent(dispatcher: (observer: DialogObserver) => void): void
  {
    this.observerManager.DispatchEvent(dispatcher);
  }

  public async Show(): Promise<void>
  {
    if(this.isActive)
    {
      console.error('Show() called when active');
      return;
    }
    this.DispatchEvent(observer => observer.OnWillShow?.());
    if(this.ShowTransitionFactory)
    {
      await this.ShowTransitionFactory();
    }
    this.isActive = true;
    this.entity.visible.set(true);
    this.DispatchEvent(observer => observer.OnDidShow?.());
  }

  public async Hide(): Promise<void>
  {
    if(!this.isActive)
    {
      console.error('Hide() called when not active');
      return;
    }
    this.DispatchEvent(observer => observer.OnWillHide?.());
    this.isActive = false;
    if(this.HideTransitionFactory)
    {
      await this.HideTransitionFactory();
    }
    this.entity.visible.set(false);
    this.DispatchEvent(observer => observer.OnDidHide?.());
  }
}

export class DialogWithResult<T> extends Dialog
{
  private hasResult: boolean = false;
  private ResultValue: T | undefined;

  public get Result(): T
  {
    if(!this.hasResult)
    {
      throw new Error('Invalid dialog result');
    }
    return this.ResultValue as T;
  }

  private set Result(value: T)
  {
    this.hasResult = true;
    this.ResultValue = value;
  }

  public async HideWithResult(result: T): Promise<void>
  {
    if(!this.isActive)
    {
      return;
    }
    this.Result = result;
    await super.Hide();
  }
}