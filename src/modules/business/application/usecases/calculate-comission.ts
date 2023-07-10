import { CurrencyValueObject, UID } from "types-ddd"
import { ContractRepository } from "../../domain/repositories/contract.repository"

export class CalculateComissionUseCase {
  constructor(private readonly contractRepository: ContractRepository) {}
  async execute({
    sellerId,
    comissionPercentage,
  }: {
    sellerId: string | UID<string>
    comissionPercentage: number
  }): Promise<CurrencyValueObject> {
    const sellerContracts = await this.contractRepository.findBySellerId(
      sellerId.toString(),
    )
    const totalComission = sellerContracts.reduce((acc, contract) => {
      const contractValue = contract.get("value")
      console.log(contractValue.getCoin())
      const comission = contractValue.multiplyBy(comissionPercentage / 100)
      return acc + comission.value()
    }, 0)

    return CurrencyValueObject.create({
      value: totalComission,
      currency: "BRL",
    }).value()
  }
}
