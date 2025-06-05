import {BehaviorChase} from "BehaviorChase";
import {BehaviorDistanceConditionHelper} from "BehaviorDistanceConditionHelper";
import {BehaviorMultiConfig, MultiBehaviorType} from "BehaviorMultiConfig";
import {BehaviorShootProjectile} from "BehaviorShootProjectile";
import {BulletID, EnemyID, EnemyType} from "Enemy_Const";
import * as hz from 'horizon/core';
import {BehaviorSpreadShot} from "BehaviorSpreadShot";
import {BehaviorMovementBounce} from "BehaviorMovementBounce";
import {IEnemyConfig} from "IEntityConfig";
import {ENEMY_ANIMATION_STATE} from "IEnemyAnimationHandler";


export const SHADOW_SCALE_CONFIG: Map<EnemyID, hz.Vec3> = new Map<EnemyID, hz.Vec3>([
  [EnemyID.RANGER_SLIME, new hz.Vec3(0.4, 0.002, 0.4)],
  [EnemyID.SLIME, new hz.Vec3(0.5, 0.002, 0.5)],
  [EnemyID.ANDROID, new hz.Vec3(0.6, 0.002, 0.6)],
  [EnemyID.SKELETON, new hz.Vec3(0.6, 0.002, 0.6)],
  [EnemyID.PROTOBOSS_1, new hz.Vec3(2, 0.002, 2)],
]);
export class Config_Enemies
{
  public static Initilized(): Map<string, IEnemyConfig>
  {
    return new Map<string, IEnemyConfig>([
      [EnemyID.SLIME, {
        ID: EnemyID.SLIME,
        Name: "Slime",
        AssetID: "1431982388226075",
        MaxHealth: 200,
        KnockBackResistance: 0.4,
        MoveSpeed: 2,
        EnemyType: EnemyType.NORMAL,
        CollisionDamage: 30,
        Defense: 0,
        DodgeRate: 0,
        BehaviorConfig: new BehaviorMultiConfig(
          MultiBehaviorType.Sequence,
          [
            new BehaviorDistanceConditionHelper(1.4, 999),
            new BehaviorChase(3),
          ]
        ),
      }],

      [EnemyID.RANGER_SLIME, {
        ID: EnemyID.RANGER_SLIME,
        Name: "RangerSlime",
        AssetID: "1271739537998929",
        MaxHealth: 150,
        KnockBackResistance: 0.2,
        MoveSpeed: 1,
        EnemyType: EnemyType.NORMAL,
        CollisionDamage: 10,
        Defense: 0,
        DodgeRate: 0,
        BehaviorConfig: new BehaviorMultiConfig(
          MultiBehaviorType.Selector,
          [
            new BehaviorShootProjectile(3, BulletID.BULLET_STRAIGHT_01, EnemyID.RANGER_SLIME),
            new BehaviorMovementBounce(),
          ]
        ),
      }],

      [EnemyID.ANDROID, {
        ID: EnemyID.ANDROID,
        Name: "Android",
        AssetID: "681973101085950",
        MaxHealth: 150,
        KnockBackResistance: 0.4,
        MoveSpeed: 1,
        EnemyType: EnemyType.NORMAL,
        CollisionDamage: 15,
        Defense: 0,
        DodgeRate: 0,
        BehaviorConfig: new BehaviorMultiConfig(
          MultiBehaviorType.Selector,
          [
            new BehaviorSpreadShot(3, BulletID.BULLET_STRAIGHT_02, EnemyID.ANDROID, 2, 30),
            new BehaviorMovementBounce(),
          ]
        ),
      }],

      [EnemyID.SKELETON, {
        ID: EnemyID.SKELETON,
        Name: "Skeleton",
        AssetID: "455623494277541",
        MaxHealth: 150,
        KnockBackResistance: 0.2,
        MoveSpeed: 2,
        EnemyType: EnemyType.NORMAL,
        CollisionDamage: 10,
        Defense: 0,
        DodgeRate: 0,
        BehaviorConfig: new BehaviorMultiConfig(
          MultiBehaviorType.Selector,
          [
            new BehaviorShootProjectile(3, BulletID.BULLET_PARABOL_01, EnemyID.SKELETON),
            new BehaviorMovementBounce(),
          ]
        ),
      }],

      [EnemyID.BOSS, {
        ID: EnemyID.BOSS,
        Name: "Pig",
        AssetID: "2515925882078724",
        MaxHealth: 500,
        KnockBackResistance: 0.2,
        MoveSpeed: 2,
        EnemyType: EnemyType.BOSS,
        Defense: 0,
        CollisionDamage: 1,
        DodgeRate: 0,
        BehaviorConfig: new BehaviorMultiConfig(
          MultiBehaviorType.Selector,
          [
            new BehaviorShootProjectile(3, BulletID.BULLET_STRAIGHT_01, EnemyID.BOSS),
            new BehaviorMultiConfig(
              MultiBehaviorType.Sequence,
              [
                new BehaviorDistanceConditionHelper(2, 999),
                new BehaviorChase(2),
              ]
            )
          ]
        ),
      }],

      [EnemyID.PROTOBOSS_1, {
        ID: EnemyID.PROTOBOSS_1,
        Name: "ProtoBoss_1",
        AssetID: "1325754775190786",
        MaxHealth: 2000,
        KnockBackResistance: 1,
        MoveSpeed: 2,
        EnemyType: EnemyType.BOSS,
        CollisionDamage: 40,
        Defense: 0,
        DodgeRate: 0,
        BehaviorConfig:
          new BehaviorMultiConfig(
            MultiBehaviorType.SelectorWithRunning,
            [
              new BehaviorMultiConfig(
                MultiBehaviorType.ProgressiveSequence,
                [
                  new BehaviorSpreadShot(5, BulletID.BULLET_PROTO_BOSS_01, EnemyID.PROTOBOSS_1, 8, 360), //Attack behavior 1
                  new BehaviorSpreadShot(3, BulletID.BULLET_PROTO_BOSS_02, EnemyID.PROTOBOSS_1, 3, 60), //Attack behavior 2
                ]),

              new BehaviorMultiConfig(
                MultiBehaviorType.Sequence,
                [
                  new BehaviorDistanceConditionHelper(2, 999),
                  new BehaviorChase(2),
                ]
              )
            ]
          ),

      }],


    ]);
  }
}
export const ANIMATION_CONFIG: Map<EnemyID, Map<ENEMY_ANIMATION_STATE, number>> = new Map([
  [EnemyID.RANGER_SLIME, new Map([
    [ENEMY_ANIMATION_STATE.IDLE, 0],
    [ENEMY_ANIMATION_STATE.MOVE, 1.333],
    [ENEMY_ANIMATION_STATE.ATTACK, 0.633],
    [ENEMY_ANIMATION_STATE.DEATH, 1.167],
    [ENEMY_ANIMATION_STATE.HIT, 0],
  ])],
  [EnemyID.SLIME, new Map([
    [ENEMY_ANIMATION_STATE.IDLE, 0],
    [ENEMY_ANIMATION_STATE.MOVE, 1.333],
    [ENEMY_ANIMATION_STATE.ATTACK, 0.633],
    [ENEMY_ANIMATION_STATE.DEATH, 1.167],
    [ENEMY_ANIMATION_STATE.HIT, 0],
  ])],
  [EnemyID.ANDROID, new Map([
   [ENEMY_ANIMATION_STATE.IDLE, 0],
    [ENEMY_ANIMATION_STATE.MOVE, 0],
    [ENEMY_ANIMATION_STATE.ATTACK, 0],
    [ENEMY_ANIMATION_STATE.DEATH, 0],
    [ENEMY_ANIMATION_STATE.HIT, 0],
  ])],
  [EnemyID.SKELETON, new Map([
    [ENEMY_ANIMATION_STATE.IDLE, 0],
    [ENEMY_ANIMATION_STATE.MOVE, 0],
    [ENEMY_ANIMATION_STATE.ATTACK, 0],
    [ENEMY_ANIMATION_STATE.DEATH, 0],
    [ENEMY_ANIMATION_STATE.HIT, 0],
  ])],
  [EnemyID.PROTOBOSS_1, new Map([
    [ENEMY_ANIMATION_STATE.IDLE, 0],
    [ENEMY_ANIMATION_STATE.MOVE, 0],
    [ENEMY_ANIMATION_STATE.ATTACK, 0],
    [ENEMY_ANIMATION_STATE.DEATH, 0],
    [ENEMY_ANIMATION_STATE.HIT, 0],
  ])],
]);
