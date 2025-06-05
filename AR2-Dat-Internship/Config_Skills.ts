import {SKILL_ICON, SkillData, SkillRarity, SkillReward, SkillCategory} from "Skill_Const";

export enum SkillCharacterStatsID
{
  AttackDamageUp = "AttackDamageUp",
  AttackSpeedUp = "AttackSpeedUp",
  MoveSpeedUp = "MoveSpeedUp",
  MaxHealthUp = "MaxHealthUp",
  DefenseUp = "DefenseUp",
  CriticalRateUp = "CriticalRateUp",
  CritecalDamageUp = "CritecalDamageUp",
  DodgeChanceUp = "DodgeChanceUp",
}

export enum SkillRecoveryID
{
  HPRecovery = "HPRecovery",
  BoostHeartHealing = "BoostHeartHealing",
  HeartIncreaseMaxHP = "HeartIncreaseMaxHP",
  HeartIncreaseAttackPower = "HeartIncreaseAttackPower",
}


export enum SkillBulletStatsID
{
  SpreadShoot = "SpreadShot",
  DoubleAttack = "DoubleAttack",
  Bounce = "Bounce",
  Ricochet = "Ricochet",
  Piercing = "Piercing",
}

export enum UISkillID
{
  AttackPowerSmall = "AttackPowerSmall",
  AttackPowerMedium = "AttackPowerMedium",
  AttackPowerBig = "AttackPowerBig",
  AttackSpeedSmall = "AttackSpeedSmall",
  AttackSpeedMedium = "AttackSpeedMedium",
  AttackSpeedBig = "AttackSpeedBig",
  MoveSpeedSmall = "MoveSpeedSmall",
  MoveSpeedMedium = "MoveSpeedMedium",
  MoveSpeedBig = "MoveSpeedBig",
  MaxHealthBonusSmall = "MaxHealthBonusSmall",
  MaxHealthBonusMedium = "MaxHealthBonusMedium",
  MaxHealthBonusBig = "MaxHealthBonusBig",
  DefenseBonusSmall = "DefenseBonusSmall",
  DefenseBonusMedium = "DefenseBonusMedium",
  DefenseBonusBig = "DefenseBonusBig",
  CompositeAttackAttackSpeedHealth = "CompositeAttackAttackSpeedHealth",
  DodgeUp = "DodgeUp",
  CritRateSmall = "CritRateSmall",
  CritRateMedium = "CritRateMedium",
  CritDamageSmall = "CritDamageSmall",
  CritDamageMedium = "CritDamageMedium",
  BulletSpreadShot = "BulletSpreadShot",
  BulletDoubleAttack = "BulletDoubleAttack",
  BulletBounceWall = "BulletBounceWall",
  BulletRicochet = "BulletRicochet",
  AttackDefenseBonus = "AttackDefenseBonus",
  HPDefenseBonus = "HPDefenseBonus",
  BulletPiercing = "BulletPiercing",
  
  HPRecovery = "HPRecovery",
  BigHPRecovery = "BigHPRecovery",
  FullHpRecovery = "FullHpRecovery",
  BoostHeartHealing = "HeartHealingIncrease",
  HeartIncreaseMaxHP = "HeartIncreaseMaxHP",
  HeartIncreaseAttackPower = "HeartIncreaseAttackPower",
}

