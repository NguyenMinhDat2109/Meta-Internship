import {EntityObserver} from 'EntityManager';
import * as hz from 'horizon/core';
import {IEntity} from 'IEntity';
import {IObserverManager, ObserverManager} from 'IObserverManager';
import {IServiceLocator} from 'ServiceLocator';

export abstract class Entity<T> extends hz.Component<typeof Entity & T> implements IEntity
{
  public get Entity()
  {
    return this.entity;
  }

  private readonly observerManager: IObserverManager<EntityObserver> = new ObserverManager<EntityObserver>();
  private position = hz.Vec3.zero;
  private isActive = false;
  private isDestroying = false;
  private destroyer?: () => void;
  private serviceLocator: IServiceLocator | undefined;
  protected currentPlayer = hz.Player.prototype;

  public get ServiceLocator()
  {
    if(!this.serviceLocator)
    {
      throw new Error(`Service Was Null`);
    }
    return this.serviceLocator;
  }

  public AssetID: string = '';
  public get Name()
  {
    return this.entity.name.get();
  }

  public get IsAlive()
  {
    return this.isActive && !this.isDestroying;
  }

  public get Position()
  {
    return this.position;
  }

  public set Position(value)
  {
    if(this.position == value)
    {
      return;
    }
    this.position = value;
    this.entity.position.set(this.position);
  }

  start(): void
  {
    this.currentPlayer = this.entity.owner.get();
  }

  public Process(deltaTime: number): void
  {
    //NOTHING
  }


  public Begin(serviceLocator: IServiceLocator, destroyer: () => void)
  {
    this.destroyer = destroyer;
    this.isActive = true;
    this.isDestroying = false;
    this.serviceLocator = serviceLocator;
    this.DispatchEvent(observer => {if(observer.OnBegin) observer.OnBegin();});
  }

  public End()
  {
    this.isActive = false;
    this.isDestroying = false;
    this.serviceLocator = undefined;
    this.destroyer = undefined;
    this.DispatchEvent(observer => {if(observer.OnEnd) observer.OnEnd();});
  }

  public Kill(): boolean
  {
    if(this.isDestroying)
    {
      return false;
    }
    this.isDestroying = true;
    if(this.destroyer)
    {
      this.destroyer();
    }
    return true;
  }

  public AddObserver(observer: EntityObserver): number
  {
    return this.observerManager.AddObserver(observer);
  }

  public RemoveObserver(id: number): boolean
  {
    return this.observerManager.RemoveObserver(id);
  }

  public DispatchEvent(dispatcher: (observer: EntityObserver) => void): void
  {
    this.observerManager.DispatchEvent(dispatcher);
  }
}
