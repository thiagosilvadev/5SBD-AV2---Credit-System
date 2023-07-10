import { UID, EntityProps, Uid, UserNameValueObject } from "types-ddd"
import { SellerRepository } from "../../domain/repositories/seller.repository"
import { Seller } from "../../domain/seller.entity"
import { prisma } from "@/core/infra/prisma"

export class SellerPrismaRepository implements SellerRepository {
  async save(entity: Seller): Promise<void> {
    await prisma.seller.create({
      data: {
        name: entity.get("name").value(),
        id: entity.id.value(),
      },
    })
  }
  async delete(entity: Seller): Promise<void> {
    await prisma.seller.delete({
      where: {
        id: entity.id.value(),
      },
    })
  }
  async exists(entity: Seller): Promise<boolean> {
    return !!(await prisma.seller.findFirst({
      where: {
        id: entity.id.value(),
      },
    }))
  }
  async existsById(id: string | UID<string>): Promise<boolean> {
    return !!(await prisma.seller.findFirst({
      where: {
        id: id.toString(),
      },
    }))
  }
  async findById(id: string | UID<string>): Promise<Seller | null> {
    const seller = await prisma.seller.findFirst({
      where: {
        id: String(id),
      },
    })
    if (!seller) {
      return null
    }

    return Seller.create({
      name: UserNameValueObject.create(seller.name).value(),
      id: Uid(seller.id),
    }).value()
  }
  async findAll(): Promise<Seller[]> {
    const sellers = await prisma.seller.findMany()
    return sellers.map((seller) =>
      Seller.create({
        name: UserNameValueObject.create(seller.name).value(),
        id: Uid(seller.id),
      }).value(),
    )
  }
  async findByProps(props: Partial<EntityProps>): Promise<Seller[]> {
    const sellers = await prisma.seller.findMany({
      where: {
        ...props,
      },
    })
    return sellers.map((seller) =>
      Seller.create({
        name: UserNameValueObject.create(seller.name).value(),
        id: Uid(seller.id),
      }).value(),
    )
  }
}
