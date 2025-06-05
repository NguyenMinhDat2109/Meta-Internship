import * as hz from 'horizon/core';
import {IObserverManager, ObserverManager} from 'IObserverManager';
import {IStatsManager, Stats} from 'IStatsManager';
import {Assert, RandomBoolean} from 'Utilities';

export class DamageReceiverObserver
{
    OnDamageTaken?: (amount: number, isCritical: boolean) => void;
    OnDodge?: () => void;
}

export class DamageObserverController implements IDamageReceiverObservable, IObserverManager<DamageReceiverObserver>
{
    private readonly observerManager: IObserverManager<DamageReceiverObserver> = new ObserverManager<DamageReceiverObserver>();
    private damageReceive: IDamageReceiver;
    private bodyStatsManager: IStatsManager | undefined;
    private isAlly: boolean = false;
    get Position()
    {
        return this.damageReceive.Position;
    }

    constructor(damageReceive: IDamageReceiver)
    {
        this.damageReceive = damageReceive;
    }

    public CanTakeDamage(): boolean
    {
        Assert.IsNotNull(this.bodyStatsManager, `Body Stats was null`);
        let dodgeRate = this.bodyStatsManager!.GetStats(Stats.DodgeRate);
        let isDodge = RandomBoolean(dodgeRate);
        if(isDodge)
        {
            this.DispatchEvent((observer) => observer.OnDodge?.());
        }
        return this.damageReceive.CanTakeDamage() && !isDodge;
    }

    public TakeDamage(amount: number, isCritical: boolean): void
    {
        Assert.IsNotNull(this.bodyStatsManager, `Body Stats was null`);
        amount = amount - this.bodyStatsManager!.GetStats(Stats.Defense);
        this.damageReceive.TakeDamage(amount, isCritical);
        this.DispatchEvent(observer => {observer.OnDamageTaken?.(amount, isCritical)})
    }

    public AddEffect(id: string, duration: number, amount: number): void
    {
        this.damageReceive.AddEffect(id, duration, amount);
    }

    public AddObserver(observer: DamageReceiverObserver): number
    {
        return this.observerManager.AddObserver(observer);
    }

    public RemoveObserver(id: number): boolean
    {
        return this.observerManager.RemoveObserver(id);
    }

    public DispatchEvent(dispatcher: (observer: DamageReceiverObserver) => void): void
    {
        this.observerManager.DispatchEvent(dispatcher);
    }

    public SetConfig(bodyStatsManager: IStatsManager, isAlly: boolean): void
    {
        this.bodyStatsManager = bodyStatsManager;
        this.isAlly = isAlly;
    }
}

export interface IDamageReceiverObservable extends IDamageReceiver
{
    AddObserver(observer: DamageReceiverObserver): number;
    RemoveObserver(id: number): boolean;
    DispatchEvent(dispatcher: (observer: DamageReceiverObserver) => void): void;
}

export interface IDamageReceiver
{
    /**
     * Position of the damage receiver.
     */
    Position: hz.Vec3;

    CanTakeDamage(): boolean;

    TakeDamage(amount: number, isCritical: boolean): void;

    AddEffect(id: string, duration: number, amount: number): void;
}
