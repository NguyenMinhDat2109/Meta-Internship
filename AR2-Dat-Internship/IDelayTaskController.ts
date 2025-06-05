import {DelayTask, type IDelayTask} from 'IDelayTask_DelayTask';

interface IDelayTaskController
{
    delayTasks: IDelayTask[];
    AddTask(task: IDelayTask): void;
    RemoveTask(taskIndex: number): void;
    Process(dt: number): void;
}

export class DelayTaskController implements IDelayTaskController
{
    delayTasks: IDelayTask[];
    constructor()
    {
        this.delayTasks = [];
    }
    AddTask(task: IDelayTask): void
    {
        this.delayTasks.push(task);
    }
    RemoveTask(taskIndex: number): void
    {
        this.delayTasks.splice(taskIndex, 1);
    }
    Process(dt: number): void
    {
        for(let i = this.delayTasks.length - 1; i >= 0; i--)
        {
            if(this.delayTasks[i].ProcessAndCheckIfFinished(dt))
            {
                this.RemoveTask(i);
            }
        }
    }
}