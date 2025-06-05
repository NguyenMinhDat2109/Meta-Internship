
export interface IObserverManager<T>
{
  AddObserver(observer: T): number;
  RemoveObserver(id: number): boolean;
  DispatchEvent(dispatcher: (observer: T) => void): void;
}

export class ObserverManager<T> implements IObserverManager<T>
{
  private observers: Map<number, T>;
  private counter: number;

  constructor()
  {
    this.observers = new Map();
    this.counter = 0;
  }

  AddObserver(observer: T): number
  {
    const id = this.counter++;
    this.observers.set(id, observer);
    return id;
  }

  RemoveObserver(id: number): boolean
  {
    return this.observers.delete(id);
  }

  DispatchEvent(dispatcher: (observer: T) => void): void
  {
    this.observers.forEach(observer => dispatcher(observer));
  }
}


//EXAMPLE usage
/* class Entity {
  private readonly observerManager: ObserverManager<EntityObserver> = new ObserverManager<EntityObserver>();

  addObserver(observer: EntityObserver): number {
    return this.observerManager.AddObserver(observer);
  }

  removeObserver(id: number): boolean {
    return this.observerManager.RemoveObserver(id);
  }

  begin(): void {
    this.observerManager.DispatchEvent(observer => {
      if (observer.OnBegin) observer.OnBegin();
    });
  }

  end(): void {
    this.observerManager.DispatchEvent(observer => {
      if (observer.OnEnd) observer.OnEnd();
    });
  }
}
// Usage example
const entity = new Entity();

entity.addObserver({
  OnBegin: () => {
    console.log('=== OnBegin');
  },
  OnEnd: () => {
    console.log('=== OnEnd');
  }
});

// Trigger begin event
entity.begin();

// Trigger end event
entity.end(); */