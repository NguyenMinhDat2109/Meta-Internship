import {IBulletMoveBehavior} from 'Bullet_MoveBehavior';
import {BulletID, EnemyID, WAVE_ID} from 'Enemy_Const';
import {Vec3} from 'horizon/core';
import {EnemyConfig} from 'IEntityConfig';

export type JsonConfig = {
  Enemies: Array<EnemyConfig>;
  AttackPatterns: Array<AttackPatternConfig>;
  Bullets: Array<BulletConfig>;
};

export type AttackPatternConfig = {
  ID: string;
  BulletID: string;
  FireRate: number;
  BulletMoveBehavior: string;
  BulletPerShoot: number;
};

export type BulletConfig = {
  ID: string;
  AssetID: string;
  MoveSpeed: number;
  Damage: number;
  AliveTime: number;
  Elemental: string;
  MoveBehavior: IBulletMoveBehavior;
  Bounce: number;
};

export type BulletPlayerFeature = {
  KnockBackDistance: number;
  Ricochet: number;
  Piercing: number;
};

export type EnemyAssetConfig = {
  ID: string;
  AssetID: string;
};

export type EnemyMapSpawn = {
  EnemyID: EnemyID;
  Position: Vec3;
};

export type MapWavesConfig = {
  MapName: string,
  WavesConfig: Map<WAVE_ID, WaveConfig>;
};

export type WaveConfig = {
  IsBossWave?: boolean,
  EnemiesMapSpawm: EnemyMapSpawn[];
};

export const MAP_DIAGONAL = 27;

export type BulletsRequire = {
  BulletID: BulletID;
  Quantity: number;
};