export const SkillDataConfig: Map<UISkillID, SkillData> = new Map<UISkillID, SkillData>([
  [UISkillID.AttackPowerSmall, {
    ID: UISkillID.AttackPowerSmall,
    Name: "Attack boost",
    description: "Small boost to attack power",
    Icon: SKILL_ICON.Prismatic_Missile,
    Rarity: SkillRarity.Common,
    Reobtains: 3,
    UnlockSkillIds: [],
  }],
  [UISkillID.AttackPowerMedium, {
    ID: UISkillID.AttackPowerMedium,
    Name: "Big attack boost",
    description: "Medium boost to attack power",
    Icon: SKILL_ICON.Thousand_Edge,
    Rarity: SkillRarity.Rare,
    Reobtains: 2,
    UnlockSkillIds: [],
  }],
  [UISkillID.AttackPowerBig, {
    ID: UISkillID.AttackPowerBig,
    Name: "Huge attack boost",
    description: "Big boost to attack power",
    Icon: SKILL_ICON.Runetracer,
    Rarity: SkillRarity.Epic,
    Reobtains: 1,
    UnlockSkillIds: [],
  }],
  [UISkillID.AttackSpeedSmall, {
    ID: UISkillID.AttackSpeedSmall,
    Name: "Attack speed boost",
    description: "Small boost to Attack speed",
    Icon: SKILL_ICON.Night_Sword,
    Rarity: SkillRarity.Common,
    Reobtains: 2,
    UnlockSkillIds: [],
  }],
  [UISkillID.AttackSpeedMedium, {
    ID: UISkillID.AttackSpeedMedium,
    Name: "Big attack speed boost",
    description: "Medium boost to Attack speed",
    Icon: SKILL_ICON.Eskizzibur,
    Rarity: SkillRarity.Rare,
    Reobtains: 1,
    UnlockSkillIds: [],
  }],
  [UISkillID.AttackSpeedBig, {
    ID: UISkillID.AttackSpeedBig,
    Name: "Huge attack speed boost",
    description: "Big boost to Attack speed",
    Icon: SKILL_ICON.Flash_Arrow,
    Rarity: SkillRarity.Epic,
    Reobtains: 0,
    UnlockSkillIds: [],
  }],
  [UISkillID.MoveSpeedSmall, {
    ID: UISkillID.MoveSpeedSmall,
    Name: "Speed up",
    description: "Small boost to Move Speed",
    Icon: SKILL_ICON.Magic_Wand,
    Rarity: SkillRarity.Common,
    Reobtains: 3,
    UnlockSkillIds: [],
  }],
  [UISkillID.MoveSpeedMedium, {
    ID: UISkillID.MoveSpeedMedium,
    Name: "Big speed up",
    description: "Medium boost to Move Speed",
    Icon: SKILL_ICON.Impostongue,
    Rarity: SkillRarity.Rare,
    Reobtains: 1,
    UnlockSkillIds: [],
  }],
  [UISkillID.MoveSpeedBig, {
    ID: UISkillID.MoveSpeedBig,
    Name: "Huge speed up",
    description: "Big boost to Move Speed",
    Icon: SKILL_ICON.Clear_Asteroids,
    Rarity: SkillRarity.Epic,
    Reobtains: 0,
    UnlockSkillIds: [],
  }],
  [UISkillID.MaxHealthBonusSmall, {
    ID: UISkillID.MaxHealthBonusSmall,
    Name: "Health up",
    description: "Small boost to Max HP",
    Icon: SKILL_ICON.Millionaire,
    Rarity: SkillRarity.Common,
    Reobtains: 3,
    UnlockSkillIds: [],
  }],
  [UISkillID.MaxHealthBonusMedium, {
    ID: UISkillID.MaxHealthBonusMedium,
    Name: "Big Health up",
    description: "Medium boost to Max HP",
    Icon: SKILL_ICON.Festive_Winds,
    Rarity: SkillRarity.Rare,
    Reobtains: 2,
    UnlockSkillIds: [],
  }],
  [UISkillID.MaxHealthBonusBig, {
    ID: UISkillID.MaxHealthBonusBig,
    Name: "Huge health up",
    description: "Big boost to Max HP",
    Icon: SKILL_ICON.Mini_Crewmate,
    Rarity: SkillRarity.Epic,
    Reobtains: 1,
    UnlockSkillIds: [],
  }],
  [UISkillID.DefenseBonusSmall, {
    ID: UISkillID.DefenseBonusSmall,
    Name: "Defense up",
    description: "Small boost to Defense",
    Icon: SKILL_ICON.Axe,
    Rarity: SkillRarity.Common,
    Reobtains: 3,
    UnlockSkillIds: [],
  }],
  [UISkillID.DefenseBonusMedium, {
    ID: UISkillID.DefenseBonusMedium,
    Name: "Big Defense up",
    description: "Medium boost to Defense",
    Icon: SKILL_ICON.Knife,
    Rarity: SkillRarity.Rare,
    Reobtains: 2,
    UnlockSkillIds: [],
  }],
  [UISkillID.DefenseBonusBig, {
    ID: UISkillID.DefenseBonusBig,
    Name: "Huge Defense up",
    description: "Big boost to Defense",
    Icon: SKILL_ICON.Knife,
    Rarity: SkillRarity.Epic,
    Reobtains: 1,
    UnlockSkillIds: [],
  }],
  [UISkillID.CompositeAttackAttackSpeedHealth, {
    ID: UISkillID.CompositeAttackAttackSpeedHealth,
    Name: "Trinity power",
    description: "Medium boost to attack power, defense, max HP",
    Icon: SKILL_ICON.Empty_Tome,
    Rarity: SkillRarity.Legendary,
    Reobtains: 0,
    UnlockSkillIds: [],
  }],
  [UISkillID.DodgeUp, {
    ID: UISkillID.DodgeUp,
    Name: "Dodge up",
    description: "Increase dodge chance",
    Icon: SKILL_ICON.Clock_Lancet,
    Rarity: SkillRarity.Common,
    Reobtains: 0,
    UnlockSkillIds: [],
  }],
  [UISkillID.CritRateSmall, {
    ID: UISkillID.CritRateSmall,
    Name: "Crit rate up",
    description: "Crit rate boost",
    Icon: SKILL_ICON.Pummarola,
    Rarity: SkillRarity.Rare,
    Reobtains: 0,
    UnlockSkillIds: [],
  }],
  [UISkillID.CritRateMedium, {
    ID: UISkillID.CritRateMedium,
    Name: "Big crit rate up",
    description: "Crit rate big boost",
    Icon: SKILL_ICON.Wings,
    Rarity: SkillRarity.Legendary,
    Reobtains: 0,
    UnlockSkillIds: [],
  }],

  [UISkillID.CritDamageSmall, {
    ID: UISkillID.CritDamageSmall,
    Name: "Crit damage up",
    description: "Crit damage boost",
    Icon: SKILL_ICON.Santa_Water,
    Rarity: SkillRarity.Rare,
    Reobtains: 1,
    UnlockSkillIds: [],
  }],
  [UISkillID.CritDamageMedium, {
    ID: UISkillID.CritDamageMedium,
    Name: "Big Crit damage up",
    description: "Crit damage big boost",
    Icon: SKILL_ICON.Santa_Water,
    Rarity: SkillRarity.Legendary,
    Reobtains: 0,
    UnlockSkillIds: [],
  }],
  [UISkillID.BulletSpreadShot, {
    ID: UISkillID.BulletSpreadShot,
    Name: "Spread shot",
    description: "Gain spread shot",
    Icon: SKILL_ICON.Santa_Water,
    Rarity: SkillRarity.Rare,
    Reobtains: 0,
    UnlockSkillIds: [],
  }],
  [UISkillID.BulletDoubleAttack, {
    ID: UISkillID.BulletDoubleAttack,
    Name: "Double attack",
    description: "Gain double shot",
    Icon: SKILL_ICON.Santa_Water,
    Rarity: SkillRarity.Legendary,
    Reobtains: 0,
    UnlockSkillIds: [],
  }],
  [UISkillID.BulletBounceWall, {
    ID: UISkillID.BulletBounceWall,
    Name: "Bounce wall",
    description: "Projectile bounce wall +1",
    Icon: SKILL_ICON.Santa_Water,
    Rarity: SkillRarity.Common,
    Reobtains: 1,
    UnlockSkillIds: [],
  }],
  [UISkillID.BulletRicochet, {
    ID: UISkillID.BulletRicochet,
    Name: "Ricochet",
    description: "Projectile can ricochet to near enemy",
    Icon: SKILL_ICON.Santa_Water,
    Rarity: SkillRarity.Rare,
    Reobtains: 0,
    UnlockSkillIds: [],
  }],
  [UISkillID.AttackDefenseBonus, {
    ID: UISkillID.AttackDefenseBonus,
    Name: "Power fortress",
    description: "Big boost to attack power and medium boost defense",
    Icon: SKILL_ICON.Axe,
    Rarity: SkillRarity.Legendary,
    Reobtains: 0,
    UnlockSkillIds: [],
  }],
  [UISkillID.HPDefenseBonus, {
    ID: UISkillID.HPDefenseBonus,
    Name: "Impenetrable",
    description: "Big boost to Max HP, medium boost to defense",
    Icon: SKILL_ICON.Knife,
    Rarity: SkillRarity.Legendary,
    Reobtains: 0,
    UnlockSkillIds: [],
  }],
  [UISkillID.BulletPiercing, {
    ID: UISkillID.BulletPiercing,
    Name: "Piercing",
    description: "Attack piercing +1",
    Icon: SKILL_ICON.Night_Sword,
    Rarity: SkillRarity.Rare,
    Reobtains: 1,
    UnlockSkillIds: [],
  }],
  [UISkillID.HPRecovery, {
    ID: UISkillID.HPRecovery,
    Name: "Hp recovery",
    description: "Recover small amount of HP",
    Icon: SKILL_ICON.Pummarola,
    Rarity: SkillRarity.Common,
    Reobtains: 3,
    UnlockSkillIds: [],
  }],
  [UISkillID.BigHPRecovery, {
    ID: UISkillID.BigHPRecovery,
    Name: "Big HP recovery",
    description: "Recover medium amount of HP",
    Icon: SKILL_ICON.Pummarola,
    Rarity: SkillRarity.Rare,
    Reobtains: 2,
    UnlockSkillIds: [],
  }],
  [UISkillID.FullHpRecovery, {
    ID: UISkillID.FullHpRecovery,
    Name: "Full HP recovery",
    description: "Recover your HP to full",
    Icon: SKILL_ICON.Pummarola,
    Rarity: SkillRarity.Epic,
    Reobtains: 1,
    UnlockSkillIds: [],
  }],
  [UISkillID.BoostHeartHealing, {
    ID: UISkillID.BoostHeartHealing,
    Name: "Heart healing increase",
    description: "Increase healing amount from heart",
    Icon: SKILL_ICON.Pummarola,
    Rarity: SkillRarity.Rare,
    Reobtains: 0,
    UnlockSkillIds: [],
  }],
  [UISkillID.HeartIncreaseMaxHP, {
    ID: UISkillID.HeartIncreaseMaxHP,
    Name: "Heart increase max HP",
    description: "Getting heart have chance to increase max HP",
    Icon: SKILL_ICON.Pummarola,
    Rarity: SkillRarity.Rare,
    Reobtains: 0,
    UnlockSkillIds: [],
  }],
  [UISkillID.HeartIncreaseAttackPower, {
    ID: UISkillID.HeartIncreaseAttackPower,
    Name: "Heart increase attack power",
    description: "Getting heart have chance to increase attack power",
    Icon: SKILL_ICON.Pummarola,
    Rarity: SkillRarity.Rare,
    Reobtains: 0,
    UnlockSkillIds: [],
  }],
]);

