import * as hz from 'horizon/core';
import {IObserverManager, ObserverManager} from 'IObserverManager';

export class HealReceiverObserver
{
    OnHeal?: (amount: number, isHealByHeart: boolean) => void;
}

export class HealObserverController implements IHealReceiverObservable, IObserverManager<HealReceiverObserver>
{
    private readonly observerManager: IObserverManager<HealReceiverObserver> = new ObserverManager<HealReceiverObserver>();
    private HealReceive: IHealReceiver;
    get Position()
    {
        return this.HealReceive.Position;
    }

    constructor(healReceive: IHealReceiver)
    {
        this.HealReceive = healReceive;
    }

    Heal(isHealByHeart: boolean, amount: number): void
    {
        this.HealReceive.Heal(isHealByHeart, amount);
        this.DispatchEvent(observer => {observer.OnHeal?.(amount,isHealByHeart)})
    }

    AddObserver(observer: HealReceiverObserver): number
    {
        return this.observerManager.AddObserver(observer);
    }

    RemoveObserver(id: number): boolean
    {
        return this.observerManager.RemoveObserver(id);
    }

    DispatchEvent(dispatcher: (observer: HealReceiverObserver) => void): void
    {
        this.observerManager.DispatchEvent(dispatcher);
    }
}

export interface IHealReceiverObservable extends IHealReceiver
{
    AddObserver(observer: HealReceiverObserver): number;
    RemoveObserver(id: number): boolean;
    DispatchEvent(dispatcher: (observer: HealReceiverObserver) => void): void;
}

export interface IHealReceiver
{
    /**
     * Position of the damage receiver.
     */
    Position: hz.Vec3;

    Heal(isHealByHeart: boolean, amount: number): void;
   
}
