import { MetadataKeys } from "./metadata.keys"

export function Param(paramName: string): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    Reflect.defineMetadata(
      MetadataKeys.PARAM,
      {
        paramName,
        parameterIndex,
      },
      target,
      propertyKey as string,
    )
  }
}
