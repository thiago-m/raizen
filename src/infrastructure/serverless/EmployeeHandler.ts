import { DynamoDBEmployeeRepository } from "../database/dynamoose/EmployeeDBRepositopry"
import { CreateEmployee } from "../../application/use-cases/employee/Create"
import { EmployeeController } from "../../interfaces/controllers/EmployeeController"

const employeeRepository = new DynamoDBEmployeeRepository()

const createEmployee = new CreateEmployee(employeeRepository)

const employeeController = new EmployeeController(createEmployee)

export const createEmployeeHandler = employeeController.create
