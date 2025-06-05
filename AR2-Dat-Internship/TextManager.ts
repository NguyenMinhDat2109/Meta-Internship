import {DamageNumber} from 'DamageNumber';
import {EntityManager} from 'EntityManager';
import * as hz from 'horizon/core';

//#region SERVICE
export interface ITextManager
{
  SpawnDamageText(parent: hz.Entity, offset: hz.Vec3, value: number, isCritical: boolean, element: string): void;
  SpawnAllyDamageText(parent: hz.Entity, offset: hz.Vec3, value: number): void;
}

//#endregion

const DAMAGE_NUMBER_ASSET_ID = '1549738619027614';
const DAMAGE_NUMBER_DEFAULT_REQUEST = 20;
const ALLY_DAMAGE_NUMBER_COLOR = hz.Color.red; // white?
export class TextManager implements ITextManager
{
  private entityManager: EntityManager;
  constructor(entityManager: EntityManager)
  {
    this.entityManager = entityManager;
    this.Initialize();
  }

  private async Initialize(): Promise<void>
  {
    this.entityManager.AcquireEntity(DAMAGE_NUMBER_ASSET_ID, DAMAGE_NUMBER_DEFAULT_REQUEST);
  }

  public SpawnAllyDamageText(parent: hz.Entity, offset: hz.Vec3, value: number): void
  {
    this.entityManager.CreateEntity(DAMAGE_NUMBER_ASSET_ID, (it) =>
    {
      let damageNumber = it as DamageNumber;
      damageNumber.DisplayDamageText(offset, value, ALLY_DAMAGE_NUMBER_COLOR, parent);
    });
  }

  public SpawnDamageText(parent: hz.Entity, offset: hz.Vec3, value: number, isCritical: boolean, element: string): void
  {
    this.entityManager.CreateEntity(DAMAGE_NUMBER_ASSET_ID, (it) =>
    {
      let damageNumber = it as DamageNumber;
      // FOR NOW, actual color should be based on element
      // isCritial is a boolean, so it should be a different text style.
      // let color = isCritical ? hz.Color.red : hz.Color.white;
      let color = hz.Color.white;
      damageNumber.DisplayDamageText(offset, value, color, parent);
    });
  }

}
