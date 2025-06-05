
/**
 * Interface for an event subscription.
 * @remark Remember to disconnect the subscription when you're done with it.
 */
export interface IEventSubscription {
    Disconnect(): void;
}

/**
 * Generic implementation of an event subscription.
 */
class EventSubscription<T> implements IEventSubscription {
    private readonly _event: Event<T>;
    private readonly _listener: (data: T) => void;
    constructor(event: Event<T>, listener: (data: T) => void) {
        this._event = event;
        this._listener = listener;
    }

    public Invoke(data: T): void {
        this._listener(data);
    }

    public Disconnect(): void {
        this._event.Disconnect(this);
    }
}

/**
 * Event class for handling events.
 * Note: These event are only called locally.
 */
export class Event<T = void> {
    public readonly name: string;
    private readonly subscriptions: EventSubscription<T>[] = [];

    /**
     * Creates a new event.
     * @param name The name of the event. Used for debugging.
     */
    constructor(name: string) {
        this.name = name;
    }

    /**
     * Adds a listener to this event.
     * NB: Remember to disconnect the listener when you're done with it.
     * @param listener The listener to add.
     */
    public AddListener(listener: (data: T) => void): IEventSubscription {
        let subscription = new EventSubscription(this, listener);
        this.subscriptions.push(subscription);
        return subscription;
    }

    public Disconnect(subscription: IEventSubscription): void {
        const index = this.subscriptions.indexOf(subscription as EventSubscription<T>);
        if (index == -1) {
            console.warn(`Failed to remove listener with (${index}) to event "${this.name}". Listener not found.`)
            return;
        }
        this.subscriptions.splice(index, 1);
    }

    /**
     * Removes all listeners from this event.
     */
    public RemoveAllListeners(): void {
        // Setting this to an empty array is faster than calling .splice(0, this.listeners.length)
        this.subscriptions.length = 0;
    }

    /**
     * Invokes this event letting calling all the listeners.
     * @param data with the same type given to this event.
     */
    public Invoke(data: T): void {
        const tempSubs = this.subscriptions.slice();
            for (let i = 0; i < tempSubs.length; i++) {
                try {
                    tempSubs[i].Invoke(data);
                }
                catch (error) {
                    console.error("Error invoking event : " + error);
                    throw error;
                }
            }
        }
}
