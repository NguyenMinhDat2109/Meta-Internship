import {InGameData, IngameDataEnum} from "IngameData";

export enum DataKey
{
  PlayerData,
  Inventory,
}

export type DataType = {
  Type: DataKey;
};

export enum GearSlotID
{
  Weapon,
  Amulet,
  Ring,
  Armor,
  Helmet,
  Boots,
}

export enum Rarity
{
  Common,
  Fine,
  Rare,
  Epic,
  Legendary,
  Mythic
}

export enum RuneShape
{
  Hexagon,
  Star,
  Circle,
}

// CHANGE ME: use generic name here since we do not have gear, rune, artifact, talentCard specific name 
export enum GearItemID
{
  Gear1 = 'Gear1',
  Gear2 = 'Gear2',
  Gear3 = 'Gear3',
  Gear4 = 'Gear4',
}

export enum RuneItemID
{
  Rune1 = 'Rune1',
  Rune2 = 'Rune2',
  Rune3 = 'Rune3',
  Rune4 = 'Rune4',
}

export enum ArtifactID
{
  Artifact1 = 'Artifact1',
  Artifact2 = 'Artifact2',
  Artifact3 = 'Artifact3',
  Artifact4 = 'Artifact4',
}

export enum TalentCardID
{
  TalentCard1 = 'TalentCard1',
  TalentCard2 = 'TalentCard2',
  TalentCard3 = 'TalentCard3',
  TalentCard4 = 'TalentCard4',
}

export type GearSlot = {
  ID: GearSlotID,
  Level: number,
  EquippedGearID: GearItemID,
};

export type RuneSlots = {
  ID: string,
  Shape: RuneShape,
  EquippedRuneID: RuneItemID,
};

export type Item = {
  ID: string,
  Rarity: Rarity,
};

export type NonEquipableItem = Item & {
  Level: number,
};

export type BaseRarityEffect = {
  CommonEffect: 'string';
  FineEffect: 'string';
  RareEffect: 'string';
  EpicEffect: 'string';
  LegendaryEffect: 'string';
  MythicEffect: 'string';

};

export class Bonus
{
  id: number;
  description: string;
  stats: number | boolean;
  constructor(id: number, description: string, stats: number | boolean)
  {
    this.id = id;
    this.description = description;
    this.stats = stats;
  }

  public GetBonus()
  {
    switch(typeof (this.stats))
    {
      case "boolean": {
        InGameData.SetAttribute(this.id, this.stats);
        break;
      }
      
      case "number": 
      {
        InGameData.SetAttribute(this.id, InGameData.GetAttribute(this.id) as number + this.stats)
        break;
      }

    }
  }
}
