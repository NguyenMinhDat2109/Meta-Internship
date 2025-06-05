import * as hz from 'horizon/core';
import {IDelayTask} from 'IDelayTask_DelayTask';
const BOUNCE_HEIGHT = 1.5;
const BOUNCE_DURATION_STRONG = 0.3;//Second
const BOUNCE_DURATION_LIGHT = 0.1;//Second
const BOUNCE_STEPS = 30;
//
// Bounce curve in dot graph form
//
//1.5                             .
//                             .     .
//1.3                       .           .
//                         .               .
//1.1                   .                     .
//                    .                         .
//0.9               .                               .
//                .                                   .
//0.7          .                                         .
//            .                                             .
//0.5       .                                                 .
//        .                                                     .
//0.3   .                                                         .
//    .                                                             .
//0.1.                                                                 .
//0.0____________________________________________________________________.
//    0.0       0.2       0.4       0.6       0.8        1.0


export class DelayTask_BounceTask implements IDelayTask
{
  timer: number = 0;
  isDone: boolean = false;
  promise: Promise<void>;

  context: hz.Component;
  bounceQueue: {start: hz.Vec3, end: hz.Vec3, height: number, duration: number;}[] = [];
  // elapsed = 0;
  currentStep = 0;
  currentSteps = 0;
  stepInterval = 0;
  accumulator = 0;
  currentBounce?: {start: hz.Vec3, end: hz.Vec3, height: number, duration: number;};
  finalCallback?: () => void;

  private resolve!: () => void;
  // private bounce: BounceToTarget;

  constructor(context: hz.Component, start: hz.Vec3, end: hz.Vec3, bounceTime: number)
  {
    this.context = context;
    // this.bounce = new BounceToTarget(context);
    this.promise = new Promise((resolve) =>
    {
      this.resolve = resolve;
    });

    // Start the bounce logic and resolve when complete
    this.StartBounce(start, end, bounceTime).then(() =>
    {
      this.isDone = true;
      this.resolve();
    });
  }

  async StartBounce(startPos: hz.Vec3, targetPos: hz.Vec3, bounceTime: number): Promise<void>
  {
    return new Promise((resolve) =>
    {
      const midPos = hz.Vec3.lerp(startPos, targetPos, 0.8);
      this.bounceQueue.push({start: startPos, end: midPos, height: BOUNCE_HEIGHT, duration: BOUNCE_DURATION_STRONG});

      if(bounceTime > 1)
      {
        this.bounceQueue.push({start: midPos, end: targetPos, height: BOUNCE_HEIGHT / 4, duration: BOUNCE_DURATION_LIGHT});
      }

      this.finalCallback = resolve; //resolve when bounce finishes
      this.ProcessBounce();
    });
  }

  ProcessAndCheckIfFinished(dt: number): boolean
  {
    if(this.isDone)
    {
      return false;
    }
    return this.UpdateBounceStep(dt);
  }

  //Begin the next Bounce phase from the queue
  private ProcessBounce()
  {
    this.currentBounce = this.bounceQueue.shift();
    if(this.currentBounce)
    {
      // this.elapsed = 0;
      this.currentStep = 0;
      this.currentSteps = BOUNCE_STEPS;
      this.stepInterval = this.currentBounce.duration / BOUNCE_STEPS;
      this.accumulator = 0;
    }
  }

  UpdateBounceStep(deltaTime: number): boolean
  {
    if(!this.currentBounce) return true;

    this.accumulator += deltaTime;

    while(this.accumulator >= this.stepInterval)
    {
      this.accumulator -= this.stepInterval;
      this.currentStep++;

      const t = this.currentStep / this.currentSteps;
      //Remap t into a curve
      //smoothstep formula: f(t) = 3t^2 - 2t^3 
      const easeT = t * t * (3 - 2 * t);
      const basePos = hz.Vec3.lerp(this.currentBounce.start, this.currentBounce.end, easeT); //Horizontal XZ movement
      const bounceY = Math.sin(Math.PI * easeT) * this.currentBounce.height;//Vertical Arc Shape 
      const newPos = new hz.Vec3(basePos.x, basePos.y + bounceY, basePos.z);//Add vertical bounce
      this.context.entity.position.set(newPos);

      if(this.currentStep >= this.currentSteps)
      {
        this.ProcessBounce();
        if(!this.currentBounce)
        {
          this.finalCallback?.();
          return true;//Stop bouncing
        }
      }
    }
    return false; // still bouncing
  }
}



