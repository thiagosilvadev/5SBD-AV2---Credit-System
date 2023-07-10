/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, expect, it } from "vitest"
import { CreateLoanUseCase } from "./create-loan.usecase"
import { Loan } from "../../domain/aggregates/loan.aggregate"
import { EmployeeRepository } from "../../domain/repositories/employee.repository"
import {
  CurrencyValueObject,
  UID,
  EntityProps,
  ValueObject,
  CPFValueObject,
  Uid,
  UserNameValueObject,
} from "types-ddd"
import { Employee } from "../../domain/employee.entity"

import { fakerPT_BR as faker } from "@faker-js/faker"
import { Seller } from "../../domain/seller.entity"
export class InMemoryEmployeeRepository implements EmployeeRepository {
  private readonly employees: Map<string, Employee> = new Map()
  constructor(private readonly indebtedness: number) {}
  findByCpf(cpf: string): Promise<Employee | null> {
    return Promise.resolve(
      Array.from(this.employees.values()).find(
        (employee) => employee.get("cpf").value() === cpf,
      ) ?? null,
    )
  }
  getIndebtedness(_employeeId: string): Promise<CurrencyValueObject> {
    return Promise.resolve(
      CurrencyValueObject.create({
        value: this.indebtedness,
        currency: "BRL",
      }).value(),
    )
  }
  async save(entity: Employee): Promise<void> {
    this.employees.set(entity.id.toString(), entity)
  }
  async delete(entity: Employee): Promise<void> {
    this.employees.delete(entity.id.toString())
  }
  exists(entity: Employee): Promise<boolean> {
    return Promise.resolve(this.employees.has(entity.id.toString()))
  }
  existsById(id: string | UID<string>): Promise<boolean> {
    return Promise.resolve(this.employees.has(id.toString()))
  }
  findById(id: string | UID<string>): Promise<Employee | null> {
    return Promise.resolve(this.employees.get(id.toString()) ?? null)
  }
  findAll(): Promise<Employee[]> {
    return Promise.resolve(Array.from(this.employees.values()))
  }
  findByProps(props: Partial<EntityProps>): Promise<Employee[]> {
    return Promise.resolve(
      Array.from(this.employees.values()).filter((employee) => {
        return Object.entries(props).every(([key, value]) => {
          const employeeValue = employee.get(key as keyof Employee["props"])
          if (employeeValue instanceof ValueObject) {
            // @ts-ignore
            return employeeValue.isEqual(value as ValueObject<unknown>)
          }
          return employeeValue === value
        })
      }),
    )
  }
}

const seller = Seller.create({
  name: UserNameValueObject.create(faker.person.fullName()).value(),
}).value()

describe("Create Loan", () => {
  it("should create a loan", () => {
    const repo = new InMemoryEmployeeRepository(900)
    const sut = new CreateLoanUseCase(repo)
    const employee = Employee.create({
      businessId: Uid(),
      cpf: CPFValueObject.create("72725477824").value(),
      name: UserNameValueObject.create(faker.person.fullName()).value(),
      salary: CurrencyValueObject.create({
        value: 6000,
        currency: "BRL",
      }).value(),
    }).value()
    repo.save(employee)

    const result = sut.execute({
      employee,
      currency: "BRL",
      garanty: {
        description: faker.lorem.sentence(),
        value: 1000,
      },
      installments: 10,
      paymentDay: 10,
      seller,
      value: 1000,
    })
    expect(result).resolves.toBeInstanceOf(Loan)
  })
  it("should throw an error if employee indebtedness limit is reached", async () => {
    const repo = new InMemoryEmployeeRepository(50)
    const sut = new CreateLoanUseCase(repo)
    const employee = Employee.create({
      businessId: Uid(),
      cpf: CPFValueObject.create("72725477824").value(),
      name: UserNameValueObject.create(faker.person.fullName()).value(),
      salary: CurrencyValueObject.create({
        value: 1000,
        currency: "BRL",
      }).value(),
    }).value()
    await repo.save(employee)

    const promise = sut
      .execute({
        employee,
        currency: "BRL",
        garanty: {
          description: faker.lorem.sentence(),
          value: 1000,
        },
        installments: 3,
        paymentDay: 10,
        seller,
        value: 1000,
      })
      .catch((error) => {
        console.log(error)
        throw error
      })

    expect(promise).rejects.toThrowError("Employee indebtedness limit reached")
  })

  it("should aply fee in loan value", async () => {
    const repo = new InMemoryEmployeeRepository(50)
    const sut = new CreateLoanUseCase(repo)
    const employee = Employee.create({
      businessId: Uid(),
      cpf: CPFValueObject.create("72725477824").value(),
      name: UserNameValueObject.create(faker.person.fullName()).value(),
      salary: CurrencyValueObject.create({
        value: 6000,
        currency: "BRL",
      }).value(),
    }).value()
    await repo.save(employee)

    const loanValueTotal = 1000
    const installments = 4
    const loan = await sut.execute({
      employee,
      currency: "BRL",
      garanty: {
        description: faker.lorem.sentence(),
        value: 1000,
      },
      installments,
      paymentDay: 10,
      seller,
      value: loanValueTotal,
    })

    const total = loan.get("contract").get("payValue")

    expect(total.value()).toBe(1040)
  })
})
