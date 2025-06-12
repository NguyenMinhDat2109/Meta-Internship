import {EntityManager} from "EntityManager";
import {PlayerController} from "Player_Controller";
import * as hz from 'horizon/core';
import {IServiceLocator} from "ServiceLocator";
import {EntityAssetIDs} from "ConfigAssets";
import {IDamageReceiver} from "IDamageReceiver";
import {IHealReceiver} from "IHealReceiver";

export interface ICharacterManager
{
  CreateCharacter(): void;
  GetCharacterStats(stat: string): number;
  Position: hz.Vec3;
  Character: PlayerController;
  Player: Readonly<hz.Player>;
  DamageReceive: Readonly<IDamageReceiver>;
  HealReceive: Readonly<IHealReceiver>;

}

export class CharacterManager implements ICharacterManager
{
  private character!: PlayerController;
  private comp: hz.Component;
  private serviceLocator: IServiceLocator;
  private entityManager: EntityManager | undefined;

  constructor(comp: hz.Component, serviceLocator: IServiceLocator)
  {
    this.comp = comp;
    this.serviceLocator = serviceLocator;
  }

  public get Character()
  {
    return this.character;
  }
  public get Player()
  {    
    return this.character.GetPlayer();
  }
  public get DamageReceive()
  {
    return this.character.DamageReceiverObserver;
  }

  public get HealReceive()
  {
    return this.character.HealReceiverObserver;
  }

  public set Position(value: hz.Vec3)
  {
    this.character.Position = value;
  }

  public get Position()
  {
    return this.character.Position;
  }

  public CreateCharacter()
  {
    this.entityManager = this.serviceLocator.Resolve<EntityManager>(EntityManager);
    this.entityManager.CreateEntity(EntityAssetIDs.PlayerControllerID, (it) =>
    {
      this.character = it as PlayerController;
    });
  }

  GetCharacterStats(stat: string): number
  {
    return this.character.GetStats(stat);
  }
}
