import {ANIMATION_CONFIG} from 'Config_Enemies';
import {EnemyID} from 'Enemy_Const';
import * as hz from 'horizon/core';
import {AssetBundleGizmo, AssetBundleInstanceReference} from 'horizon/unity_asset_bundles';
import {Delay} from 'Utilities';

export enum ENEMY_ANIMATION_STATE
{
  IDLE = 'Idle',
  MOVE = 'Move',
  ATTACK = 'Attack',
  DEATH = 'Death',
  HIT = 'Hit',
}

export interface IEnemyAnimationHandler
{
  SetupAnimationRoot(renderer: hz.Entity, enemyID: EnemyID): void;
  SetAnimationState(state: ENEMY_ANIMATION_STATE): Promise<void>;
  GetCurrentAnimationTime(): number;
}

export class EnemyAnimationHandler implements IEnemyAnimationHandler
{
  static propsDefinition = {};
  private currentState?: ENEMY_ANIMATION_STATE;
  private animationRoot?: AssetBundleInstanceReference;
  private comp?: hz.Component;
  private mapAnimationConfig?: Map<ENEMY_ANIMATION_STATE, number>;

  constructor(comp : hz.Component) {
    this.comp = comp
  }

  public SetupAnimationRoot(renderer: hz.Entity, enemyID: EnemyID): void
  {
    this.animationRoot = renderer.as(AssetBundleGizmo).getRoot();
    this.mapAnimationConfig = ANIMATION_CONFIG.get(enemyID);
  }
  
  public async SetAnimationState(state: ENEMY_ANIMATION_STATE): Promise<void>
  {
    if(this.currentState !== state && this.animationRoot && this.comp)
      {
      this.currentState = state;
      this.animationRoot.setAnimationParameterTrigger(state);
      await Delay(this.comp,this.GetCurrentAnimationTime());
    }
  }

  public GetCurrentAnimationTime(): number
  {
    if(!this.mapAnimationConfig || !this.currentState) return 0;
    return this.mapAnimationConfig.get(this.currentState) ?? 0;
  }
}
