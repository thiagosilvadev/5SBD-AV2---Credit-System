import { Route } from "tsoa"
import Controller from "@/core/decorators/controller.decorator"
import { BusinessService } from "./business.service"
import { Post } from "@/core/decorators/handlers.decorator"
import { Body } from "@/core/decorators/body.decorator"
import { BusinessRequest } from "./application/dto/create-business.dto"

@Route("/business")
@Controller("/business")
export class BusinessController {
  constructor(private readonly service: BusinessService) {}
  @Post("/")
  public async createBusiness(@Body() body: BusinessRequest) {
    console.log(body)
    const business = await this.service.createBusiness(body.name, body.cnpj)
    return business
  }
}
