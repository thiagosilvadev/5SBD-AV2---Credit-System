import { it, describe, expect } from "vitest"
import { Employee } from "../domain/employee.entity"
import {
  CPFValueObject,
  CurrencyValueObject,
  Uid,
  UserNameValueObject,
} from "types-ddd"

//emprestimo em ingles
describe("Employee", () => {
  it("should create an new Employee", () => {
    const name = UserNameValueObject.create("John Doe").value()
    const businessId = Uid()
    const salary = CurrencyValueObject.create({
      value: 1000,
      currency: "BRL",
    }).value()
    const cpf = CPFValueObject.create("72725477824").value()
    const employee = Employee.create({
      name,
      businessId,
      salary,
      cpf,
    })
    expect(employee.isOk()).toBe(true)
  })
})
