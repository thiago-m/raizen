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
}
