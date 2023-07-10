import { injectable } from "tsyringe"
import { MetadataKeys } from "./metadata.keys"
import { Constructor } from "../interfaces/constructor.interface"
import { Route } from "tsoa"

export default function Controller<T extends Constructor>(basePath = "") {
  return (target: T) => {
    Reflect.defineMetadata(MetadataKeys.BASE_PATH, basePath, target)
    injectable()(target)
    return Route(basePath)(target)
  }
}
