import { CurrencyValueObject, Entity, Ok, Result, UID } from "types-ddd"

interface GarantyProps {
  id?: UID
  value: CurrencyValueObject
  description: string
  contractId: UID
}

export class Garanty extends Entity<GarantyProps> {
  private constructor(props: GarantyProps) {
    super(props)
  }

  public static create(props: GarantyProps): Result<Garanty> {
    return Ok(new Garanty(props))
  }
}