export const SkillRequirementsConfig: Map<UISkillID, UISkillID> = new Map([
  // [UISkillID.AttackPowerSmall, UISkillID.CritRateMedium],
  // [UISkillID.AttackPowerMedium, UISkillID.CritRateBig],
  // [UISkillID.AttackPowerBig, UISkillID.CritDamageSmall],
]);

export const SkillRewardItems: Record<UISkillID, Array<SkillReward>> = {
  [UISkillID.AttackPowerSmall]: [{
    SkillCategory: SkillCategory.PlayerStats,
    SkillRewardItems: [
      {SkillID: SkillCharacterStatsID.AttackDamageUp, Amount: 1},
    ],
  }],
  [UISkillID.AttackPowerMedium]: [{
    SkillCategory: SkillCategory.PlayerStats,
    SkillRewardItems: [
      {SkillID: SkillCharacterStatsID.AttackDamageUp, Amount: 2},
    ],
  }],
  [UISkillID.AttackPowerBig]: [{
    SkillCategory: SkillCategory.PlayerStats,
    SkillRewardItems: [
      {SkillID: SkillCharacterStatsID.AttackDamageUp, Amount: 4},
    ],
  }],
  [UISkillID.AttackSpeedSmall]: [{
    SkillCategory: SkillCategory.PlayerStats,
    SkillRewardItems: [
      {SkillID: SkillCharacterStatsID.AttackSpeedUp, Amount: 1},
    ],
  }],
  [UISkillID.AttackSpeedMedium]: [{
    SkillCategory: SkillCategory.PlayerStats,
    SkillRewardItems: [
      {SkillID: SkillCharacterStatsID.AttackSpeedUp, Amount: 2},
    ],
  }],
  [UISkillID.AttackSpeedBig]: [{
    SkillCategory: SkillCategory.PlayerStats,
    SkillRewardItems: [
      {SkillID: SkillCharacterStatsID.AttackSpeedUp, Amount: 4},
    ],
  }],
  [UISkillID.MoveSpeedSmall]: [{
    SkillCategory: SkillCategory.PlayerStats,
    SkillRewardItems: [
      {SkillID: SkillCharacterStatsID.MoveSpeedUp, Amount: 1},
    ],
  }],
  [UISkillID.MoveSpeedMedium]: [{
    SkillCategory: SkillCategory.PlayerStats,
    SkillRewardItems: [
      {SkillID: SkillCharacterStatsID.MoveSpeedUp, Amount: 2},
    ],
  }],
  [UISkillID.MoveSpeedBig]: [{
    SkillCategory: SkillCategory.PlayerStats,
    SkillRewardItems: [
      {SkillID: SkillCharacterStatsID.MoveSpeedUp, Amount: 4},
    ],
  }],
  [UISkillID.MaxHealthBonusSmall]: [{
    SkillCategory: SkillCategory.PlayerStats,
    SkillRewardItems: [
      {SkillID: SkillCharacterStatsID.MaxHealthUp, Amount: 1},
    ],
  }],
  [UISkillID.MaxHealthBonusMedium]: [{
    SkillCategory: SkillCategory.PlayerStats,
    SkillRewardItems: [
      {SkillID: SkillCharacterStatsID.MaxHealthUp, Amount: 2},
    ],
  }],
  [UISkillID.MaxHealthBonusBig]: [{
    SkillCategory: SkillCategory.PlayerStats,
    SkillRewardItems: [
      {SkillID: SkillCharacterStatsID.MaxHealthUp, Amount: 4},
    ],
  }],
  [UISkillID.DefenseBonusSmall]: [{
    SkillCategory: SkillCategory.PlayerStats,
    SkillRewardItems: [
      {SkillID: SkillCharacterStatsID.DefenseUp, Amount: 1},
    ],
  }],
  [UISkillID.DefenseBonusMedium]: [{
    SkillCategory: SkillCategory.PlayerStats,
    SkillRewardItems: [
      {SkillID: SkillCharacterStatsID.DefenseUp, Amount: 2},
    ],
  }],
  [UISkillID.DefenseBonusBig]: [{
    SkillCategory: SkillCategory.PlayerStats,
    SkillRewardItems: [
      {SkillID: SkillCharacterStatsID.DefenseUp, Amount: 4},
    ],
  }],
  [UISkillID.CompositeAttackAttackSpeedHealth]: [{
    SkillCategory: SkillCategory.PlayerStats,
    SkillRewardItems: [
      {SkillID: SkillCharacterStatsID.AttackDamageUp, Amount: 2},
      {SkillID: SkillCharacterStatsID.AttackSpeedUp, Amount: 2},
      {SkillID: SkillCharacterStatsID.MaxHealthUp, Amount: 2},
    ],
  }],
  [UISkillID.DodgeUp]: [{
    SkillCategory: SkillCategory.PlayerStats,
    SkillRewardItems: [
      {SkillID: SkillCharacterStatsID.DodgeChanceUp, Amount: 0.08}, //percent
    ],
  }],
  [UISkillID.CritRateSmall]: [{
    SkillCategory: SkillCategory.PlayerStats,
    SkillRewardItems: [
      {SkillID: SkillCharacterStatsID.CriticalRateUp, Amount: 0.05},
    ],
  }],
  [UISkillID.CritRateMedium]: [{
    SkillCategory: SkillCategory.PlayerStats,
    SkillRewardItems: [
      {SkillID: SkillCharacterStatsID.CriticalRateUp, Amount: 0.12},
    ],
  }],
  [UISkillID.CritDamageSmall]: [{
    SkillCategory: SkillCategory.PlayerStats,
    SkillRewardItems: [
      {SkillID: SkillCharacterStatsID.CritecalDamageUp, Amount: 0.3},
    ],
  }],
  [UISkillID.CritDamageMedium]: [{
    SkillCategory: SkillCategory.PlayerStats,
    SkillRewardItems: [
      {SkillID: SkillCharacterStatsID.CritecalDamageUp, Amount: 0.6},
    ],
  }],
  [UISkillID.BulletSpreadShot]: [{
    SkillCategory: SkillCategory.ProjectileStats,
    SkillRewardItems: [
      {SkillID: SkillBulletStatsID.SpreadShoot, Amount: 1},
    ],
  }],
  [UISkillID.BulletDoubleAttack]: [{
    SkillCategory: SkillCategory.ProjectileStats,
    SkillRewardItems: [
      {SkillID: SkillBulletStatsID.DoubleAttack, Amount: 1},
    ],
  }],
  [UISkillID.BulletBounceWall]: [{
    SkillCategory: SkillCategory.ProjectileStats,
    SkillRewardItems: [
      {SkillID: SkillBulletStatsID.Bounce, Amount: 1},
    ],
  }],
  [UISkillID.BulletRicochet]: [{
    SkillCategory: SkillCategory.ProjectileStats,
    SkillRewardItems: [
      {SkillID: SkillBulletStatsID.Ricochet, Amount: 1},
    ],
  }],
  [UISkillID.AttackDefenseBonus]: [{
    SkillCategory: SkillCategory.PlayerStats,
    SkillRewardItems: [
      {SkillID: SkillCharacterStatsID.AttackDamageUp, Amount: 4},
      {SkillID: SkillCharacterStatsID.DefenseUp, Amount: 2},
    ],
  }],
  [UISkillID.HPDefenseBonus]: [{
    SkillCategory: SkillCategory.PlayerStats,
    SkillRewardItems: [
      {SkillID: SkillCharacterStatsID.MaxHealthUp, Amount: 4},
      {SkillID: SkillCharacterStatsID.DefenseUp, Amount: 2},
    ],
  }],
  [UISkillID.BulletPiercing]: [{
    SkillCategory: SkillCategory.ProjectileStats,
    SkillRewardItems: [
      {SkillID: SkillBulletStatsID.Piercing, Amount: 1},
    ],
  }],
  [UISkillID.HPRecovery]: [{
    SkillCategory: SkillCategory.Recovery,
    SkillRewardItems: [
      {SkillID: SkillRecoveryID.HPRecovery, Amount: 0.15}

    ],
  }],
  [UISkillID.BigHPRecovery]: [{
    SkillCategory: SkillCategory.Recovery,
    SkillRewardItems: [
      {SkillID: SkillRecoveryID.HPRecovery, Amount: 0.4}

    ],
  }],
  [UISkillID.FullHpRecovery]: [{
    SkillCategory: SkillCategory.Recovery,
    SkillRewardItems: [
      {SkillID: SkillRecoveryID.HPRecovery, Amount: 1}
    ],
  }],
  [UISkillID.BoostHeartHealing]: [{
    SkillCategory: SkillCategory.PlayerStats,
    SkillRewardItems: [
      {SkillID: SkillRecoveryID.BoostHeartHealing, Amount: 0.3}
    ],
  }],
  [UISkillID.HeartIncreaseMaxHP]: [{
    SkillCategory: SkillCategory.PlayerStats,
    SkillRewardItems: [
      {SkillID: SkillRecoveryID.HeartIncreaseMaxHP, Amount: 0.5},// rate base = 0.1 => 0.5x0.1 =0.05
    ],
  }],
  [UISkillID.HeartIncreaseAttackPower]: [{
    SkillCategory: SkillCategory.PlayerStats,
    SkillRewardItems: [
      {SkillID: SkillRecoveryID.HeartIncreaseAttackPower, Amount: 0.5},// rate base = 0.1 => 0.5 x 0.1 =0.05

    ],
  }],
};


