import {BulletAcquireManager, IBulletAcquireManager} from "BulletAcquireManager";
import {ConfigManager, IConfigManager} from "ConfigManager";
import {BulletID, MAP_ID, MaxBulletsNeed, WAVE_ID} from "Enemy_Const";
import {WaveConfig} from "Enemy_Data";
import {Component} from "horizon/core";
import {ServiceLocator} from "ServiceLocator";

export class WaveConfigManager
{
  private comp: Component;
  public config: Map<WAVE_ID, WaveConfig> = new Map<WAVE_ID, WaveConfig>(); // config of all waves
  private configManager: IConfigManager;
  private bulletAcquireManager: IBulletAcquireManager;

  constructor(comp: Component)
  {
    this.comp = comp;
    this.configManager = ServiceLocator.Instance.Resolve<ConfigManager>(ConfigManager);
    this.bulletAcquireManager = ServiceLocator.Instance.Resolve<BulletAcquireManager>(BulletAcquireManager);
  }

  public GetConfig(mapID: MAP_ID): Map<WAVE_ID, WaveConfig>
  {
    this.config = this.configManager.CreateWavesConfig(mapID);
    return this.config;
  }

  public GetWaveConfig(waveID: WAVE_ID): WaveConfig
  {
    let waveConfig = this.config.get(waveID);
    if(!waveConfig)
    {
      console.error(`Wave ${waveID.toString} do not have config`);
      throw new Error(`Wave ${waveID} do not have config`);
    }
    return waveConfig;
  }

  public GetWaveBulletsNeed(waveID: WAVE_ID): Map<BulletID, number>
  {

    // IMPROVE ME: Make a map to store wave bullets need when have more bullets type
    let waveBulletNeedMap: Map<BulletID, number> = new Map<BulletID, number>();
    this.config.get(waveID)?.EnemiesMapSpawm.forEach((value) =>
    {
      let bulletsNeed = this.bulletAcquireManager.GetBulletAcquire(value.EnemyID);
      if(bulletsNeed == undefined)
      {
        return;
      }
      let quantity = waveBulletNeedMap.get(bulletsNeed.BulletID);
      if(quantity == undefined)
      {
        waveBulletNeedMap.set(bulletsNeed.BulletID, bulletsNeed.Quantity);
      } else
      {
        quantity += bulletsNeed.Quantity;
        waveBulletNeedMap.set(bulletsNeed.BulletID, quantity);
      }
    });
    return waveBulletNeedMap;
  }

  public CalculateMaxBulletsNeed(fromWaveIndex: number): Map<BulletID, MaxBulletsNeed>
  {
    let maxBulletsNeed: Map<BulletID, MaxBulletsNeed> = new Map<BulletID, MaxBulletsNeed>();

    for(let i = fromWaveIndex; i < this.config.size; i++)
    {
      const waveBulletNeed = this.GetWaveBulletsNeed(i);
      waveBulletNeed.forEach((bulletsNeed, bulletID) =>
      {
        let quantity = maxBulletsNeed.get(bulletID);
        if(quantity == undefined)
        {
          maxBulletsNeed.set(bulletID, {quantity: bulletsNeed, wave: i});
        } else
        {
          maxBulletsNeed.set(bulletID, {quantity: Math.max(quantity.quantity, bulletsNeed), wave: i});
        }
      })

    }
    return maxBulletsNeed;
  }
}
