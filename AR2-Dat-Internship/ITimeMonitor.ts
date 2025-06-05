
export interface ITimeMonitor
{
  DeltaTime: number;
}

export class CustomTimeMonitor implements ITimeMonitor
{
  DeltaTime: number = 0;
}

