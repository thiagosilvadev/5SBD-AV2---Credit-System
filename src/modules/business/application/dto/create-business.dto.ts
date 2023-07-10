import { ZodValidator } from "@/core/application/http/validation"
import { z } from "zod"

const schema = z.object({
  name: z.string(),
  cnpj: z.string(),
})
@ZodValidator(schema)
export class BusinessRequest {
  name!: string
  cnpj!: string
  constructor(data: BusinessRequest) {
    Object.assign(this, data)
  }
}
