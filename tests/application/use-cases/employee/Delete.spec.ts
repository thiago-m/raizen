import { EmployeeRepository } from '../../../../src/domain/repositories/EmployeeRepository'
import { Employee } from '../../../../src/domain/entities/Employee'
import { IdGenerator } from '../../../../src/application/ports/IdGenerator'
import { DeleteEmployee } from '../../../../src/application/use-cases/employee/Delete'

let mockIdGenerator: IdGenerator

class MockEmployeeRepository implements EmployeeRepository {
  private employees: Array<Employee> = [
		new Employee('1', 'Boruto', 18, 'Ninja júnior')
	]

  async create(employee: Employee): Promise<void> {
    employee.id = mockIdGenerator.generate()
    this.employees.push(employee)
  }

  async findById(id: string): Promise<Employee | null> {
    return this.employees.find(employee => employee.id === id) || null
  }
	async list(): Promise<Array<Employee> | null> {
		return this.employees || null
	}
	async update(id: string, name: string, age: number, occupation: string): Promise<void> {
		this.employees.map(employee => {
			if(employee.id === id) {
				employee.name = name
				employee.age = age
				employee.occupation = occupation
			}
		})
	}
	async delete(id: string): Promise<void> {
		this.employees = this.employees.filter(employee => employee.id !== id)
	}
}

class MockIdGenerator implements IdGenerator {
  generate(): string { return 'unique-id' }
}

describe('DeleteEmployee Use Case', () => {
  let mockEmployeeRepository: EmployeeRepository
	let deleteEmployee: DeleteEmployee

  beforeEach(() => {
    mockEmployeeRepository = new MockEmployeeRepository()
		deleteEmployee = new DeleteEmployee(mockEmployeeRepository)
  })

  it('must delete employee successfully', async () => {
		const id = '1'

		const employee = await mockEmployeeRepository.findById(id)
		await deleteEmployee.execute(id)
		const employeeAfter = await mockEmployeeRepository.findById(id)

    expect(employee).not.toBeNull()
    expect(employeeAfter).toBeNull()
  })
})
