import * as hz from 'horizon/core';

class ObjectPoolData
{
  private asset: hz.Asset;
  private pools: Array<hz.Entity>;
  private defaultMaxSize: number;
  private constructor(asset: hz.Asset, defaultMaxSize: number)
  {
    this.asset = asset;
    this.pools = new Array<hz.Entity>();
    this.defaultMaxSize = defaultMaxSize;
  }
  
  static async build(asset: hz.Asset, defaultMaxSize: number): Promise<ObjectPoolData>
  {
    console.log(`POOL: Build ${asset}`);
    let assetPool = new ObjectPoolData(asset, defaultMaxSize)
    // Actually no need to instantiate in this.
    // for(let i = 0;i < defaultMaxSize;i++)
    // {
    //   assetPool.InstantiateAsset();
    // }
    return assetPool;
  }

  private async InstantiateAsset(): Promise<void>
  {
    let ins = ObjectPoolManagerSingleton.instance;
    await ins.world.spawnAsset(this.asset, ins.entity.position.get(), ins.entity.rotation.get()).then((entities) =>
    {
      this.pools.push(entities[0]);
    }, (e) =>
    {
      console.error(`POOL: Can not spawn instantiate asset = ${this.asset.id}`);
    });
  }

  public async Acquire(): Promise<hz.Entity>
  {
    let entity = this.pools.pop();
    if (entity == undefined) {
      await this.InstantiateAsset();
      return this.Acquire();
    }  
    return entity;
  }

  public Release(obj: hz.Entity)
  {
    this.pools.push(obj);
    let pos = ObjectPoolManagerSingleton.instance.entity.position.get();
    obj.position.set(pos);
    obj.children.get().forEach((child) => child.position.set(pos));
  }
}

type Props = {}

export class ObjectPoolManagerSingleton extends hz.Component<Props>
{
  static propsDefinition = {};
  static instance: ObjectPoolManagerSingleton;
  poolContainer = new Map<hz.Asset, ObjectPoolData>();
  preStart()
  {
    if(ObjectPoolManagerSingleton.instance)
    {
      //cant delete so make sure only 1 obj hold this script
      return;
    }
    ObjectPoolManagerSingleton.instance = this;
  }

  start()
  {
    ObjectPoolManagerSingleton.instance = this;
  }

  async RegisterAsset(asset: hz.Asset, poolDefaultSize: number = 1)
  {
    if(this.poolContainer.get(asset) == undefined)
    {
      // console.log(`POOL SINGLETON: Register asset id = ${asset.id}`)
      return this.poolContainer.set(asset, await ObjectPoolData.build(asset, poolDefaultSize));
    }
  }

  async Acquire(asset: hz.Asset): Promise<hz.Entity>
  {
    let pool = this.poolContainer.get(asset);
    if(pool != undefined)
    {
      // console.log("Got pool")
      return pool.Acquire();
    }
    else
    {
      // console.error("Try to acquire asset that have not register yet. Pls run register code before call acquire")
      await this.RegisterAsset(asset, 1);
      return this.Acquire(asset);
    }
  }

  Release(asset: hz.Asset, obj: hz.Entity)
  {
    let pool = this.poolContainer.get(asset);
    if(pool != undefined)
    {
      pool.Release(obj);
    }
  }
}
hz.Component.register(ObjectPoolManagerSingleton);
