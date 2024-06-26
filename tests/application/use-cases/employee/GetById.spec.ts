import { GetEmployeeById } from '../../../../src/application/use-cases/employee/GetById'
import { EmployeeRepository } from '../../../../src/domain/repositories/EmployeeRepository'
import { Employee } from '../../../../src/domain/entities/Employee'
import { IdGenerator } from '../../../../src/application/ports/IdGenerator'

let mockIdGenerator: IdGenerator

class MockEmployeeRepository implements EmployeeRepository {
  private employees: Employee[] = [new Employee('unique-id', 'User test', 26, 'Tester')]

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


describe('GetByIdEmployee Use Case', () => {
  let mockEmployeeRepository: EmployeeRepository
  let getByODEmployee: GetEmployeeById

  beforeEach(() => {
    mockEmployeeRepository = new MockEmployeeRepository()
    getByODEmployee = new GetEmployeeById(mockEmployeeRepository)
  })

  it('must search for an employee by id successfully', async () => {
		const employee = await getByODEmployee.execute('unique-id')

    expect(employee).not.toBeNull()
    expect(employee?.name).toBe('User test')
    expect(employee?.age).toBe(26)
    expect(employee?.occupation).toBe('Tester')
  })
})
