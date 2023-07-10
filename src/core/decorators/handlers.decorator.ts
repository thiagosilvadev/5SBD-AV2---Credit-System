/* eslint-disable @typescript-eslint/ban-types */

import { MetadataKeys } from "./metadata.keys"

import {
  Get as TsoaGet,
  Post as TsoaPost,
  Put as TsoaPut,
  Delete as TsoaDelete,
} from "tsoa"

export enum Methods {
  GET = "get",
  POST = "post",
  PUT = "put",
  DELETE = "delete",
}

const tsoaDecoratorMap: Map<Methods, (...args: any[]) => Function> = new Map([
  [Methods.GET, TsoaGet],
  [Methods.POST, TsoaPost],
  [Methods.PUT, TsoaPut],
  [Methods.DELETE, TsoaDelete],
])

export interface IRouter {
  method: Methods
  path: string
  handlerName: string | symbol
}
const methodDecoratorFactory = (method: Methods) => {
  return (path = ""): MethodDecorator => {
    return (target, propertyKey) => {
      const controllerClass = target.constructor
      const routers: IRouter[] = Reflect.hasMetadata(
        MetadataKeys.ROUTERS,
        controllerClass,
      )
        ? Reflect.getMetadata(MetadataKeys.ROUTERS, controllerClass)
        : []
      routers.push({
        method,
        path,
        handlerName: propertyKey,
      })
      Reflect.defineMetadata(MetadataKeys.ROUTERS, routers, controllerClass)

      const tsoaDecorator = tsoaDecoratorMap.get(method)
      if (!tsoaDecorator) throw new Error("Method not found")
      // convert
      tsoaDecorator(path)(target, propertyKey)

      return target
    }
  }
}

export const Get = methodDecoratorFactory(Methods.GET)
export const Post = methodDecoratorFactory(Methods.POST)
export const Put = methodDecoratorFactory(Methods.PUT)
export const Delete = methodDecoratorFactory(Methods.DELETE)
