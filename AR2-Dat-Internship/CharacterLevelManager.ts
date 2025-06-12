import { LevelObserver } from "GameManager";
import { Component } from "horizon/core";
import { IObserverManager, ObserverManager } from "IObserverManager";

const MAX_LEVEL = 10;
const LEVELS_EXPERIENCE_REQUIRED = new Map<number, number>([
  [1, 10],
  [2, 20],
  [3, 30],
  [4, 40],
  [5, 50],
  [6, 60],
  [7, 70],
  [8, 80],
  [9, 90],
]);

export class CharacterLevelObserver {
  public OnCharacterLevelUp?: (level: number, expPercent: number) => void;

  public OnCollectExp?: (expPercent: number) => void;

  public OnCompletedLevelUpProcess?: () => void;
}

export interface ICharacterLevelManager extends IObserverManager<CharacterLevelObserver> {
  AddExperience(experience: number): void;
}

export class CharacterLevelManager extends ObserverManager<CharacterLevelObserver> implements ICharacterLevelManager {
  private experienceRequiredToNextLevel: number = 0;
  public currentLevel: number = 1;
  public currentExperience: number = 0;

  public AddExperience(experience: number) {
    this.currentExperience += experience;
    console.log("Current wave EXP: " + experience, "Current level: " + this.currentLevel, "Current experience: " + this.currentExperience + "/" + this.experienceRequiredToNextLevel);
    this.CheckLevelUp();
  }

  private CheckLevelUp() {
    if (this.currentLevel >= MAX_LEVEL) {
      return;
    }

    this.experienceRequiredToNextLevel = LEVELS_EXPERIENCE_REQUIRED.get(this.currentLevel) || 0;
    if (this.currentExperience >= this.experienceRequiredToNextLevel) {
      this.LevelUp();
    }
    else {
      this.DispatchEvent((observer) => observer.OnCollectExp?.(this.currentExperience / this.experienceRequiredToNextLevel * 100));
      this.DispatchEvent((observer) => observer.OnCompletedLevelUpProcess?.());
    }
  }

  private LevelUp() {
    this.currentLevel++;
    this.currentExperience -= this.experienceRequiredToNextLevel;
    this.experienceRequiredToNextLevel = LEVELS_EXPERIENCE_REQUIRED.get(this.currentLevel) || 0;
    console.log(`Level up! New level: ${this.currentLevel}, Experience: ${this.currentExperience}/${this.experienceRequiredToNextLevel}`);
    this.DispatchEvent((observer) => observer.OnCharacterLevelUp?.(this.currentLevel, this.currentExperience / this.experienceRequiredToNextLevel * 100));
  }
  public ResetText() {
    this.currentLevel = 1;
    this.currentExperience = 0;
    this.experienceRequiredToNextLevel = 0;
  }
}