import { Employee } from "../../../domain/entities/Employee"
import { EmployeeRepository } from "../../../domain/repositories/EmployeeRepository"

export class ListEmployee {
  constructor( private employeeRepository: EmployeeRepository ){}

  async execute(): Promise<Array<Employee> | null> {
		return await this.employeeRepository.list()
  }
}
