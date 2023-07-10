import Controller from "@/core/decorators/controller.decorator"
import { LoanService } from "./application/services/loan.service"
import { Get, Post } from "@/core/decorators/handlers.decorator"
import { Body } from "@/core/decorators/body.decorator"
import { Param } from "@/core/decorators/param.decorator"
import { Route } from "tsoa"

@Route("/loan")
@Controller("/loan")
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  @Post("/")
  public async createLoan(@Body() body: any) {
    const result = await this.loanService.createLoan(body)
    return result.toObject()
  }

  @Get("/comission/:sellerId")
  public async calculateComission(@Param("sellerId") sellerId: string) {
    const result = await this.loanService.calculateComission(sellerId)
    return result
  }
}
