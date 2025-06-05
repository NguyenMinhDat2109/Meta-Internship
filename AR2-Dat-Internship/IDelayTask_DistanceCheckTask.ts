import * as hz from 'horizon/core';
import { IDelayTask } from 'IDelayTask_DelayTask';
const AUTO_LOOT_RADIUS = 1.5;


export class DelayTask_DistanceCheckTask implements IDelayTask {
  isDone = false;
  promise: Promise<void>;
  private resolve!: () => void;
  timer = 0; 

  constructor(
    private source: hz.Entity,
    private target: hz.Entity | hz.Player,
    private onClose: () => void
  ) {
    this.promise = new Promise<void>((resolve) => {
      this.resolve = () => {
        this.isDone = true;
        resolve();
        this.onClose(); 
      };
    });
  }

  ProcessAndCheckIfFinished(dt: number): boolean {
    const distance = this.target.position.get().distance(this.source.position.get());
    if (distance < AUTO_LOOT_RADIUS) {
      this.resolve();
      return true;
    }
    return false;
  }
}
