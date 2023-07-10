import {
  AutoMapper,
  CNPJValueObject,
  Entity,
  Result,
  UID,
  Fail,
  Ok,
} from "types-ddd"

export interface BusinessProps {
  id?: UID
  name: string
  cnpj: CNPJValueObject
  createdAt?: Date
  updatedAt?: Date
}

export class Business extends Entity<BusinessProps> {
  private constructor(props: BusinessProps) {
    super(props)
  }

  public static create(props: BusinessProps): Result<Business> {
    if (!this.isValidProps(props)) {
      return Fail("Invalid props")
    }
    return Ok(new Business(props))
  }

  public get id(): UID {
    return this._id
  }

  public get name(): string {
    return this.props.name
  }

  public get cnpj(): CNPJValueObject {
    return this.props.cnpj
  }
}
