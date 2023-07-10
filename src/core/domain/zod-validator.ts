import { EntityProps } from "types-ddd"
import { DomainValidator } from "./domain.validator"
import { ZodSchema, ZodTypeDef } from "zod"

export class ZodValidator implements DomainValidator<ZodSchema> {
  schema: ZodSchema<unknown, ZodTypeDef, unknown>

  constructor(schema: ZodSchema<unknown, ZodTypeDef, unknown>) {
    this.schema = schema
  }
  validate(value: unknown): boolean {
    return this.schema.safeParse(value).success
  }
}

export const createZodValidator = <T extends EntityProps>(
  schema: ZodSchema<T, ZodTypeDef, unknown>,
): ZodValidator => {
  const validator = new ZodValidator(schema)
  return validator
}
