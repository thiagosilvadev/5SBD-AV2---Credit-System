import { Injectable } from "@/core/decorators/injectable.decorator"

import { EmployeeRepository } from "../../domain/repositories/employee.repository"
import { EmployeePrismaRepository } from "../../infra/repositories/employee-prisma.repository"
import { ContractRepository } from "../../domain/repositories/contract.repository"
import { PaymentRepository } from "../../domain/repositories/payment.repository"
import { ContractPrismaRepository } from "../../infra/repositories/contract-prisma.repository"
import { PaymentPrismaRepository } from "../../infra/repositories/payment-prisma.repository"
import { CreateLoanUseCase } from "../usecases/create-loan.usecase"
import { Payment } from "../../domain/payment.entity"
import { CalculateComissionUseCase } from "../usecases/calculate-comission"
import { SellerRepository } from "../../domain/repositories/seller.repository"
import { SellerPrismaRepository } from "../../infra/repositories/seller-prisma.repository"
import { inject } from "tsyringe"

@Injectable()
export class LoanService {
  constructor(
    @inject("EmployeeRepository")
    private readonly employeeRepository: EmployeeRepository,
    @inject("SellerRepository")
    private readonly sellerRepository: SellerRepository,
    @inject("ContractRepository")
    private readonly contractRepository: ContractRepository,
    @inject("PaymentRepository")
    private readonly paymentRepository: PaymentRepository,
  ) {}

  public async createLoan(body: any) {
    const uc = new CreateLoanUseCase(this.employeeRepository)
    const employee = await this.employeeRepository.findById(body.employeeId)
    if (!employee) throw new Error("Employee not found")

    const seller = await this.sellerRepository.findById(body.sellerId)
    if (!seller) throw new Error("Seller not found")
    const loan = await uc.execute({
      employee,
      currency: "BRL",
      value: body.value,
      garanty: {
        description: body.garantyDescription,
        value: body.garantyValue,
      },
      installments: body.installments,
      paymentDay: body.paymentDay,
      seller,
    })

    await this.contractRepository.save(loan.get("contract"))
    await this.contractRepository.saveGaranty(
      loan.get("contract"),
      loan.get("garanty"),
    )
    await Promise.all(
      loan
        .get("payments")
        .map((payment: Payment) => this.paymentRepository.save(payment)),
    )

    return loan
  }

  public async calculateComission(sellerId: string) {
    const uc = new CalculateComissionUseCase(this.contractRepository)
    const comission = await uc.execute({
      sellerId,
      comissionPercentage: 5,
    })

    return {
      comission: comission.value(),
      comissionInCurrency: comission.getCoin(),
    }
  }
}
