import {Vec3} from "horizon/core";

export enum MoveBehavior
{
    LINEAR = 'Linear',
    HORIZON_VERTICAL = 'Horizon_Vertical',
    RANDOM = 'Random',
    CHASING = 'Chase',
}

export enum BulletID
{
    BULLET_STRAIGHT_01 = 'bullet_straight_01',
    BULLET_STRAIGHT_02 = 'bullet_straight_02',
    BULLET_PARABOL_01 = 'bullet_parabol_01',
    BULLET_MORTAL_01 = 'bullet_mortal_01',
    BULLET_PLAYER_01 = 'bullet_player_01',
    BULLET_PROTO_BOSS_01 = "bullet_proto_boss_01",
    BULLET_PROTO_BOSS_02 = "bullet_proto_boss_02",
}

export enum AttackBehaviorFactory
{
    NULL_ATTACK_BEHAVIOR = "NullAttackBehavior",
}

export type KnockBack = {
    direction: Vec3;
    distance: number;
};

export const KNOCK_BACK_TIME_DEFAULT = 0.1;
export const ENEMY_SPEED_DEFAULT = 1.6;
export const ENEMY_EXP_DEFAULT = 2;
export const ENEMY_COIN_DEFAULT = 10;

export enum MAP_ID
{
    MAP_1 = "Map_1",
    MAP_2 = "Map_2",
    MAP_3 = "Map_3",
    MAP_4 = "Map_4",
    MAP_5 = "Map_5",
    MAP_6 = "Map_6",
    MAP_7 = "Map_7",
    MAP_8 = "Map_8",
    MAP_9 = "Map_9",
    MAP_10 = "Map_10",
}

export enum WAVE_ID
{
    WAVE_1 = 0,
    WAVE_2 = 1,
    WAVE_3 = 2,
    WAVE_4 = 3,
    WAVE_5 = 4,
    WAVE_6 = 5,
    WAVE_7 = 6,
    WAVE_8 = 7,
    WAVE_9 = 8,
    WAVE_10 = 9,
    WAVE_11 = 10,
    WAVE_12 = 11,
    WAVE_13 = 12,
    WAVE_14 = 13,
    WAVE_15 = 14,
    WAVE_16 = 15,
    WAVE_17 = 16,
    WAVE_18 = 17,
    WAVE_19 = 18,
    WAVE_20 = 19,
    WAVE_21 = 20,
    WAVE_22 = 21,
    WAVE_23 = 22,
    WAVE_24 = 23,
    WAVE_25 = 24,
    WAVE_26 = 25,
    WAVE_27 = 26,
    WAVE_28 = 27,
    WAVE_29 = 28,
    WAVE_30 = 29,
    WAVE_31 = 30,
    WAVE_32 = 31,
    WAVE_33 = 32,
    WAVE_34 = 33,
    WAVE_35 = 34,
    WAVE_36 = 35,
    WAVE_37 = 36,
    WAVE_38 = 37,
    WAVE_39 = 38,
    WAVE_40 = 39,
    WAVE_41 = 40,
    WAVE_42 = 41,
    WAVE_43 = 42,
    WAVE_44 = 43,
    WAVE_45 = 44,
    WAVE_46 = 45,
    WAVE_47 = 46,
    WAVE_48 = 47,
    WAVE_49 = 48,
    WAVE_50 = 49,
}

export enum WaveType
{
    NORMAL = 0,
    BOSS = 1
}


export type MaxBulletsNeed = {
    wave: number,
    quantity: number,
};

export enum EnemyID
{
    SLIME = 'enemy_01',
    RANGER_SLIME = 'enemy_02',
    ANDROID = 'enemy_03',
    SKELETON = 'enemy_04',
    BOSS = 'boss',
    PROTOBOSS_1 = 'protoboss_1',
}


export enum EnemyType
{
    NORMAL = 0,
    BOSS = 1
}

export const EXPERIENCE_ITEM_QUANTITY_MAP: Map<EnemyType, number> = new Map<EnemyType, number>(
    [
        [EnemyType.NORMAL, 1],
        [EnemyType.BOSS, 10],
    ]
);

export const HEAL_ITEM_CHANGE_MAP: Map<EnemyType, number> = new Map<EnemyType, number>(
    [
        [EnemyType.NORMAL, 0.05],
        [EnemyType.BOSS, 1],
    ]
);