
export interface IServiceLocator
{
  /**
 * Provides a service instance for a specific type.
 * @param type The class or function type of the service.
 * @param service The service instance to provide.
 */
  Provide(type: Function, service: any): void;
  /**
 * Registers a service type with a unique name.
 * @param type The class or function type of the service.
 * @param name A unique name for the service.
 */
  RegisterService(type: Function, name: string): void;

  /**
   * @param type The class or function type of the service.
   */
  Resolve<T>(type: Function): T;
}

/**
 * Service Locator Pattern Implementation in TypeScript
 * 
 * This script provides a singleton-based Service Locator that allows
 * registering, providing, and resolving services based on their types
 * and unique names.
 * 
 * Features:
 * - Supports multiple service instances for the same type, each with a unique name.
 * - Ensures services are registered before they can be provided or resolved.
 * - Provides error handling for missing or duplicate service registrations.
 * 
 * Example usage:
 * - Register a service with a unique name.
 * - Provide an instance of the service.
 * - Resolve and retrieve the service by name.
 * 
 * Usage Example:
 * ```typescript
 * class LoggerService {
 *   Log() {
 *     console.log("Logging...");
 *   }
 * }
 * 
 * const serviceLocator = ServiceLocator.Instance;
 * serviceLocator.RegisterService(LoggerService, "ConsoleLogger");
 * serviceLocator.Provide(LoggerService, new LoggerService(), "ConsoleLogger");
 * const logger = serviceLocator.Resolve<LoggerService>(LoggerService, "ConsoleLogger");
 * logger.Log(); // Output: Logging...
 * ```
 */
export class ServiceLocator implements IServiceLocator
{
  private static sharedInstance: ServiceLocator;

  // Stores the service instances
  private services: Map<string, any> = new Map();

  // Manual mapping of service types to their unique service names
  private serviceMappings: Map<Function, string> = new Map();

  public static get Instance(): ServiceLocator
  {
    if(!this.sharedInstance)
    {
      this.sharedInstance = new ServiceLocator();
    }
    return this.sharedInstance;
  }


  public RegisterService(type: Function, name: string): void
  {
    if(this.serviceMappings.has(type))
    {
      throw new Error(`Service type "${type.name}" is already registered.`);
    }
    this.serviceMappings.set(type, name);
  }


  public Provide(type: Function, service: any): void
  {
    const name = this.serviceMappings.get(type);
    if(!name)
    {
      console.error(`Service type "${type.name}" is not registered.`)
      throw new Error(`Service type "${type.name}" is not registered.`);
    }
    this.services.set(name, service);
  }

  public Resolve<T>(type: Function): T
  {    
    const name = this.serviceMappings.get(type);
    if(!name)
    {
      console.error(`Service type "${type.name}" is not registered.`);
      throw new Error(`Service type "${type.name}" is not registered.`);
    }
    const service = this.services.get(name);
    if(!service)
    {
      console.error(`No instance provided for service type "${type.name}".`);
      throw new Error(`No instance provided for service type "${type.name}".`);
    }
    return service as T; // Cast the resolved service to the generic type
  }
}


//#region Example use

// export class LoggerService
// {
//   private indexer = 0;
//   Log()
//   {
//     console.log(`Indexer = ` + this.indexer++)
//   }
// }

// // Instantiate the service locator
// const serviceLocator = ServiceLocator.Instance;

// // Register services
// serviceLocator.RegisterService(LoggerService, 'LoggerService');

// // Provide service instances
// const loggerInstance = new LoggerService();
// serviceLocator.Provide(LoggerService, loggerInstance);

// const logger = ServiceLocator.Instance.Resolve<LoggerService>(LoggerService);
// logger.Log();
// // Resolve and use UserService
// const resolvedUserService = serviceLocator.Resolve<UserService>(UserService);
// console.log(resolvedUserService.fetchUser());
// Output:
// LOG: Fetching user data...
// Jane Doe
//#endregion






