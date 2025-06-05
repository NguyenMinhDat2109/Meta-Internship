import {Asset, Player} from "horizon/core";
import {Assert} from "Utilities";

export enum Direction
{
  North = "N",
  NorthEast = "NE",
  East = "E",
  SouthEast = "SE",
  South = "S",
  SouthWest = "SW",
  West = "W",
  NorthWest = "NW",
}

type TimerListener = {
  time: number;
  callback: () => void;
};

export class CharacterAnimate
{
  private readonly durationAnimate: number;
  private readonly assetAnimate: Asset;
  private readonly player: Player;

  private playRate: number;
  private isLoop: boolean;
  private onComplete?: () => void;
  private elapsedTime: number = 0;
  private timerListeners: TimerListener[] = [];
  private isRunningAnimate: boolean = false;

  constructor(player: Player, assetAnimate: Asset, durationAnimate: number)
  {
    this.isLoop = false;
    this.playRate = 1;
    this.durationAnimate = durationAnimate;
    this.assetAnimate = assetAnimate;
    this.player = player;
  }

  private AnimationProcess(deltaTime: number)
  {
    this.elapsedTime += deltaTime;
    if(this.elapsedTime >= (this.durationAnimate / this.playRate))
    {
      this.elapsedTime = 0;
      if(this.onComplete != undefined)
      {
        this.onComplete?.();
        this.onComplete = undefined;
      }
    }
  }

  private TimerListenerProcess(deltaTime: number)
  {
    // Trigger timer listeners
    this.timerListeners = this.timerListeners.filter(listener =>
    {
      if(this.elapsedTime >= (listener.time / this.playRate))
      {
        listener.callback();
        return false; // Remove after calling
      }
      return true;
    });
  }

  SetPlayRateAnimate(playRate: number)
  {
    Assert.IsTrue(playRate > 0, 'Play rate not valid');
    this.playRate = playRate;
  }

  SetLoop(isLoop: boolean)
  {
    this.isLoop = isLoop;
  }

  PlayAnimation(callback?: () => void)
  {
    this.onComplete = callback;
    this.elapsedTime = 0;
    if(this.isRunningAnimate)
    {
      return;
    }
    this.isRunningAnimate = true;
    this.player.playAvatarAnimation(this.assetAnimate, {
      looping: this.isLoop,
      playRate: this.playRate,
    })
  }

  ProcessUpdate(deltaTime: number)
  {
    this.AnimationProcess(deltaTime);
    this.TimerListenerProcess(deltaTime);
  }

  SetTimerCallback(trackTime: number, callback: () => void): void
  {
    this.timerListeners.push({time: trackTime, callback});
  }

  Clear()
  {
    this.elapsedTime = 0;
    this.onComplete = undefined;
    this.isRunningAnimate = false;
    this.timerListeners = [];
  }
}

export enum CharacterAnimationState
{
  Shoot = 'shoot',
}

export class CharacterAnimationRenderer implements IAnimationRenderer
{
  private readonly animateIdRecord: Record<string, CharacterAnimationState> = {
    [CharacterAnimationState.Shoot]: CharacterAnimationState.Shoot,
  }
  private readonly animateRecord: Record<CharacterAnimationState, CharacterAnimate>;
  private readonly player: Player
  private currentAnimate: CharacterAnimate | undefined;
  constructor(animateRecord: Record<CharacterAnimationState, CharacterAnimate>, player: Player)
  {
    this.animateRecord = animateRecord;
    this.player = player;
  }

  SetRateAnimation(id: string, rate: number): void
  {
    let animState = this.animateIdRecord[id];
    let animate = this.animateRecord[animState];
    animate.SetPlayRateAnimate(rate);
  }

  PlayAnimation(id: string, callback?: () => void): boolean
  {
    let animState = this.animateIdRecord[id];
    this.currentAnimate = this.animateRecord[animState];
    this.currentAnimate.PlayAnimation(callback);
    return true;
  }

  SetTimerCallback(id: string, timer: number, callback: () => void): void
  {
    let animState = this.animateIdRecord[id];
    let animate = this.animateRecord[animState];
    animate.SetTimerCallback(timer, callback);
  }

  ClearAnimation(id: string): boolean
  {
    //Player cannot stop avatar specific. Just stop the avatar
    this.player.stopAvatarAnimation();

    let animState = this.animateIdRecord[id];
    let animate = this.animateRecord[animState];
    animate.Clear();
    return true;
  }

  ProcessUpdate(deltaTime: number): void
  {
    this.currentAnimate?.ProcessUpdate(deltaTime);
  }
}

export interface IAnimationRenderer extends IAnimationUpdater
{
  PlayAnimation(id: string, callback?: () => void): boolean;

  SetRateAnimation(id: string, rate: number): void;

  SetTimerCallback(id: string, timer: number, callback: () => void): void;

  ClearAnimation(id: string): boolean;
}

export interface IAnimationUpdater
{
  ProcessUpdate(deltaTIme: number): void;
}


export class AnimationRendererExtensions
{
  public static PlayAnimation(renderer: IAnimationRenderer, id: string, callback?: () => void): boolean
  {
    return renderer.PlayAnimation(id, callback);
  }

  public static async PlayAnimationAsync(renderer: IAnimationRenderer, id: string): Promise<boolean>
  {
    return new Promise<boolean>((resolve) =>
    {
      const result = renderer.PlayAnimation(id, () =>
      {
        resolve(true);
      });

      if(!result)
      {
        resolve(false);
      }
    })
  }
}
