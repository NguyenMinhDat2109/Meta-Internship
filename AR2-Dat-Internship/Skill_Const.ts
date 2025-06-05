import {SkillCharacterStatsID, UISkillID} from "Config_Skills";
import {Color} from "horizon/core";
import {ImageSource} from "horizon/ui";
import {TextureManager} from "TextureManager";

export const SKILL_ICON = {
  Clover: TextureManager.GetTextureAsset('1352684499209146'),
  Fire_Wand: TextureManager.GetTextureAsset('690537936874716'),
  Santa_Water: TextureManager.GetTextureAsset('1444189536545817'),
  Empty_Tome: TextureManager.GetTextureAsset('684584384319327'),
  Armor: TextureManager.GetTextureAsset('1036972128310868'),
  Clock_Lancet: TextureManager.GetTextureAsset('1033195618721437'),
  Pummarola: TextureManager.GetTextureAsset('2568008340197016'),
  Knife: TextureManager.GetTextureAsset('1679119562702653'),
  Wings: TextureManager.GetTextureAsset('1824596828336317'),
  Axe: TextureManager.GetTextureAsset('687953690348580'),
  Prismatic_Missile: TextureManager.GetTextureAsset('1389498658851949'),
  Thousand_Edge: TextureManager.GetTextureAsset('1359440995305270'),
  Runetracer: TextureManager.GetTextureAsset('1028467215834486'),
  Night_Sword: TextureManager.GetTextureAsset('693930129937660'),
  Eskizzibur: TextureManager.GetTextureAsset('2492262081111981'),
  Flash_Arrow: TextureManager.GetTextureAsset('9481536701930951'),
  Magic_Wand: TextureManager.GetTextureAsset('1997547250770754'),
  Impostongue: TextureManager.GetTextureAsset('1228969892210077'),
  Clear_Asteroids: TextureManager.GetTextureAsset('1166066965017451'),
  Millionaire: TextureManager.GetTextureAsset('1040793378102171'),
  Festive_Winds: TextureManager.GetTextureAsset('1004900271596376'),
  Mini_Crewmate: TextureManager.GetTextureAsset('982002670763640'),
};

export const SKILL_ICON_LIST_LENGTH = 10;

export enum SkillRarity
{
  Common = 0,
  Rare = 1,
  Epic = 2,
  Legendary = 3,
}
export enum HEAL_CONFIG
{
  NormalHeal = 0.15,
  BigHeal = 0.4,
  FullHeal = 1,
  IncreaseStatChance = 0.2,
  StatsUpdateAmount = 0.05,
  HealIncreaseAmount = 0.3
}

export enum SkillCategory
{
  PlayerStats,
  ProjectileStats,
  Recovery,
}

export type SkillRewardItem = {
  SkillID: string,
  Amount: number,
}

export type SkillReward = {
  SkillCategory: SkillCategory,
  SkillRewardItems: Array<SkillRewardItem>,
}

export type SkillData = {
  ID: UISkillID;
  Name: string;
  description: string;
  Icon: ImageSource;
  Rarity: SkillRarity;
  Reobtains: number;
  UnlockSkillIds: Array<UISkillID>;
};

export type PanelData = {
  selectedSkill: SkillData;
  iconList: ImageSource[];
};

export const SkillBackgroundColorMap = new Map<SkillRarity, Color>([
  [SkillRarity.Common, new Color(9 / 255, 197 / 255, 25 / 255)],
  [SkillRarity.Rare, new Color(17 / 255, 77 / 255, 243 / 255)],
  [SkillRarity.Epic, new Color(202 / 255, 10 / 255, 202 / 255)],
  [SkillRarity.Legendary, new Color(248 / 255, 133 / 255, 26 / 255)],
]);

/**
 * Rarity weights of the skills,
 * unit: %
 */
export const RandomBaseWeights: Map<SkillRarity, number> = new Map(
  [[SkillRarity.Common, 50],
  [SkillRarity.Rare, 30],
  [SkillRarity.Epic, 15],
  [SkillRarity.Legendary, 5],
  ]);