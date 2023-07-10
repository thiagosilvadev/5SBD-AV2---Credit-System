import { Entity, EntityProps } from "types-ddd"

interface Schema {
  parse(value: unknown): unknown
}
export interface DomainValidator<R extends Schema> {
  schema: R
  validate: (value: unknown) => boolean
}
