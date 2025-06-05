// Enum for the status of nodes in the Behavior Tree
export enum TaskStatus
{
    SUCCESS,
    FAILURE,
    RUNNING,
}


// Behavior Tree Manager that controls the Behavior Tree
export class BehaviorTreeBuilder
{
    private root: Node;

    constructor(root: Node)
    {
        this.root = root;
    }

    Tick(): void
    {
        this.root.OnUpdate();
    }
}

export interface ITask
{
    OnUpdate(): TaskStatus;
}

export interface ITaskParent extends ITask
{
    AddChild(child: ITask): void;
}

// Base class for nodes in the Behavior Tree
abstract class Node implements ITask
{

    abstract OnUpdate(): TaskStatus;
}

// Action Node that performs a specific action
export class ActionNode extends Node
{
    private action: () => boolean;

    constructor(action: () => boolean)
    {
        super();
        this.action = action;
    }

    OnUpdate(): TaskStatus
    {
        const result = this.action();
        return result ? TaskStatus.SUCCESS : TaskStatus.FAILURE;
    }
}

// The ActionGeneric class
export class ActionGeneric implements ITask
{
    private updateLogic: () => TaskStatus;

    constructor(
        initLogic: () => void,
        updateLogic: () => TaskStatus
    )
    {
        this.updateLogic = updateLogic;
        initLogic();
    }


    OnUpdate(): TaskStatus
    {
        const status = this.updateLogic();
        return status;
    }
}

// Composite nodes
abstract class TaskParent implements ITaskParent
{
    protected children: ITask[] = [];

    AddChild(child: ITask): void
    {
        this.children.push(child);
    }

    abstract OnUpdate(): TaskStatus;
}

// Condition Node that checks a specific condition
export class ConditionNode extends Node
{
    private condition: () => boolean;

    constructor(condition: () => boolean)
    {
        super();
        this.condition = condition;
    }

    OnUpdate(): TaskStatus
    {
        return this.condition() ? TaskStatus.SUCCESS : TaskStatus.FAILURE;
    }
}

/**
 * Composite Node - Selector: runs child nodes and returns SUCCESS when one node succeeds
 * When you want a fallback plan
 * Example: Try melee attack → If not, try ranged attack → If not, run away
 */
export class SelectorNode extends TaskParent
{

    constructor(children: Node[])
    {
        super();
        this.children = children;
    }

    OnUpdate(): TaskStatus
    {
        for(const child of this.children)
        {
            const status = child.OnUpdate();
            if(status === TaskStatus.SUCCESS)
            {
                return TaskStatus.SUCCESS;
            }
        }
        return TaskStatus.FAILURE;
    }
}

/**
 * Composite Node - SelectorWithRunning: runs child nodes and returns SUCCESS/RUNNING when one node succeeds/running
 * When you want a fallback plan
 * Example: Try melee attack → If not, try ranged attack → If not, run away
 */
export class SelectorWithRunningNode extends TaskParent
{

    constructor(children: Node[])
    {
        super();
        this.children = children;
    }

    OnUpdate(): TaskStatus
    {
        for(const child of this.children)
        {
            const status = child.OnUpdate();
            if(status === TaskStatus.SUCCESS || status === TaskStatus.RUNNING)
            {
                return status;
            }
        }
        return TaskStatus.FAILURE;
    }
}

/**
 * Composite Node - Sequence: runs child nodes and returns FAILURE if one node fails
 * When tasks must succeed one after another
 * Example: Check distance → Aim → Shoot
 */
export class SequenceNode extends TaskParent
{

    constructor(children: Node[])
    {
        super();
        this.children = children;
    }

    OnUpdate(): TaskStatus
    {
        for(const child of this.children)
        {
            const status = child.OnUpdate();
            if(status === TaskStatus.FAILURE)
            {
                return TaskStatus.FAILURE;
            }
        }
        return TaskStatus.SUCCESS;
    }
}

/**
 * Composite Node - ProgressiveSequence:
 * Runs one child node at a time, in order, and only advances to the next when the current returns SUCCESS.
 * If the current node returns FAILURE or RUNNING, it stays on the same node.
 * Loops back to the first child after the last one succeeds.
 *
 * Useful for step-by-step sequences that shouldn't run all at once.
 * Example: Shoot → Play animation → Cooldown → Repeat
 */
export class ProgressiveSequenceNode extends TaskParent
{
    private currentIndex: number = 0;

    constructor(children: Node[])
    {
        super();
        this.children = children;
    }

    OnUpdate(): TaskStatus
    {
        if(this.children.length === 0)
        {
            return TaskStatus.FAILURE;
        }

        const currentChild = this.children[this.currentIndex];

        const status = currentChild.OnUpdate();

        if(status === TaskStatus.SUCCESS)
        {
            // Move to the next child
            this.currentIndex = (this.currentIndex + 1) % this.children.length;
        }

        return status;
    }
}


