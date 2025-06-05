
import {EnemyID, WAVE_ID} from "Enemy_Const";
import {Vec3} from "horizon/core";

export const CONFIG_MAP1 =
{
  MapName: "Map 1",
  WavesConfig: new Map([
    [
      WAVE_ID.WAVE_1,
      {
        EnemiesMapSpawm: [
          {EnemyID: EnemyID.SLIME, Position: new Vec3(6, 0, -2), },
          {EnemyID: EnemyID.RANGER_SLIME, Position: new Vec3(6, 0, 2), },
        ],
      },
    ],
    [
      WAVE_ID.WAVE_2,
      {
        EnemiesMapSpawm: [
          {EnemyID: EnemyID.RANGER_SLIME, Position: new Vec3(-6, 0, 2), },
          {EnemyID: EnemyID.SLIME, Position: new Vec3(-6, 0, -2), },
          {EnemyID: EnemyID.SLIME, Position: new Vec3(6, 0, 2), },
          {EnemyID: EnemyID.SLIME, Position: new Vec3(8, 0, 2), },
          {EnemyID: EnemyID.SLIME, Position: new Vec3(9, 0, 2), },
        ],
      },
    ],
    [
      WAVE_ID.WAVE_3,
      {
        EnemiesMapSpawm: [
          {EnemyID: EnemyID.SLIME, Position: new Vec3(-6, 0, 2), },
          {EnemyID: EnemyID.SLIME, Position: new Vec3(-6, 0, -2), },
          {EnemyID: EnemyID.SLIME, Position: new Vec3(6, 0, -2), },
          {EnemyID: EnemyID.SLIME, Position: new Vec3(8, 0, -2), },
          {EnemyID: EnemyID.SLIME, Position: new Vec3(8, 0, 2), },
          {EnemyID: EnemyID.SLIME, Position: new Vec3(9, 0, -2), },
          {EnemyID: EnemyID.SLIME, Position: new Vec3(9, 0, 2), },
        ],
      },
    ],
    [
      WAVE_ID.WAVE_4,
      {
        EnemiesMapSpawm: [
          {EnemyID: EnemyID.SLIME, Position: new Vec3(-6, 0, 2), },
          {EnemyID: EnemyID.RANGER_SLIME, Position: new Vec3(-6, 0, -2), },
          {EnemyID: EnemyID.SLIME, Position: new Vec3(6, 0, -2), },
          {EnemyID: EnemyID.SLIME, Position: new Vec3(6, 0, 2), }
        ],
      },
    ],
    [
      WAVE_ID.WAVE_5,
      {
        EnemiesMapSpawm: [
          // {EnemyID: EnemyID.BOSS, Position: new Vec3(-7, 0, 1), },
          {EnemyID: EnemyID.PROTOBOSS_1, Position: new Vec3(9, 0, 2), },
        ],
        IsBossWave: true
      },
    ],
    [
      WAVE_ID.WAVE_6,
      {
        EnemiesMapSpawm: [
          {EnemyID: EnemyID.SLIME, Position: new Vec3(-7, 0, -1), },
          {EnemyID: EnemyID.SLIME, Position: new Vec3(-5, 0, -3), },
        ],
      },
    ],
    [
      WAVE_ID.WAVE_7,
      {
        EnemiesMapSpawm: [
          {EnemyID: EnemyID.RANGER_SLIME, Position: new Vec3(7, 0, 1), },
          {EnemyID: EnemyID.SLIME, Position: new Vec3(5, 0, -1), },
        ],
      },
    ],
    [
      WAVE_ID.WAVE_8,
      {
        EnemiesMapSpawm: [
          {EnemyID: EnemyID.RANGER_SLIME, Position: new Vec3(-6, 0, 0), },
          {EnemyID: EnemyID.SLIME, Position: new Vec3(6, 0, 0), },
        ],
      },
    ],
    [
      WAVE_ID.WAVE_9,
      {
        EnemiesMapSpawm: [
          {EnemyID: EnemyID.SLIME, Position: new Vec3(-5, 0, 2), },
          {EnemyID: EnemyID.RANGER_SLIME, Position: new Vec3(5, 0, -2), },
          {EnemyID: EnemyID.SLIME, Position: new Vec3(0, 0, 0), },
        ],
      },
    ],
    [
      WAVE_ID.WAVE_10,
      {
        EnemiesMapSpawm: [
          {EnemyID: EnemyID.BOSS, Position: new Vec3(-7, 0, 3), },
          // {EnemyID: EnemyID.ROBOT, Position: new Vec3(-5, 0, 1), },
          // {EnemyID: EnemyID.CHICKEN, Position: new Vec3(7, 0, -3), },
          // {EnemyID: EnemyID.CHICKEN, Position: new Vec3(5, 0, -1), },
          // {EnemyID: EnemyID.ROBOT, Position: new Vec3(0, 0, 2), },
        ],
        IsBossWave: true
      },
    ],
    [
      WAVE_ID.WAVE_11,
      {
        EnemiesMapSpawm: [
          {EnemyID: EnemyID.SLIME, Position: new Vec3(-4, 0, 3), },
        ],
      },
    ],
    [
      WAVE_ID.WAVE_12,
      {
        EnemiesMapSpawm: [
          {EnemyID: EnemyID.RANGER_SLIME, Position: new Vec3(4, 0, -3), },
        ],
      },
    ],
    [
      WAVE_ID.WAVE_13,
      {
        EnemiesMapSpawm: [
          {EnemyID: EnemyID.SLIME, Position: new Vec3(-3, 0, 1), },
          {EnemyID: EnemyID.RANGER_SLIME, Position: new Vec3(3, 0, -1), },
        ],
      },
    ],
    [
      WAVE_ID.WAVE_14,
      {
        EnemiesMapSpawm: [
          {EnemyID: EnemyID.RANGER_SLIME, Position: new Vec3(-2, 0, 2), },
          {EnemyID: EnemyID.SLIME, Position: new Vec3(2, 0, -2), },
        ],
      },
    ],
    [
      WAVE_ID.WAVE_15,
      {
        EnemiesMapSpawm: [
          {EnemyID: EnemyID.BOSS, Position: new Vec3(-1, 0, 0), },
          // {EnemyID: EnemyID.ROBOT, Position: new Vec3(1, 0, 0), },
        ],
      },
    ],
    [
      WAVE_ID.WAVE_16,
      {
        EnemiesMapSpawm: [
          {EnemyID: EnemyID.RANGER_SLIME, Position: new Vec3(-8, 0, 2), },
        ],
      },
    ],
    [
      WAVE_ID.WAVE_17,
      {
        EnemiesMapSpawm: [
          {EnemyID: EnemyID.SLIME, Position: new Vec3(8, 0, -2), },
        ],
      },
    ],
    [
      WAVE_ID.WAVE_18,
      {
        EnemiesMapSpawm: [
          {EnemyID: EnemyID.RANGER_SLIME, Position: new Vec3(-5, 0, -1), },
          {EnemyID: EnemyID.SLIME, Position: new Vec3(5, 0, 1), },
        ],
      },
    ],
    [
      WAVE_ID.WAVE_19,
      {
        EnemiesMapSpawm: [
          {EnemyID: EnemyID.SLIME, Position: new Vec3(-4, 0, -2), },
          {EnemyID: EnemyID.RANGER_SLIME, Position: new Vec3(4, 0, 2), },
        ],
      },
    ],
    [
      WAVE_ID.WAVE_20,
      {
        EnemiesMapSpawm: [
          {EnemyID: EnemyID.BOSS, Position: new Vec3(-8, 0, 3), },
          // {EnemyID: EnemyID.ROBOT, Position: new Vec3(-6, 0, 1), },
          // {EnemyID: EnemyID.CHICKEN, Position: new Vec3(-4, 0, -1), },
          // {EnemyID: EnemyID.ROBOT, Position: new Vec3(8, 0, -3), },
          // {EnemyID: EnemyID.CHICKEN, Position: new Vec3(6, 0, -1), },
          // {EnemyID: EnemyID.ROBOT, Position: new Vec3(4, 0, 1), },
        ],
      },
    ],
    [
      WAVE_ID.WAVE_21,
      {
        EnemiesMapSpawm: [
          {EnemyID: EnemyID.RANGER_SLIME, Position: new Vec3(-3, 0, 3), },
        ],
      },
    ],
    [
      WAVE_ID.WAVE_22,
      {
        EnemiesMapSpawm: [
          {EnemyID: EnemyID.SLIME, Position: new Vec3(3, 0, -3), },
        ],
      },
    ],
    [
      WAVE_ID.WAVE_23,
      {
        EnemiesMapSpawm: [
          {EnemyID: EnemyID.RANGER_SLIME, Position: new Vec3(-2, 0, 1), },
          {EnemyID: EnemyID.SLIME, Position: new Vec3(2, 0, -1), },
        ],
      },
    ],
    [
      WAVE_ID.WAVE_24,
      {
        EnemiesMapSpawm: [
          {EnemyID: EnemyID.SLIME, Position: new Vec3(-1, 0, 2), },
          {EnemyID: EnemyID.RANGER_SLIME, Position: new Vec3(1, 0, -2), },
        ],
      },
    ],
    [
      WAVE_ID.WAVE_25,
      {
        EnemiesMapSpawm: [
          {EnemyID: EnemyID.BOSS, Position: new Vec3(0, 0, 0), },
          // {EnemyID: EnemyID.CHICKEN, Position: new Vec3(0, 0, 1), },
        ],
      },
    ],
    [
      WAVE_ID.WAVE_26,
      {
        EnemiesMapSpawm: [
          {EnemyID: EnemyID.SLIME, Position: new Vec3(-9, 0, -1), },
        ],
      },
    ],
    [
      WAVE_ID.WAVE_27,
      {
        EnemiesMapSpawm: [
          {EnemyID: EnemyID.RANGER_SLIME, Position: new Vec3(9, 0, 1), },
        ],
      },
    ],
    [
      WAVE_ID.WAVE_28,
      {
        EnemiesMapSpawm: [
          {EnemyID: EnemyID.SLIME, Position: new Vec3(-7, 0, 0), },
          {EnemyID: EnemyID.RANGER_SLIME, Position: new Vec3(7, 0, 0), },
        ],
      },
    ],
    [
      WAVE_ID.WAVE_29,
      {
        EnemiesMapSpawm: [
          {EnemyID: EnemyID.RANGER_SLIME, Position: new Vec3(-6, 0, -2), },
          {EnemyID: EnemyID.SLIME, Position: new Vec3(6, 0, 2), },
        ],
      },
    ],
    [
      WAVE_ID.WAVE_30,
      {
        EnemiesMapSpawm: [
          {EnemyID: EnemyID.BOSS, Position: new Vec3(-9, 0, 4), },
          // {EnemyID: EnemyID.CHICKEN, Position: new Vec3(-7, 0, 2), },
          // {EnemyID: EnemyID.ROBOT, Position: new Vec3(-5, 0, 0), },
          // {EnemyID: EnemyID.CHICKEN, Position: new Vec3(9, 0, -4), },
          // {EnemyID: EnemyID.ROBOT, Position: new Vec3(7, 0, -2), },
          // {EnemyID: EnemyID.CHICKEN, Position: new Vec3(5, 0, 0), },
          // {EnemyID: EnemyID.ROBOT, Position: new Vec3(0, 0, 3), },
        ],
      },
    ],
    [
      WAVE_ID.WAVE_31,
      {
        EnemiesMapSpawm: [
          {EnemyID: EnemyID.SLIME, Position: new Vec3(-2, 0, 3), },
        ],
      },
    ],
    [
      WAVE_ID.WAVE_32,
      {
        EnemiesMapSpawm: [
          {EnemyID: EnemyID.RANGER_SLIME, Position: new Vec3(2, 0, -3), },
        ],
      },
    ],
    [
      WAVE_ID.WAVE_33,
      {
        EnemiesMapSpawm: [
          {EnemyID: EnemyID.SLIME, Position: new Vec3(-1, 0, 1), },
          {EnemyID: EnemyID.RANGER_SLIME, Position: new Vec3(1, 0, -1), },
        ],
      },
    ],
    [
      WAVE_ID.WAVE_34,
      {
        EnemiesMapSpawm: [
          {EnemyID: EnemyID.RANGER_SLIME, Position: new Vec3(0, 0, 2), },
          {EnemyID: EnemyID.SLIME, Position: new Vec3(0, 0, -2), },
        ],
      },
    ],
    [
      WAVE_ID.WAVE_35,
      {
        EnemiesMapSpawm: [
          {EnemyID: EnemyID.BOSS, Position: new Vec3(-3, 0, -2), },
          // {EnemyID: EnemyID.ROBOT, Position: new Vec3(3, 0, 2), },
        ],
      },
    ],
    [
      WAVE_ID.WAVE_36,
      {
        EnemiesMapSpawm: [
          {EnemyID: EnemyID.RANGER_SLIME, Position: new Vec3(-10, 0, 1), },
        ],
      },
    ],
    [
      WAVE_ID.WAVE_37,
      {
        EnemiesMapSpawm: [
          {EnemyID: EnemyID.SLIME, Position: new Vec3(10, 0, -1), },
        ],
      },
    ],
    [
      WAVE_ID.WAVE_38,
      {
        EnemiesMapSpawm: [
          {EnemyID: EnemyID.RANGER_SLIME, Position: new Vec3(-8, 0, -3), },
          {EnemyID: EnemyID.SLIME, Position: new Vec3(8, 0, 3), },
        ],
      },
    ],
    [
      WAVE_ID.WAVE_39,
      {
        EnemiesMapSpawm: [
          {EnemyID: EnemyID.SLIME, Position: new Vec3(-9, 0, 2), },
          {EnemyID: EnemyID.RANGER_SLIME, Position: new Vec3(9, 0, -2), },
        ],
      },
    ],
    [
      WAVE_ID.WAVE_40,
      {
        EnemiesMapSpawm: [
          {EnemyID: EnemyID.BOSS, Position: new Vec3(-10, 0, 4), },
          // {EnemyID: EnemyID.CHICKEN, Position: new Vec3(-8, 0, 2), },
          // {EnemyID: EnemyID.ROBOT, Position: new Vec3(-6, 0, 0), },
          // {EnemyID: EnemyID.CHICKEN, Position: new Vec3(10, 0, -4), },
          // {EnemyID: EnemyID.ROBOT, Position: new Vec3(8, 0, -2), },
          // {EnemyID: EnemyID.CHICKEN, Position: new Vec3(6, 0, 0), },
        ],
      },
    ],
    [
      WAVE_ID.WAVE_41,
      {
        EnemiesMapSpawm: [
          {EnemyID: EnemyID.RANGER_SLIME, Position: new Vec3(-4, 0, -1), },
        ],
      },
    ],
    [
      WAVE_ID.WAVE_42,
      {
        EnemiesMapSpawm: [
          {EnemyID: EnemyID.SLIME, Position: new Vec3(4, 0, 1), },
        ],
      },
    ],
    [
      WAVE_ID.WAVE_43,
      {
        EnemiesMapSpawm: [
          {EnemyID: EnemyID.SLIME, Position: new Vec3(-3, 0, 0), },
          {EnemyID: EnemyID.RANGER_SLIME, Position: new Vec3(3, 0, 0), },
        ],
      },
    ],
    [
      WAVE_ID.WAVE_44,
      {
        EnemiesMapSpawm: [
          {EnemyID: EnemyID.RANGER_SLIME, Position: new Vec3(-2, 0, -2), },
          {EnemyID: EnemyID.SLIME, Position: new Vec3(2, 0, 2), },
        ],
      },
    ],
    [
      WAVE_ID.WAVE_45,
      {
        EnemiesMapSpawm: [
          {EnemyID: EnemyID.SLIME, Position: new Vec3(-1, 0, -3), },
          {EnemyID: EnemyID.RANGER_SLIME, Position: new Vec3(1, 0, 3), },
        ],
      },
    ],
    [
      WAVE_ID.WAVE_46,
      {
        EnemiesMapSpawm: [
          {EnemyID: EnemyID.RANGER_SLIME, Position: new Vec3(-11, 0, 2), },
        ],
      },
    ],
    [
      WAVE_ID.WAVE_47,
      {
        EnemiesMapSpawm: [
          {EnemyID: EnemyID.SLIME, Position: new Vec3(11, 0, -2), },
        ],
      },
    ],
    [
      WAVE_ID.WAVE_48,
      {
        EnemiesMapSpawm: [
          {EnemyID: EnemyID.RANGER_SLIME, Position: new Vec3(-9, 0, 1), },
          {EnemyID: EnemyID.SLIME, Position: new Vec3(9, 0, -1), },
        ],
      },
    ],
    [
      WAVE_ID.WAVE_49,
      {
        EnemiesMapSpawm: [
          {EnemyID: EnemyID.SLIME, Position: new Vec3(-10, 0, 0), },
          {EnemyID: EnemyID.RANGER_SLIME, Position: new Vec3(10, 0, 0), },
        ],
      },
    ],
    [
      WAVE_ID.WAVE_50,
      {
        EnemiesMapSpawm: [
          {EnemyID: EnemyID.BOSS, Position: new Vec3(-11, 0, 3), },
          // {EnemyID: EnemyID.CHICKEN, Position: new Vec3(-9, 0, 1), },
          // {EnemyID: EnemyID.ROBOT, Position: new Vec3(-7, 0, -1), },
          // {EnemyID: EnemyID.CHICKEN, Position: new Vec3(11, 0, -3), },
          // {EnemyID: EnemyID.ROBOT, Position: new Vec3(9, 0, -1), },
          // {EnemyID: EnemyID.CHICKEN, Position: new Vec3(7, 0, 1), },
          // {EnemyID: EnemyID.ROBOT, Position: new Vec3(0, 0, -4), },
        ],
      },
    ],
  ])
};