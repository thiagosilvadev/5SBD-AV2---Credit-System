import {
  Entity,
  UID,
  UserNameValueObject,
  CurrencyValueObject,
  Result,
  Ok,
  CPFValueObject,
  Fail,
} from "types-ddd"

export interface EmployeeProps {
  id?: UID
  name: UserNameValueObject
  cpf: CPFValueObject
  businessId: UID
  salary: CurrencyValueObject
  createdAt?: Date
  updatedAt?: Date
}

export class Employee extends Entity<EmployeeProps> {
  private INDEBTEDNESSLIMIT_PERCENTAGE = 0.3
  private constructor(props: EmployeeProps) {
    super(props)
  }

  public static isValidProps(props: EmployeeProps): boolean {
    const isNotValid =
      this.validator.isUndefined(props.name) &&
      this.validator.isUndefined(props.cpf) &&
      this.validator.isUndefined(props.businessId) &&
      this.validator.isUndefined(props.salary)

    return !isNotValid
  }

  public static create(props: EmployeeProps): Result<Employee> {
    const isValid = this.isValidProps(props)
    if (!isValid) {
      return Fail("Invalid props")
    }
    return Ok(new Employee(props))
  }
  public get indebtednessLimit(): CurrencyValueObject {
    return (this.props.salary.clone() as CurrencyValueObject).multiplyBy(
      this.INDEBTEDNESSLIMIT_PERCENTAGE,
    )
  }
}
