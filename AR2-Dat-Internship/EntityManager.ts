/**
 * EntityManager is responsible for managing entity lifecycles, including creation, pooling, and removal.
 * It supports asynchronous creation with AcquireEntity and CreateEntityWaiter, ensuring entities are available when needed.
 *
 * Example Usage:
 * ```typescript
 * const entityManager = new EntityManager(component, serviceLocator, poolManager);
 * await entityManager.AcquireEntity('enemy_01', 10);
 * const entity = await entityManager.CreateEntityWaiter('enemy_01');
 * entity.ProcessUpdate(deltaTime);
 * ```
 */

import * as hz from 'horizon/core';
import {Entity} from 'Entity';
import {ArrayCache, IArrayCache} from 'IArrayCache';
import {IEntity} from 'IEntity';
import {Local_PoolManager} from 'Local_PoolManager';
import {IServiceLocator} from 'ServiceLocator';
import {IActivityManager} from 'IActivityManager';

interface IEntityObserver
{
  OnBegin?: () => void;
  OnEnd?: () => void;
}

export class EntityObserver implements IEntityObserver
{
  OnBegin?: () => void;
  OnEnd?: () => void;
}

export interface IEntityManager
{
  /**
   * Acquire a specified number of entities from the pool manager and add them to the internal pool.
   * If no script extending `Entity` is found, it logs an error.
   * @param assetID - The ID of the asset to acquire.
   * @param amount - The number of entities to acquire.
   */
  AcquireEntity(assetID: string, amount: number): Promise<void>;

  /**
   * Attempts to retrieve an entity from the pool. If none are available, it requests one.
   * This method may cause delays due to the asynchronous acquisition.
   * @param assetID - The ID of the asset to retrieve.
   * @param initializer - An optional initializer function to configure the entity.
   * @returns A promise that resolves with the acquired entity.
   */
  CreateEntity(assetID: string, initializer?: (entity: IEntity) => void): Promise<IEntity>;

  /**
   * Removes an entity and returns it to the pool.
   * @param assetID - The ID of the asset.
   * @param entity - The entity to remove.
   */
  RemoveEntity(assetID: string, entity: IEntity): void;

  /**
   * Finds all active entities of a specified type.
   * @param type - The class type to find.
   * @returns An array of entities of the specified type.
   */
  FindEntities<U extends IEntity>(type: new (...args: any[]) => U): U[];

  /**
   * Processes updates for all active entities.
   * @param deltaTime - The time elapsed since the last update.
   */
  ProcessUpdate(deltaTime: number): void;

  /**
   * Eliminates all entities in the active pool.
   */
  EliminateAllEntities(): void;

  /**
   * Gets the current number of entities in the pool for a specific asset ID.
   * @param assetID - The asset ID to check.
   * @returns The number of entities in the pool.
   */
  GetCurrentPoolLength(assetID: string): number;

  AddActivity(activity: IActivityManager): void;
}

export class EntityManager implements IEntityManager
{
  private poolManager: Local_PoolManager;
  private poolMap: Map<string, Array<IEntity>> = new Map<string, Array<IEntity>>([]);
  private activitiesManager: Array<IActivityManager> = [];
  private activeEntities: IArrayCache<IEntity> = new ArrayCache<IEntity>();
  private serviceLocator: IServiceLocator;
  private comp: hz.Component;

  constructor(comp: hz.Component, serviceLocator: IServiceLocator, poolManager: Local_PoolManager)
  {
    this.poolManager = poolManager;
    this.serviceLocator = serviceLocator;
    this.comp = comp;
  }

  public async AcquireEntity(assetID: string, amount: number)
  {
    let entitiesMap = this.poolMap.get(assetID) ?? [];
    let entities = await this.poolManager.CreateEntities(assetID, amount);
    entities.forEach((e) =>
    {
      let enemyComps = e.getComponents<Entity<any>>();
      if(enemyComps == undefined || enemyComps.length == 0)
      {
        console.error(`Don't have script extend Entity. Please add script at assetID = ${assetID} or Entity name: ${e.name.get()}`);
        return;
      }
      let enemyComp = enemyComps[0];
      enemyComp.AssetID = assetID;
      entitiesMap.push(enemyComp);
    });
    this.poolMap.set(assetID, entitiesMap);
  }

  public async CreateEntity(assetID: string, initializer?: (entity: IEntity) => void): Promise<IEntity>
  {
    let entitiesPool = this.poolMap.get(assetID);
    if(!entitiesPool || entitiesPool.length == 0)
    {
      //NOTICE: dangerous looping.
      await this.AcquireEntity(assetID, 1);
      return this.CreateEntity(assetID, initializer);
    }
    let entity = entitiesPool[0];
    entitiesPool.shift();
    this.poolMap.set(assetID, entitiesPool);
    if(initializer)
    {
      initializer(entity);
    }
    entity.Begin(this.serviceLocator, () => {this.RemoveEntity(assetID, entity);});
    this.activeEntities.AddItem(entity);
    return entity;
  }

  public RemoveEntity(assetID: string, entity: IEntity)
  {
    let entitiesPool = this.poolMap.get(assetID) ?? [];
    entitiesPool.push(entity);
    entity.End();
    this.activeEntities.RemoveItem(entity);
    this.poolMap.set(assetID, entitiesPool);
  }

  public FindEntities<U extends IEntity>(type: new (...args: any[]) => U)
  {
    return this.activeEntities.GetItems(type);
  }

  public ProcessUpdate(deltaTime: number)
  {
    for(let i = 0; i < this.activitiesManager.length; i++)
    {
      this.activitiesManager[i].ProcessUpdate(deltaTime);
    }
    const allItems = this.activeEntities.GetAllItems();
    for(let i = 0; i < allItems.length; i++)
    {
      allItems[i].Process(deltaTime);
    }
  }

  public EliminateAllEntities()
  {
    const allItems = this.activeEntities.GetAllItems().slice();
    for(let i = 0; i < allItems.length; i++)
    {
      allItems[i].Kill();
    }
  }

  public GetCurrentPoolLength(assetID: string): number
  {
    let entitiesPool = this.poolMap.get(assetID);
    if(!entitiesPool)
    {
      return 0;
    }
    return entitiesPool.length;
  }

  AddActivity(activity: IActivityManager): void
  {
    this.activitiesManager.push(activity);
  }

}
