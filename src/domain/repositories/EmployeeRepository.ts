import { Employee } from '../entities/Employee'

export interface EmployeeRepository {
  create(employee): Promise<void>
  findById(id: string): Promise<Employee | null>
  list(): Promise<Array<Employee> | null>
  update(id: string, name: string, age: number, occupation: string): Promise<void>
}
