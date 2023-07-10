import { describe, expect, it } from "vitest"
import { CalculateComissionUseCase } from "./calculate-comission"
import { ContractPrismaRepository } from "../../infra/repositories/contract-prisma.repository"
import { CurrencyValueObject } from "types-ddd"

describe("Calculate Comission Use Case", () => {
  it("should calculate comission", async () => {
    const sut = new CalculateComissionUseCase(new ContractPrismaRepository())

    const result = sut.execute({
      sellerId: "9da65e65-4265-47cc-9a37-1c466049fdec",
      comissionPercentage: 10,
    })

    expect(result).resolves.toBeInstanceOf(CurrencyValueObject)
    const value = await result.then((r) => r.value())
    expect(value).toBe(1000)
  })
})
