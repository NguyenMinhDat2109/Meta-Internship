import {EnemyStateMachine, EState} from 'EnemyStateMachine';
import * as hz from 'horizon/core';

export class ClawnMaster extends hz.Component<typeof ClawnMaster> {
  static propsDefinition = {
    head : {type : hz.PropTypes.Entity}
  };
  stateMachine : EnemyStateMachine | undefined;
  HeadClawn : hz.Entity |undefined

  start() {
    this.connectLocalBroadcastEvent(hz.World.onUpdate, (data)=>this.Update(data.deltaTime))
    this.stateMachine = new EnemyStateMachine(this);
    this.HeadClawn = this.props.head;
    this.stateMachine.InitialState(EState.IDLE);
  }
  private Update(deltaTime : number)
  {
    this.stateMachine?.Update(deltaTime);
  }
}
hz.Component.register(ClawnMaster);