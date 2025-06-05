export interface IDelayTask
{
    timer: number;
    promise: Promise<void>;
    // resolve!: () => void;
    isDone: boolean;
    ProcessAndCheckIfFinished(dt: number): boolean;
}
export class DelayTask implements IDelayTask
{
    timer: number;
    promise: Promise<void>;
    isDone: boolean;
    private resolve!: () => void;

    constructor(time: number)
    {
        this.timer = time;
        this.isDone = false;
        this.promise = new Promise<void>((resolve) =>
        {
            this.resolve = resolve;
        });
    }

    ProcessAndCheckIfFinished(dt: number): boolean
    {
        if(this.isDone) return false; // Don't process if already finished

        this.timer -= dt;
        if(this.timer <= 0)
        {
            this.isDone = true;
            this.resolve();
            return true;
        }
        return false;
    }

}