/**
 * Decorator Node - Inverter: inverts the result of the child node.
 * Use case: When you want to negate a condition.
 * Example: "If NOT in attack range, then chase."
 */
export class InverterDecorator extends Node
{
    constructor(private child: ITask)
    {
        super();
    }

    OnUpdate(): TaskStatus
    {
        const result = this.child.OnUpdate();
        if(result === TaskStatus.SUCCESS) return TaskStatus.FAILURE;
        if(result === TaskStatus.FAILURE) return TaskStatus.SUCCESS;
        return TaskStatus.RUNNING;
    }
}

/**
 * Decorator Node - Repeater: repeats the child node a specified number of times
 * Use case: Looping behaviors.
 * Example: Keep patrolling until player is spotted.
 */
export class RepeaterDecorator extends Node
{
    private count = 0;

    constructor(private child: ITask, private repeatTimes: number = Infinity)
    {
        super();
    }

    OnUpdate(): TaskStatus
    {
        if(this.count < this.repeatTimes)
        {
            const result = this.child.OnUpdate();
            if(result !== TaskStatus.RUNNING)
            {
                this.count++;
            }
            return TaskStatus.RUNNING;
        }
        this.count = 0;
        return TaskStatus.SUCCESS;
    }
}

/**
 * Decorator Node - Cooldown: adds a cooldown period to the child node
 * Use case: Limit frequency of behaviors.
 * Example: Enemy shoots every 2 seconds.
 */
class CooldownDecorator extends Node
{
    private lastTime = 0;

    constructor(private child: ITask, private cooldownTimeMs: number)
    {
        super();
    }

    OnUpdate(): TaskStatus
    {
        const now = Date.now();
        if(now - this.lastTime >= this.cooldownTimeMs)
        {
            const result = this.child.OnUpdate();
            if(result === TaskStatus.SUCCESS || result === TaskStatus.FAILURE)
            {
                this.lastTime = now;
            }
            return result;
        }
        return TaskStatus.FAILURE;
    }
}

/**
 * Decorator Node - UntilSuccess: keeps running the child node until it succeeds
 * Use case: Retry behavior until it works.
 * Example: Try opening a door until it’s unlocked.
 */
class UntilSuccessDecorator extends Node
{
    constructor(private child: ITask)
    {
        super();
    }

    OnUpdate(): TaskStatus
    {
        const result = this.child.OnUpdate();
        return result === TaskStatus.SUCCESS ? TaskStatus.SUCCESS : TaskStatus.RUNNING;
    }
}

// Decorator Node - TimeLimit: limits the execution time of the child node
class TimeLimitDecorator extends Node
{
    private startTime: number | null = null;

    constructor(private child: ITask, private durationMs: number)
    {
        super();
    }

    OnUpdate(): TaskStatus
    {
        const now = Date.now();
        if(this.startTime === null)
        {
            this.startTime = now;
        }

        if(now - this.startTime <= this.durationMs)
        {
            return this.child.OnUpdate();
        } else
        {
            this.startTime = null;
            return TaskStatus.FAILURE;
        }
    }
}

/**
 * Decorator Node - Condition: runs the child node only if a condition is met
 * Use case: Basic IF-check.
 * Example: Only attack if in range.
 */
class ConditionDecorator extends Node
{
    constructor(private child: ITask, private conditionFn: () => boolean)
    {
        super();
    }

    OnUpdate(): TaskStatus
    {
        if(this.conditionFn())
        {
            return this.child.OnUpdate();
        }
        return TaskStatus.FAILURE;
    }
}

/**
 * ParallelNode allows multiple child tasks to run simultaneously.
 * - Returns FAILURE if any child returns FAILURE.
 * - Returns SUCCESS only if all children return SUCCESS.
 * - Returns RUNNING if at least one child is still running.
 * 
 * Useful for behaviors like shooting while moving, scanning while patrolling, etc.
 */

export class ParallelNode extends TaskParent
{
    constructor(children: Node[])
    {
        super();
        this.children = children;
    }
    OnUpdate(): TaskStatus
    {
        let allSuccess = true;

        for(const child of this.children)
        {
            const status = child.OnUpdate();

            if(status === TaskStatus.FAILURE) return TaskStatus.FAILURE;
            if(status === TaskStatus.RUNNING) allSuccess = false;
        }

        return allSuccess ? TaskStatus.SUCCESS : TaskStatus.RUNNING;
    }
}

/**
 * RaceNode runs all children in parallel,
 * but returns as soon as any child returns SUCCESS or FAILURE.
 */
export class RaceNode extends TaskParent
{
    constructor(children: Node[])
    {
        super();
        this.children = children;
    }

    OnUpdate(): TaskStatus
    {
        for(const child of this.children)
        {
            const status = child.OnUpdate();

            if(status === TaskStatus.SUCCESS || status === TaskStatus.FAILURE)
            {
                // Stop immediately on first completion
                return status;
            }
        }

        // If all are still running
        return TaskStatus.RUNNING;
    }
}








