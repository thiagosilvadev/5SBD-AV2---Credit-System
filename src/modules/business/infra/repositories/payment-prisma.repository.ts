import { UID, EntityProps } from "types-ddd"
import { Payment } from "../../domain/payment.entity"
import { PaymentRepository } from "../../domain/repositories/payment.repository"
import { prisma } from "@/core/infra/prisma"
import { Injectable } from "@/core/decorators/injectable.decorator"

@Injectable()
export class PaymentPrismaRepository implements PaymentRepository {
  async save(entity: Payment): Promise<void> {
    await prisma.payment.create({
      data: {
        id: entity.id.value(),
        contractId: entity.get("contractId").value(),
        value: entity.get("value").value(),
        dueDate: entity.get("dueDate")?.value(),
      },
    })
  }
  async delete(entity: Payment): Promise<void> {
    await prisma.payment.delete({
      where: {
        id: entity.id.value(),
      },
    })
  }
  async exists(entity: Payment): Promise<boolean> {
    throw new Error("Method not implemented.")
  }
  async existsById(id: string | UID<string>): Promise<boolean> {
    throw new Error("Method not implemented.")
  }
  async findById(id: string | UID<string>): Promise<Payment | null> {
    throw new Error("Method not implemented.")
  }
  async findAll(): Promise<Payment[]> {
    throw new Error("Method not implemented.")
  }
  async findByProps(props: Partial<EntityProps>): Promise<Payment[]> {
    throw new Error("Method not implemented.")
  }
}
