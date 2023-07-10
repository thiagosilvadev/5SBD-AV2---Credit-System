import express, {
  Application as IExpressApplication,
  Router as ExRouter,
} from "express"
import { IModule, ModuleRouter } from "./decorators/module.decorator"
import morgan from "morgan"
import {
  ApplicationRouter,
  IApplication,
} from "./interfaces/application.interface"
import { container } from "tsyringe"
import { validate } from "class-validator"
import { th } from "@faker-js/faker"

export class ExpressApplication
  implements IApplication<IExpressApplication, ExRouter>
{
  instance: IExpressApplication
  routes: ApplicationRouter[] = []

  constructor(private readonly applicationModule: IModule) {
    this.instance = express()
    this.instance.use(express.json())
    this.instance.use(morgan("dev"))
    this.applicationModule.routers.forEach((router) => {
      this.registerModuleRouter(router)
    })
    this.applicationModule.imports?.forEach((module) => {
      const moduleInstance = new module()
      moduleInstance.routers.forEach((router) => {
        this.registerModuleRouter(router)
      })
    })
  }
  listen(
    port: string | number,
    callback?: (() => void) | undefined,
  ): Promise<any>
  listen(
    port: string | number,
    hostname: string,
    callback?: (() => void) | undefined,
  ): Promise<any>
  listen(port: unknown, hostname?: unknown, callback?: unknown): Promise<any> {
    return Promise.resolve(
      this.instance.listen(port as number, hostname as string, callback as any),
    ) as Promise<any>
  }

  private registerModuleRouter({ basePath, controller, router }: ModuleRouter) {
    const exRouter = express.Router()
    exRouter.get

    router.forEach(({ method, path, handlerName }) => {
      this.routes.push({
        method,
        path: `${basePath}${path}`,
        handler: handlerName,
      })

      exRouter[method](path, async (req, res) => {
        try {
          const instance = container.resolve(controller)
          const numberOfParams = Reflect.getMetadata(
            "design:paramtypes",
            instance,
            handlerName as string,
          ).length
          const paramsMap = new Map<number, any>(
            Array(numberOfParams)
              .fill(null)
              .map((_, i) => [i, null]),
          )
          const bodyParameterIndex = Reflect.getMetadata(
            "body",
            instance,
            handlerName as string,
          )
          console.log(bodyParameterIndex)
          if (bodyParameterIndex !== undefined) {
            // the type of the body parameter
            const type = Reflect.getMetadata(
              "body:type",
              instance,
              handlerName as string,
            ) as any

            let body: any = req.body
            // if is a class, create an instance of it
            if (typeof type === "function" && type.name !== "Object") {
              body = new type(req.body)
              const validation = await validate(body)
              console.log(validation)
              if (validation.length > 0) {
                throw new Error("Validation error")
              }
              paramsMap.set(bodyParameterIndex, body)
            }
            paramsMap.set(bodyParameterIndex, body)
          }

          // get the instance param that is @Param
          const parameterDecorator = Reflect.getMetadata(
            "param",
            instance,
            handlerName as string,
          )

          if (parameterDecorator) {
            // assign the param to the params map
            const param = req.params[parameterDecorator.paramName]
            paramsMap.set(parameterDecorator.parameterIndex, param)
          }

          const returnValue = instance[String(handlerName)].bind(instance)(
            ...paramsMap.values(),
          )

          // if return value is a promise, resolve it
          if (returnValue instanceof Promise) {
            returnValue.then((data) => {
              res.json(data)
            })
          }

          // if return value is not a promise, send it
          else {
            res.json(returnValue)
          }
        } catch (error) {
          console.log("error", error)
          res.status(500).json((error as Error).message)
        }
      })
    })
    const errorMiddleware = async (
      error: Error,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      console.log(error)
      res.status(500).json({
        message: "Internal server error",
      })
    }
    this.instance.use(basePath, exRouter)
    this.instance.use(errorMiddleware)
  }
}
