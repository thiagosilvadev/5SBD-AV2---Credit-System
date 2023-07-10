import { IRouter } from "./handlers.decorator"
import { MetadataKeys } from "./metadata.keys"
import { container, InjectionToken } from "tsyringe"

type Constructable<T = any> = new (...args: any[]) => T

type ProviderInjections = {
  provide: InjectionToken<unknown>
  useClass: Constructable
}

type ModuleOptions = {
  imports?: Constructable[]
  controllers?: Constructable[]
  providers?: (Constructable | ProviderInjections)[]
}

export interface ModuleRouter {
  controller: Constructable
  router: IRouter[]
  basePath: string
}

export const Module = (
  options: ModuleOptions = {
    imports: [],
    controllers: [],
    providers: [],
  },
) => {
  return (target: Constructable) => {
    const routers: ModuleRouter[] = options.controllers!.map((controller) => {
      const basePath: string = Reflect.getMetadata(
        MetadataKeys.BASE_PATH,
        controller,
      )
      const controllerRoutes: IRouter[] = Reflect.getMetadata(
        MetadataKeys.ROUTERS,
        controller,
      )
      return {
        basePath,
        controller,
        router: controllerRoutes,
      }
    })

    options.providers?.forEach((provider) => {
      if (typeof provider === "object") {
        container.register(provider.provide, {
          useClass: provider.useClass,
        })
        return
      }
      container.register(provider, {
        useClass: provider,
      })
    })

    options.controllers?.forEach((controller) => {
      container.register(controller, {
        useClass: controller,
      })
    })

    // pass options to the constructor
    return class extends target {
      imports = options.imports
      providers = options.providers
      routers = routers
      constructor(...args: any[]) {
        super(...args)
      }
    }
  }
}

export interface IModule {
  imports?: Constructable<IModule>[]
  routers: ModuleRouter[]
}
