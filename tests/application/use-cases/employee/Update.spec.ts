import { EmployeeRepository } from '../../../../src/domain/repositories/EmployeeRepository'
import { Employee } from '../../../../src/domain/entities/Employee'
import { IdGenerator } from '../../../../src/application/ports/IdGenerator'
import { UpdateEmployee } from '../../../../src/application/use-cases/employee/Update'

let mockIdGenerator: IdGenerator

class MockEmployeeRepository implements EmployeeRepository {
  private employees: Array<Employee> = [
		new Employee('1', 'Boruto', 18, 'Ninja júnior'),
		new Employee('2', 'Renata', 28, 'Dona de casa, ex ninja'),
		new Employee('3', 'Naruto', 32, 'Hokage')
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

describe('UpdateEmployee Use Case', () => {
  let mockEmployeeRepository: EmployeeRepository
	let updateEmployee: UpdateEmployee

  beforeEach(() => {
    mockEmployeeRepository = new MockEmployeeRepository()
		updateEmployee = new UpdateEmployee(mockEmployeeRepository)
  })

  it('must update employee successfully', async () => {
		const id = '3'
		const name = 'Minato Namikaze'
		const age = 27
		const occupation = 'Lenda'

		await updateEmployee.execute(id, name, age, occupation)
		// await mockEmployeeRepository.update(id, name, age, occupation)
		const employee = await mockEmployeeRepository.findById(id)

    expect(employee).not.toBeNull()
    expect(employee?.age).toBe(age)
    expect(employee?.name).toBe(name)
    expect(employee?.occupation).toBe(occupation)
  })
})
