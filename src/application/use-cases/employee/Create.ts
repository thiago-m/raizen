import { Employee } from "../../../domain/entities/Employee"
import { EmployeeRepository } from "../../../domain/repositories/EmployeeRepository"

export class CreateEmployee {
  constructor(
    private employeeRepository: EmployeeRepository
  ){}

  async execute(name: string, age: number, occupation: string): Promise<void> {
    const employee = new Employee(null, name, age, occupation)
    await this.employeeRepository.create(employee)
  }
}
