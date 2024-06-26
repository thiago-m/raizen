import { EmployeeRepository } from "../../../domain/repositories/EmployeeRepository"

export class DeleteEmployee {
  constructor( private employeeRepository: EmployeeRepository ){}

  async execute(id: string): Promise<void> {
		return await this.employeeRepository.delete(id)
  }
}
