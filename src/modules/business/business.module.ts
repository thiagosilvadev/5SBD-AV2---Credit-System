import { Module } from "@/core/decorators/module.decorator"
import { BusinessController } from "./business.controller"
import { BusinessService } from "./business.service"
import { LoanController } from "./loan.controller"
import { LoanService } from "./application/services/loan.service"
import {
  EmployeePrismaRepository,
  ContractPrismaRepository,
  PaymentPrismaRepository,
  SellerPrismaRepository,
} from "./infra/repositories"
import { BusinessPrismaRepository } from "./infra/repositories/business-prisma.repository"

@Module({
  controllers: [BusinessController, LoanController],
  providers: [
    BusinessService,
    LoanService,
    {
      provide: "EmployeeRepository",
      useClass: EmployeePrismaRepository,
    },
    {
      provide: "ContractRepository",
      useClass: ContractPrismaRepository,
    },
    {
      provide: "PaymentRepository",
      useClass: PaymentPrismaRepository,
    },
    {
      provide: "SellerRepository",
      useClass: SellerPrismaRepository,
    },
    {
      provide: "BusinessRepository",
      useClass: BusinessPrismaRepository,
    },
  ],
})
export class BusinessModule {}
