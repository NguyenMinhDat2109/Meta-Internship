import {Enemy} from 'Enemy';
import {EntityManager} from 'EntityManager';
import * as hz from 'horizon/core';
import {IBehaviorAgent} from 'IBehaviorAgent';

export class FinderTargetHelper
{
  public static GetNearestEnemyPosition(playerPos: hz.Vec3, entityManager: EntityManager)
  {
    let enemies = entityManager.FindEntities(Enemy);
    return this.GetNearestEntityPosistion(playerPos, enemies);
  }

  public static GetNearestEntityPosistion(position: hz.Vec3, entites: Array<IBehaviorAgent>)
  {
    let minDistance = Number.MAX_SAFE_INTEGER;
    let neareatPosition: hz.Vec3 | undefined = undefined;
    for(const entity of entites)
    {
      if(entity.DamageReceiverObserver.CanTakeDamage())
      {
        let entityPosition = entity.Position;
        if(entityPosition.distance(position) < minDistance)
        {
          minDistance = entityPosition.distance(position);
          neareatPosition = entityPosition;
        }
      }
    }
    return neareatPosition;
  }
}