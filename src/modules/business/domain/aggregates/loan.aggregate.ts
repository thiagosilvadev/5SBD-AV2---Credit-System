import { Aggregate, Ok, Result, UID } from "types-ddd"
import { Contract } from "../contract.entity"
import { Employee } from "../employee.entity"
import { Seller } from "../seller.entity"
import { Payment } from "../payment.entity"
import { Garanty } from "../garanty.entity"

interface LoanProps {
  id?: UID
  contract: Contract
  garanty: Garanty
  employee: Employee
  seller: Seller
  payments: Payment[]
}

export class Loan extends Aggregate<LoanProps> {
  private constructor(props: LoanProps) {
    super(props)
  }

  public static create(props: LoanProps): Result<Loan> {
    return Ok(new Loan(props))
  }
}
