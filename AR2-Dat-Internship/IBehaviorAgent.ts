import {IAgent} from 'IAgent';
import {IDamageReceiver} from 'IDamageReceiver';
import {IEnemyAnimationHandler} from 'IEnemyAnimationHandler';

export interface IBehaviorAgent extends IAgent
{
  /**
   * Is Knock backed
   */
  IsKnockBacked: Readonly<boolean>;

  IsEnable: Readonly<boolean>;

  IsInvicible: Readonly<boolean>;

  DamageReceiverObserver: IDamageReceiver;

}

export interface IEnemyBehaviorAgent extends IBehaviorAgent
{
  EnemyAnimationHandler: IEnemyAnimationHandler;
}
