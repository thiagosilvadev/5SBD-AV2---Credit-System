import {
  CurrencyValueObject,
  UID,
  EntityProps,
  UserNameValueObject,
  CPFValueObject,
  Uid,
} from "types-ddd"
import { Employee } from "../../domain/employee.entity"
import { EmployeeRepository } from "../../domain/repositories/employee.repository"
import { prisma } from "@/core/infra/prisma"
import { Injectable } from "@/core/decorators/injectable.decorator"

const mapper = (employee: any): Employee => {
  return Employee.create({
    name: UserNameValueObject.create(employee.name).value(),
    cpf: CPFValueObject.create(employee.cpf).value(),
    salary: CurrencyValueObject.create({
      value: employee.salary,
      currency: "BRL",
    }).value(),
    businessId: Uid(employee.businessId),
    id: Uid(employee.id),
  }).value()
}
@Injectable()
export class EmployeePrismaRepository implements EmployeeRepository {
  async findByCpf(cpf: string): Promise<Employee | null> {
    const employeeByPrisma = await prisma.employee.findFirst({
      where: {
        cpf: cpf,
      },
    })
    if (!employeeByPrisma) {
      return null
    }
    return mapper(employeeByPrisma)
  }
  async getIndebtedness(employeeId: string): Promise<CurrencyValueObject> {
    const allContracts = await prisma.contract.findMany({
      where: {
        employeeId: employeeId,
      },
    })
    // sum  the value perMonth of all contracts
    const allContractsValue = allContracts.reduce((acc, contract) => {
      return acc + contract.payValue / contract.totalInstallments
    }, 0)

    return CurrencyValueObject.create({
      value: allContractsValue,
      currency: "BRL",
    }).value()
  }
  async save(entity: Employee): Promise<void> {
    await prisma.employee.create({
      data: {
        cpf: entity.get("cpf").value(),
        name: entity.get("name").value(),
        salary: entity.get("salary").value(),
        businessId: entity.get("businessId").value(),
        id: entity.id.toString(),
      },
    })
  }
  async delete(entity: Employee): Promise<void> {
    await prisma.employee.delete({
      where: {
        id: entity.id.toString(),
      },
    })
  }
  async exists(entity: Employee): Promise<boolean> {
    const employee = await prisma.employee.count({
      where: {
        id: entity.id.toString(),
      },
    })
    return employee > 0
  }
  async existsById(id: string | UID<string>): Promise<boolean> {
    const employee = await prisma.employee.count({
      where: {
        id: id.toString(),
      },
    })

    return employee > 0
  }
  async findById(id: string | UID<string>): Promise<Employee | null> {
    const employeeByPrisma = await prisma.employee.findUnique({
      where: {
        id: id.toString(),
      },
    })
    if (!employeeByPrisma) {
      return null
    }
    return mapper(employeeByPrisma)
  }
  async findAll(): Promise<Employee[]> {
    const employeesByPrisma = await prisma.employee.findMany()
    return employeesByPrisma.map((employee) => mapper(employee))
  }
  findByProps(props: Partial<EntityProps>): Promise<Employee[]> {
    return Promise.resolve([])
  }
}
