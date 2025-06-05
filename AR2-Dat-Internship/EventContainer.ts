import {KnockBack} from 'Enemy_Const';
import {Enemy} from 'Enemy';
import * as hz from 'horizon/core';

export const BulletEvent = {
  Fire: new hz.NetworkEvent<{firePos: hz.Vec3, targetPos: hz.Vec3}>('Fire'),
}

export const EnemyEvent = {
  EnemyTakeDamage: new hz.LocalEvent<{damage: number, knockback: KnockBack}>('EnemyTakeDamage'),
  EnemyDeath: new hz.LocalEvent<{enemy: Enemy}>('EnemyDeath'),
}

export const GameplayEvent = {

}