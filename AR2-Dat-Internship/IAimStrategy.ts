import {CharacterManager} from 'CharacterManager';
import {Enemy} from 'Enemy';
import {EntityManager} from 'EntityManager';
import {IAgent} from 'IAgent';
import {IEntity} from 'IEntity';

export interface IAimStrategy
{
  FindTarget(range: number): Array<IEntity>;
}

export class AimCharacterStrategy implements IAimStrategy
{
  private readonly characterManager: CharacterManager;
  private readonly agent: IAgent;
  private readonly targets: Array<IEntity> = [];
  constructor(characterManager: CharacterManager, agent: IAgent)
  {
    this.characterManager = characterManager;
    this.agent = agent;
  }

  FindTarget(range: number): Array<IEntity>
  {
    let position = this.agent.Position;
    let playerPosition = this.characterManager.Position;
    let distance = position.distance(playerPosition);
    if(distance > range)
    {
      return [];
    }
    this.targets[0] = this.characterManager.Character;
    return this.targets;
  }
}

export class AimNearestEnemyStrategy implements IAimStrategy
{
  private readonly characterManager: CharacterManager;
  private readonly entityManager: EntityManager;
  private targets: Array<IEntity> = [];
  constructor(characterManager: CharacterManager, entityManager: EntityManager)
  {
    this.characterManager = characterManager;
    this.entityManager = entityManager;
  }

  FindTarget(range: number): Array<IEntity>
  {
    const position = this.characterManager.Position;
    const enemies = this.entityManager.FindEntities<Enemy>(Enemy);
    let nearestEnemy: IEntity | undefined;
    let minDistance = Number.MAX_VALUE;

    for(let enemy of enemies)
    {
      let distance = position.distance(enemy.Position);
      if(distance < minDistance && distance <= range)
      {
        minDistance = distance;
        nearestEnemy = enemy;
      }
    }

    if(nearestEnemy)
    {
      this.targets[0] = nearestEnemy;
    }
    return this.targets;
  }
}


