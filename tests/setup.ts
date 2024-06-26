import { EmployeeController } from '../src/interfaces/controllers/EmployeeController'
import { CreateEmployee } from '../src/application/use-cases/employee/Create'
import { GetEmployeeById } from '../src/application/use-cases/employee/GetById'
import { ListEmployee } from '../src/application/use-cases/employee/List'
import { UpdateEmployee } from '../src/application/use-cases/employee/Update'
import { DeleteEmployee } from '../src/application/use-cases/employee/Delete'
import { EmployeeRepository } from '../src/domain/repositories/EmployeeRepository'
import { IdGenerator } from '../src/application/ports/IdGenerator'
import { Employee } from '../src/domain/entities/Employee'

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

export interface TestEnvironment {
  employeeController: EmployeeController
  createEmployeeMock: jest.Mocked<CreateEmployee>
  getEmployeeByIdMock: jest.Mocked<GetEmployeeById>
  listEmployeeMock: jest.Mocked<ListEmployee>
  updateEmployeeMock: jest.Mocked<UpdateEmployee>
  deleteEmployeeMock: jest.Mocked<DeleteEmployee>
	mockEmployeeRepository: EmployeeRepository
	mockIdGenerator: IdGenerator
}

export function setupTestEnvironment(): TestEnvironment {
	const mockEmployeeRepository = new MockEmployeeRepository()
	const mockIdGenerator = new MockIdGenerator()
	const createEmployeeMock = new CreateEmployee(mockEmployeeRepository) as jest.Mocked<CreateEmployee>
	const getEmployeeByIdMock = new GetEmployeeById(mockEmployeeRepository) as jest.Mocked<GetEmployeeById>
	const listEmployeeMock = new ListEmployee(mockEmployeeRepository) as jest.Mocked<ListEmployee>
	const updateEmployeeMock = new UpdateEmployee(mockEmployeeRepository) as jest.Mocked<UpdateEmployee>
	const deleteEmployeeMock = new DeleteEmployee(mockEmployeeRepository) as jest.Mocked<DeleteEmployee>

	const employeeController = new EmployeeController(
		createEmployeeMock,
		getEmployeeByIdMock,
		listEmployeeMock,
		updateEmployeeMock,
		deleteEmployeeMock
	)

  return {
		mockEmployeeRepository,
		mockIdGenerator,
		createEmployeeMock,
		getEmployeeByIdMock,
		listEmployeeMock,
		updateEmployeeMock,
		deleteEmployeeMock,
		employeeController
	 }
}
