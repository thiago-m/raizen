import { EmployeeRepository } from "../../../domain/repositories/EmployeeRepository"

export class UpdateEmployee {
  constructor( private employeeRepository: EmployeeRepository ){}

  async execute(id: string, name: string, age: number, occupation: string): Promise<void> {
		return await this.employeeRepository.update(id, name, age, occupation)
  }
}
