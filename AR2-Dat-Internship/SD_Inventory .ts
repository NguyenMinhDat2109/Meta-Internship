import {Item, GearSlot, RuneSlots, NonEquipableItem, DataType, DataKey, GearItemID, Rarity, RuneItemID, GearSlotID, RuneShape, TalentCardID, ArtifactID} from "SD_TypeConst";

/** The persistent data that store on the player. */
export type Inventory = DataType & {
  GearSlots: GearSlot[],
  OwnGears: Item[],
  RuneSlots: RuneSlots[],
  OwnRunes: Item[],
  OwnArtifact: NonEquipableItem[],
  OwnTalentCard: NonEquipableItem[],
};

export namespace Inventory
{

  export function CreateDefault(): Inventory
  {

    console.log("Creating default inventory data");

    return {
      Type: DataKey.Inventory,
      GearSlots: [{ID: GearSlotID.Weapon, Level: 0, EquippedGearID: GearItemID.Gear1}],
      OwnGears: [{ID: GearItemID.Gear1, Rarity: Rarity.Common}],
      RuneSlots: [{ID: "0", Shape: RuneShape.Hexagon, EquippedRuneID: RuneItemID.Rune1}],
      OwnRunes: [{ID: RuneItemID.Rune1, Rarity: Rarity.Common}],
      OwnArtifact: [{ID: ArtifactID.Artifact1, Rarity: Rarity.Common, Level: 0}],
      OwnTalentCard: [{ID: TalentCardID.TalentCard1, Rarity: Rarity.Common, Level: 0}],
    };
  }

  export function Validate(obj: unknown): Inventory
  {
    if(!IsInventoryData(obj))
    {
      console.warn(`InventoryData is faulty, creating default inventory data.`);
      return CreateDefault();
    }
    return obj;
  }

  export function IsInventoryData(obj: any): obj is Inventory
  {
    return obj
      && obj.hasOwnProperty(`Type`) // IMPROVE ME: separate check type function if needed
      && obj.hasOwnProperty(`GearSlots`)
      && obj.hasOwnProperty(`OwnGears`)
      && obj.hasOwnProperty(`RuneSlots`)
      && obj.hasOwnProperty(`OwnRunes`)
      && obj.hasOwnProperty(`OwnArtifact`)
      && obj.hasOwnProperty(`OwnTalentCard`);
  }
}