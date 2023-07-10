import { Injectable } from "@/core/decorators/injectable.decorator"
import { Business, BusinessProps } from "./domain/business.entity"
import { CNPJValueObject, IAdapter, IResult, Result } from "types-ddd"
import { inject } from "tsyringe"
import { BusinessRepository } from "./domain/repositories"

export interface BusinessResponse extends Omit<BusinessProps, "id" | "cnpj"> {
  id: string
  cnpj: string
}

class Adapter implements IAdapter<Business, BusinessResponse> {
  build(target: Business): IResult<BusinessResponse, string, any> {
    console.log(target.cnpj)
    return Result.Ok({
      id: target.id.value(),
      name: target.name,
      cnpj: target.cnpj.formatToCnpjPattern().value(),
    })
  }
}

@Injectable()
export class BusinessService {
  constructor(
    @inject("BusinessRepository")
    private readonly repository: BusinessRepository,
  ) {}
  async createBusiness(name: string, cnpj: string): Promise<BusinessResponse> {
    console.log(cnpj)
    const result = Business.create({
      name,
      cnpj: CNPJValueObject.create(cnpj).value(),
    }).value()

    await this.repository.save(result)

    return result.toObject(new Adapter())
  }
}
