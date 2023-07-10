import { CurrencyValueObject, Entity, Ok, Result, UID } from "types-ddd"

type ContractProps = {
  id?: UID
  employeeId: UID
  sellerId: UID
  value: CurrencyValueObject
  payValue: CurrencyValueObject
  createdAt?: Date
  updatedAt?: Date
  totalOfInstallments: number
}

export class Contract extends Entity<ContractProps> {
  private constructor(props: ContractProps) {
    super(props)
  }

  public static create(props: ContractProps): Result<Contract> {
    return Ok(new Contract(props))
  }
}
