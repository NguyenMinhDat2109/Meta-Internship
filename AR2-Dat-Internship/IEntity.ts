import {Event} from 'GLOBAL_UTL_Events';
import {Entity, Vec3} from 'horizon/core';
import {IServiceLocator} from 'ServiceLocator';

export const EntityObserver = {
  OnEnd: new Event('On Entity End'),
  OnBegin: new Event('On Entity Begin'),
}

/// 
/// ----------------------------------------------------------------------
/// Steps        | Create | Queue | Begin | Kill | Queue | End | PostEnd |
/// ----------------------------------------------------------------------
/// IsAlive      |     False      | True  |             False            |
/// ----------------------------------------------------------------------
/// IsActive     |     False      |             True           |  False  |
/// ----------------------------------------------------------------------
/// IsDestroying |         False          |         True       |  False  |
/// ----------------------------------------------------------------------

export interface IEntity
{
  AssetID: string;

  Name: Readonly<string>;
  /**
   * Checks whether this entity is alive or not.
   */
  IsAlive: Readonly<boolean>;
  /**
   * Getter, Setter.
   * Get current entity position.
   * Set entity position.
   */
  Position: Vec3;

  /**
   * Entity Objects
   */
  Entity: Readonly<Entity>;

  Begin(serviceLocator: IServiceLocator, destroyer: () => void): void;
  End(): void;
  Process(deltaTime: number): void;

  /**
   * Kills this entity.
   * @returns True if the process was successful, false otherwise.
   */
  Kill(): boolean;
}
