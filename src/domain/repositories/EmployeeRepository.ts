export interface EmployeeRepository {
  create(employee): Promise<void>
}
