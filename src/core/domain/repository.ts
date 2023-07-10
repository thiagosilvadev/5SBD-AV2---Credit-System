import { Entity, EntityProps, UID } from "types-ddd"

export interface Repository<T extends Entity<EntityProps>> {
  save(entity: T): Promise<void>
  delete(entity: T): Promise<void>
  exists(entity: T): Promise<boolean>
  existsById(id: UID | string): Promise<boolean>
  findById(id: UID | string): Promise<T | null>
  findAll(): Promise<T[]>
  findByProps(props: Partial<EntityProps>): Promise<T[]>
}
