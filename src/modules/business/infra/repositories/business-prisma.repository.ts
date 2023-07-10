import { UID, EntityProps, CNPJValueObject, Uid } from "types-ddd"
import { Business } from "../../domain/business.entity"
import { BusinessRepository } from "../../domain/repositories"
import { prisma } from "@/core/infra/prisma"

export class BusinessPrismaRepository implements BusinessRepository {
  async save(entity: Business): Promise<void> {
    await prisma.business.create({
      data: {
        id: entity.id.value(),
        name: entity.name,
        cnpj: entity.cnpj.value(),
      },
    })
  }
  async delete(entity: Business): Promise<void> {
    await prisma.business.delete({
      where: {
        id: entity.id.value(),
      },
    })
  }
  async exists(entity: Business): Promise<boolean> {
    throw new Error("Method not implemented.")
  }
  async existsById(id: string | UID<string>): Promise<boolean> {
    throw new Error("Method not implemented.")
  }
  async findById(id: string | UID<string>): Promise<Business | null> {
    const business = await prisma.business.findUnique({
      where: {
        id: String(id),
      },
    })
    if (!business) return null

    return Business.create({
      name: business.name,
      cnpj: CNPJValueObject.create(business.cnpj).value(),
      id: Uid(business.id),
    }).value()
  }
  async findAll(): Promise<Business[]> {
    throw new Error("Method not implemented.")
  }
  async findByProps(props: Partial<EntityProps>): Promise<Business[]> {
    throw new Error("Method not implemented.")
  }
}
