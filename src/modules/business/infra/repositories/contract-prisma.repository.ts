import { UID, EntityProps, Uid, CurrencyValueObject } from "types-ddd"
import { Contract } from "../../domain/contract.entity"
import { ContractRepository } from "../../domain/repositories/contract.repository"
import { Garanty } from "../../domain/garanty.entity"
import { prisma } from "@/core/infra/prisma"
import { Injectable } from "@/core/decorators/injectable.decorator"

@Injectable()
export class ContractPrismaRepository implements ContractRepository {
  async saveGaranty(contract: Contract, garanty: Garanty): Promise<void> {
    await prisma.garanty.create({
      data: {
        id: garanty.id.value(),
        contractId: contract.id.value(),
        description: garanty.get("description"),
        value: garanty.get("value").value(),
      },
    })
  }
  async save(entity: Contract): Promise<void> {
    await prisma.contract.create({
      data: {
        id: entity.id.value(),
        payValue: entity.get("payValue").value(),
        totalInstallments: entity.get("totalOfInstallments"),
        employeeId: entity.get("employeeId").value(),
        sellerId: entity.get("sellerId").value(),
        value: entity.get("value").value(),
      },
    })
  }
  async delete(entity: Contract): Promise<void> {
    await prisma.contract.delete({
      where: {
        id: entity.id.value(),
      },
    })
  }
  exists(entity: Contract): Promise<boolean> {
    throw new Error("Method not implemented.")
  }
  existsById(id: string | UID<string>): Promise<boolean> {
    throw new Error("Method not implemented.")
  }
  async findById(id: string | UID<string>): Promise<Contract | null> {
    const contract = await prisma.contract.findFirst({
      where: {
        id: id.toString(),
      },
    })
    if (!contract) {
      return null
    }

    return Contract.create({
      employeeId: Uid(contract.employeeId),
      sellerId: Uid(contract.sellerId),
      payValue: CurrencyValueObject.create({
        value: contract.payValue,
        currency: "BRL",
      }).value(),
      totalOfInstallments: contract.totalInstallments,
      value: CurrencyValueObject.create({
        value: contract.value,
        currency: "BRL",
      }).value(),
      id: Uid(contract.id),
    }).value()
  }
  findAll(): Promise<Contract[]> {
    throw new Error("Method not implemented.")
  }
  findByProps(props: Partial<EntityProps>): Promise<Contract[]> {
    throw new Error("Method not implemented.")
  }

  async findBySellerId(sellerId: string): Promise<Contract[]> {
    const contracts = await prisma.contract.findMany({
      where: {
        sellerId,
      },
    })

    return contracts.map((contract) =>
      Contract.create({
        employeeId: Uid(contract.employeeId),
        payValue: CurrencyValueObject.create({
          value: contract.payValue,
          currency: "BRL",
        }).value(),
        sellerId: Uid(contract.sellerId),
        totalOfInstallments: contract.totalInstallments,
        value: CurrencyValueObject.create({
          value: contract.value,
          currency: "BRL",
        }).value(),
        id: Uid(contract.id),
      }).value(),
    )
  }
}
