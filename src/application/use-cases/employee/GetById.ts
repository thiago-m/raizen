import { Employee } from "../../../domain/entities/Employee"
import { EmployeeRepository } from "../../../domain/repositories/EmployeeRepository"

export class GetEmployeeById {
  constructor( private employeeRepository: EmployeeRepository ){}

  async execute(id: string): Promise<Employee | null> {
		return await this.employeeRepository.findById(id)
  }
}
