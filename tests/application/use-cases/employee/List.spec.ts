import { EmployeeRepository } from '../../../../src/domain/repositories/EmployeeRepository'
import { Employee } from '../../../../src/domain/entities/Employee'
import { IdGenerator } from '../../../../src/application/ports/IdGenerator'
import { ListEmployee } from '../../../../src/application/use-cases/employee/List'

let mockIdGenerator: IdGenerator

class MockEmployeeRepository implements EmployeeRepository {
  private employees: Array<Employee> = [
		new Employee('1', 'Boruto', 18, 'Ninja júnior'),
		new Employee('2', 'Renata', 18, 'Dona de casa, ex ninja'),
		new Employee('3', 'Naruto', 18, 'Hokage')
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

describe('ListEmployee Use Case', () => {
  let mockEmployeeRepository: EmployeeRepository
	let listEmployee: ListEmployee

  beforeEach(() => {
    mockEmployeeRepository = new MockEmployeeRepository()
		listEmployee = new ListEmployee(mockEmployeeRepository)
  })

  it('must list employees successfully', async () => {
    const list = await listEmployee.execute()

    expect(list).not.toBeNull()
    expect(list?.length).toBe(3)
  })
})
