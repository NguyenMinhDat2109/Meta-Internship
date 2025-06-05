/**
 * Use for queueing tasks in a process
 * This class is designed to manage a queue of asynchronous tasks.
 */
export class ProcessQueue
{
  private taskQueue: (() => Promise<void>)[] = []; // Queue stores functions
  private isProcessing = false; // Track if queue is running

  private async ProcessQueue()
  {
    if(this.isProcessing) return; // Prevent multiple loops
    this.isProcessing = true;

    while(this.taskQueue.length > 0)
    {
      const task = this.taskQueue.shift(); // Get first task
      if(task)
      {
        await task().catch(err => console.error("Task failed:", err));
      }
    }

    this.isProcessing = false; // Mark queue as idle
  }

  public async QueueEntityAcquisition(assetID: string, amount: number, callback: () => Promise<void>)
  {
    this.taskQueue.push(() => callback()); // Add to queue
    if(!this.isProcessing)
    {
      this.ProcessQueue(); // Start processing if idle
    }
  }
}
