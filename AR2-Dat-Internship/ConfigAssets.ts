
export type PlayerAnimationConfig = {
  AssetID: string,
  VersionID: string,
  Duration: number, // Second
}

export type KeyFrameConfig = {
  Timer: number, // Key frame sending listener
}

export const ANIMATION_PLAYER_SHOOT_CONFIG: PlayerAnimationConfig & KeyFrameConfig = {
  AssetID: '1741746353082628',
  VersionID: '24048896968044634',
  Duration: 31 / 30,
  Timer: 18, // IMPROVE: in naming config. //Key frame shoot
}

export class EntityAssetIDs
{
  public static PlayerBulletID = '4123525611270347';
  public static LootItemExperienceID = '629352699956223';
  public static LootItemHealingID = '1365784997866973';
  public static ShadowID = '990504982506843';
  public static HealthBarID = '1361838558348796';
  public static MarkerID = '1131689288716572';
  public static PlayerControllerID = '1330399341506554';
  public static ShieldID = '1004089088318708';
  public static SpawnerEffectID = '964715399203385';
  public static LootItemGoldIDBig = '1439412117232917';
  public static LootItemGoldIDMedium = '501492816323593';
  public static LootItemGoldIDSmall = '1710994233122156';

 
}