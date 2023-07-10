import { Repository } from "@/core/domain/repository"
import { Employee } from "../employee.entity"
import { CurrencyValueObject } from "types-ddd"

export interface EmployeeRepository extends Repository<Employee> {
  findByCpf(cpf: string): Promise<Employee | null>
  getIndebtedness(employeeId: string): Promise<CurrencyValueObject>
}
