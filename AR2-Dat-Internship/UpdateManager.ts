import {UpdateComponent} from "UpdateComponent";

export class UpdateManager
{
  private components: UpdateComponent[] = [];

  // Add an UpdateComponent to the manager
  public AddComponent(component: UpdateComponent): void
  {
    this.components.push(component);
  }

  // Remove an UpdateComponent from the manager
  public RemoveComponent(component: UpdateComponent): boolean
  {
    const index = this.components.indexOf(component);
    if(index !== -1)
    {
      this.components.splice(index, 1);
    }
    return index !== -1;
  }

  // Update all managed components
  public Update(deltaTime: number): void
  {
    for(const component of this.components)
    {
      component.ProcessUpdate(deltaTime);
    }
  }
}
/* 
// Example Usage with UpdateComponent
const manager = new UpdateManager();
const component1 = new UpdateComponent();
const component2 = new UpdateComponent();

// Add update callbacks to components
component1.OnUpdate((delta) => {
  console.log(`Component 1 updated with delta: ${delta}`);
});
component2.OnUpdate((delta) => {
  console.log(`Component 2 updated with delta: ${delta}`);
});

// Add components to the manager
manager.addComponent(component1);
manager.addComponent(component2);
 */
