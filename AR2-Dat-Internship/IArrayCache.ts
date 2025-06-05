
export interface IArrayCache<T>
{
  /**
   * Gets specific items.
   */
  GetItems<U extends T>(type: new (...args: any[]) => U): Array<U>;

  /**
   * Gets all items.
   */
  GetAllItems(): Array<T>;

  /**
   * Add an item.
   */
  AddItem(item: T): void;

  /**
   * Remove an item.
   */
  RemoveItem(item: T): void;
}

export class ArrayCache<T extends object> implements IArrayCache<T> {

  private array: Array<T> = [];
  private typeMap = new Map<Function, T[]>();

  GetItems<U extends T>(type: new (...args: any[]) => U): Array<U>
  {
    return (this.typeMap.get(type) ?? []) as U[];
  }

  GetAllItems(): T[]
  {
    return this.array;
  }

  // Add item to the array
  AddItem(item: T): void
  {
    this.array.push(item);

    const ctor = item.constructor;
    if(!this.typeMap.has(ctor))
    {
      this.typeMap.set(ctor, []);
    }
    this.typeMap.get(ctor)!.push(item);
  }

  // Remove item from the array
  RemoveItem(item: T): void
  {
    const index = this.array.indexOf(item);
    if(index > -1)
    {
      this.array.splice(index, 1);
    }

    const ctor = item.constructor;
    const list = this.typeMap.get(ctor);
    if(list)
    {
      const i = list.indexOf(item);
      if(i > -1)
      {
        list.splice(i, 1);
      }
      if(list.length === 0)
      {
        this.typeMap.delete(ctor);
      }
    }
  }
}

// Example usage
/* class Animal {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

class Dog extends Animal {
  breed: string;
  constructor(name: string, breed: string) {
    super(name);
    this.breed = breed;
  }
}

const animalCache = new ArrayCache<Animal>();

animalCache.AddItem(new Animal("Elephant"));
animalCache.AddItem(new Dog("Bulldog", "French Bulldog"));
animalCache.AddItem(new Dog("Cỏgy", "French Cỏgy"));
animalCache.AddItem(new Animal("Lion"));

const dogs = animalCache.GetItems(Dog);
console.log(dogs); */

