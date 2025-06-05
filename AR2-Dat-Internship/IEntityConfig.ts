import {EnemyType} from "Enemy_Const";
import {IBehaviorConfig, NullBehavior} from "IBehaviorConfig";

export interface IBodyConfig
{
  MaxHealth: number;
  MoveSpeed: number;
  BehaviorConfig: IBehaviorConfig;
  Defense: number;
  DodgeRate: number,
}

export interface IAttackBehaviorConfig
{
  Damage: number;
  DamageMultiplier: number;
  AttackSpeed: number;
  CriticalRate: number;
  CriticalDamage: number;
}

export interface IPlayerConfig extends IBodyConfig
{

}

export class PlayerConfig implements IPlayerConfig
{
  MaxHealth: number = 0;
  MoveSpeed: number = 0;
  BehaviorConfig: IBehaviorConfig = new NullBehavior();
  Defense: number = 0;
  DodgeRate: number = 0;
}

export interface IEnemyConfig extends IBodyConfig
{
  ID: Readonly<string>;
  Name: Readonly<string>;
  AssetID: Readonly<string>;
  KnockBackResistance: number;
  EnemyType: EnemyType;
  CollisionDamage: number;
}

export class EnemyConfig implements IEnemyConfig
{
  ID: string = '';
  Name: string = '';
  AssetID: string = '';
  MaxHealth: number = 0;
  KnockBackResistance: number = 0;
  MoveSpeed: number = 0;
  EnemyType: EnemyType = EnemyType.NORMAL;
  BehaviorConfig: IBehaviorConfig = new NullBehavior();
  CollisionDamage: number = 0;
  Defense: number = 0;
  DodgeRate: number = 0;
};
