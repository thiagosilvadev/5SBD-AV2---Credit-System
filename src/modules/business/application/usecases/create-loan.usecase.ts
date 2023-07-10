import { CurrencyValueObject, DateValueObject } from "types-ddd"
import { Loan } from "../../domain/aggregates/loan.aggregate"
import { Employee } from "../../domain/employee.entity"
import { EmployeeRepository } from "../../domain/repositories/employee.repository"
import { Seller } from "../../domain/seller.entity"
import { Contract } from "../../domain/contract.entity"
import { Garanty } from "../../domain/garanty.entity"
import { Payment } from "../../domain/payment.entity"

import { config } from "@/core/config/app.config"

type CreateLoanUseCaseParams = {
  value: number
  currency: CurrencyValueObject["currency"]
  installments: number
  employee: Employee
  seller: Seller
  garanty: {
    description: string
    value: number
  }
  paymentDay: number
}

export class CreateLoanUseCase {
  constructor(private readonly employeeRepository: EmployeeRepository) {}
  async execute({
    employee,
    value,
    currency,
    installments,
    seller,
    paymentDay,
    garanty: garantyRequest,
  }: CreateLoanUseCaseParams): Promise<Loan> {
    const loanValue = CurrencyValueObject.create({
      value,
      currency,
    }).value()
    const feePerMonth = this.calculateFee(loanValue)

    const perParcelValue = loanValue.value() / installments

    const employeeCurrentIndebteness =
      await this.employeeRepository.getIndebtedness(employee.id.toString())
    const employeeIndebtenessLimit = employee.indebtednessLimit
    if (
      employeeCurrentIndebteness
        .add(perParcelValue)
        .isGreaterThan(employeeIndebtenessLimit.get("value"))
    ) {
      throw new Error("Employee indebtedness limit reached")
    }

    const payValue = CurrencyValueObject.create({
      value: loanValue.value() + feePerMonth * installments,
      currency,
    }).value()

    const contract = Contract.create({
      value: loanValue,
      employeeId: employee.id,
      sellerId: seller.id,
      payValue,
      totalOfInstallments: installments,
    }).value()

    const garanty = Garanty.create({
      description: garantyRequest.description,
      value: CurrencyValueObject.create({
        value: garantyRequest.value,
        currency,
      }).value(),
      contractId: contract.id,
    }).value()

    const monthIncrement = new Date().getDay() > paymentDay ? 1 : 0
    const baseDate = DateValueObject.create(
      new Date(new Date().getFullYear(), new Date().getMonth(), paymentDay),
    )
      .value()
      .addMonths(monthIncrement)
    const payments = Array.from({ length: installments }).map((_, index) => {
      return Payment.create({
        contractId: contract.id,
        dueDate: baseDate.addMonths(index),
        installment: index + 1,
        value: CurrencyValueObject.create({
          value: perParcelValue + feePerMonth,
          currency,
        }).value(),
      }).value()
    })

    const loan = Loan.create({
      contract,
      employee,
      seller,
      payments,
      garanty,
    }).value()

    return loan
  }

  private calculateFee(value: CurrencyValueObject): number {
    return value.value() * (config("BASE_FEE") / 100)
  }
}
