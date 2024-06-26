import { CreateEmployee } from '../../../../src/application/use-cases/employee/Create'
import { EmployeeRepository } from '../../../../src/domain/repositories/EmployeeRepository'
import { Employee } from '../../../../src/domain/entities/Employee'
import { IdGenerator } from '../../../../src/application/ports/IdGenerator'

let mockIdGenerator: IdGenerator

class MockEmployeeRepository implements EmployeeRepository {
  private employees: Employee[] = []

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

describe('CreateEmployee Use Case', () => {
  let createEmployee: CreateEmployee
  let mockEmployeeRepository: EmployeeRepository

  beforeEach(() => {
    mockEmployeeRepository = new MockEmployeeRepository()
    mockIdGenerator = new MockIdGenerator()
    createEmployee = new CreateEmployee(mockEmployeeRepository)
  })

  it('should create a employee successfully', async () => {
    const name = 'User test'
    const age = 26
    const occupation = 'Tester'

    await createEmployee.execute(name, age, occupation)
    const savedEmployee = await mockEmployeeRepository.findById('unique-id')

    expect(savedEmployee).not.toBeNull()
    expect(savedEmployee?.name).toBe(name)
    expect(savedEmployee?.age).toBe(age)
    expect(savedEmployee?.occupation).toBe(occupation)
  })
})
