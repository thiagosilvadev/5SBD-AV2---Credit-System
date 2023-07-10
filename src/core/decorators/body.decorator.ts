import { MetadataKeys } from "./metadata.keys"

export const Body: () => ParameterDecorator =
  () => (target, propertyKey, parameterIndex) => {
    // mark que parametro é body
    Reflect.defineMetadata(
      MetadataKeys.BODY,
      parameterIndex,
      target,
      propertyKey as string,
    )
    // get the type of the parameter
    const type = Reflect.getMetadata(
      "design:paramtypes",
      target,
      propertyKey as string,
    )[parameterIndex]
    // mark the type of the parameter
    Reflect.defineMetadata("body:type", type, target, propertyKey as string)

    return
  }
