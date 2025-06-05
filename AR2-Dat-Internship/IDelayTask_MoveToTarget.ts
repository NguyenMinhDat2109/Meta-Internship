import * as hz from 'horizon/core';
import { IDelayTask } from 'IDelayTask_DelayTask';


const MOVE_SPEED = 20;
const ITEM_DESTINATION_RADIUS = 0.2;


export class DelayTask_MoveToTargetTask implements IDelayTask {
  private context: hz.Component;
  private target?: hz.Entity | hz.Player;


  timer: number = 0;
  promise: Promise<void>;
  isDone: boolean = false;


  private resolve!: () => void;


  constructor(context: hz.Component, target: hz.Entity | hz.Player) {
    this.context = context;
    this.target = target;


    this.promise = new Promise<void>((res) => (this.resolve = res));
  }


  ProcessAndCheckIfFinished(deltaTime: number): boolean {
    if (this.isDone || !this.target) return true;


    const currentPos = this.context.entity.position.get();
    const targetPos = this.target.position.get();


    const distance = currentPos.distance(targetPos);
    if (distance <= ITEM_DESTINATION_RADIUS) {
      this.isDone = true;
      this.resolve();
      return true;
    }


    const direction = targetPos.sub(currentPos).normalize();
    const newPos = currentPos.add(direction.mul(deltaTime * MOVE_SPEED));
    this.context.entity.position.set(newPos);


    return false; // still moving
  }
}

