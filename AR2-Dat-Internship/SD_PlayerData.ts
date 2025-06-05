import {DataKey, DataType} from "SD_TypeConst";

/** The persistent data that store on the player. */
export type PlayerData = DataType & {
  Level: number;
  Experience: number;
  Coins: number;
};

export namespace PlayerData 
{

  export function CreateDefault(): PlayerData
  {

    console.log("Creating default player data");

    return {
      Type: DataKey.PlayerData,
      Level: 1,
      Experience: 0,
      Coins: 25,
    };
  }

  export function Validate(obj: unknown): PlayerData
  {
    if(!IsPlayerData(obj))
    {
      console.warn(`PlayerData is faulty, creating default player data.`);
      return CreateDefault();
    }
    return obj;
  }

  export function IsPlayerData(obj: any): obj is PlayerData
  {
    return obj
      && obj.hasOwnProperty(`Type`) // IMPROVE ME: separate check type function if needed
      && obj.hasOwnProperty(`Level`)
      && obj.hasOwnProperty(`Experience`)
      && obj.hasOwnProperty(`Coins`);
  }
}