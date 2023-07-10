import { Repository } from "@/core/domain/repository"
import { Contract } from "../contract.entity"
import { Garanty } from "../garanty.entity"

export interface ContractRepository extends Repository<Contract> {
  saveGaranty(contract: Contract, garanty: Garanty): Promise<void>
  findBySellerId(sellerId: string): Promise<Contract[]>
}
