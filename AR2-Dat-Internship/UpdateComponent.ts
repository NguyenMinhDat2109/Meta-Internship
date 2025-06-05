type UpdateCallback = (delta: number) => void;

export class UpdateComponent
{
  private updateCallback: UpdateCallback | undefined;
  private timeMultiplier: number = 1;
  private onPaused = false;

  // Getter and Setter for timeMultiplier
  get TimeMultiplier(): number
  {
    return this.timeMultiplier;
  }

  set TimeMultiplier(value: number)
  {
    this.timeMultiplier = value;
  }

  // Add an update callback
  public OnUpdate(callback: UpdateCallback): UpdateComponent
  {
    this.updateCallback = callback;
    return this; // For chaining
  }

  // Process update logic with delta time
  public ProcessUpdate(delta: number): void
  {
    if (this.onPaused) {
      return;
    }
    const scaledDelta = delta * this.timeMultiplier;
    this.updateCallback?.(scaledDelta);
  }

  public RemoveCallback() {
    this.updateCallback = undefined;
  }

  public OnPaused(enable: boolean)
  {
    this.onPaused = enable;
  }
}

/* // Example Usage
const component = new UpdateComponent();

// Adding update callbacks
component.onUpdate((delta) => {
    console.log(`Callback 1: Delta Time (scaled): ${delta}`);
});

component.onUpdate((delta) => {
    console.log(`Callback 2: Delta Time (scaled): ${delta}`);
});

// Simulating updates
component.processUpdate(0.016); // For instance, 16ms delta (60 FPS)
 */