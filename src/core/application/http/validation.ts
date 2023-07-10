import { Constructor } from "@/core/interfaces/constructor.interface"
import { ZodSchema } from "zod"

export function createZodValidator<T>(schema: ZodSchema<T>): Constructor<any> {
  return class {
    public schema = schema
    constructor(data: T) {
      const value = this.schema.parse(data)
      Object.assign(this, value)
    }
  }
}

// createZodValidator(schema) as decorator
export function ZodValidator<T extends Constructor>(schema: ZodSchema) {
  return function (target: T) {
    // @ts-ignore
    return class extends target {
      constructor(data: any) {
        const value = schema.parse(data)
        super(value)
      }
    }
  }
}
