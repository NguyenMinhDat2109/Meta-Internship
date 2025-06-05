import {BaseRarityEffect as BaseRarityEffect, Bonus, GearSlotID, Item, NonEquipableItem} from "SD_TypeConst";
// interface IEffectBonus {
//   GetBonus(): void; 
//   GetDescripts(): void; 
// }

// class BonusMaxHP implements IEffectBonus {
//   constructor(health: number) {

//   }
//   GetDescripts(): void
//   {
//     // ...
//   }
//   GetBonus(): void
//   {
    
//   }
// }

// class MaxSpeed implements IEffectBonus {
//   constructor(speedBonus: number) {

//   }
//   GetDescripts(): void
//   {
//     throw new Error("Method not implemented.");
//   }
//   GetBonus(): void
//   {
    
//   }
// }

type ItemBaseData = {
  Name: string,
  AssetID: string,
}

export type GearData = Item & ItemBaseData &  {
  GearSlot: GearSlotID,
  Description: string,
  GearRarityAffect: Bonus[], 
}

export type RuneData = Item & ItemBaseData & {
  Type: string,
  RuneRarityAffect: Bonus[],
}

export type ArtifactData = NonEquipableItem & {
  Description: string,
  Affect: Bonus[],
}

export type TalendCardData = NonEquipableItem & {
  Affect: Bonus[],
}

