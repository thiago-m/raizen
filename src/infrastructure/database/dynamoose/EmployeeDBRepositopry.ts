import { Schema, model } from 'dynamoose'
import { EmployeeRepository } from '../../../domain/repositories/EmployeeRepository'
import { Employee } from '../../../domain/entities/Employee'
import { NanoIdGenerator } from '../../services/NanoIdGenerator'

const idGenerator = new NanoIdGenerator()

const employeeSchema = new Schema({
  id: { type: String, hashKey: true },
  name: { type: String, index: { name: 'name-index' } },
  age: Number,
  occupation: String
})

const EmployeeModel = model('Raizen_Employee', employeeSchema)

export class DynamoDBEmployeeRepository implements EmployeeRepository {
  async create(employee: Employee): Promise<void> {
    employee.id = idGenerator.generate()
    await EmployeeModel.create(employee)
  }
	async findById(id: string): Promise<Employee | null> {
    const employeeModel = await EmployeeModel.get(id)
    return employeeModel ? new Employee(employeeModel.id, employeeModel.name, employeeModel.age, employeeModel.occupation) : null
	}
	async list(): Promise<Array<Employee> | null> {
		const employees = await EmployeeModel.scan().all().exec()
		return employees.length > 1
			? employees.map(({id, name, age, occupation}) => new Employee(id, name, age, occupation))
			: null
	}
	async update(id: string, name: string, age: number, occupation: string): Promise<void> {
			await EmployeeModel.update({id, name, age, occupation})
	}
}
