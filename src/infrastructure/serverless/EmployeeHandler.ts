import { DynamoDBEmployeeRepository } from "../database/dynamoose/EmployeeDBRepositopry"
import { EmployeeController } from "../../interfaces/controllers/EmployeeController"
import { CreateEmployee } from "../../application/use-cases/employee/Create"
import { GetEmployeeById } from "../../application/use-cases/employee/GetById"
import { ListEmployee } from "../../application/use-cases/employee/List"
import { UpdateEmployee } from "../../application/use-cases/employee/Update"

const employeeRepository = new DynamoDBEmployeeRepository()

const createEmployee = new CreateEmployee(employeeRepository)
const getEmployeeById = new GetEmployeeById(employeeRepository)
const listEmployee = new ListEmployee(employeeRepository)
const updateEmployee = new UpdateEmployee(employeeRepository)

const employeeController = new EmployeeController(createEmployee, getEmployeeById, listEmployee, updateEmployee)

export const createEmployeeHandler = employeeController.create
export const getEmployeeByIdHandler = employeeController.getById
export const listEmployeeHandler = employeeController.list
export const updateEmployeeHandler = employeeController.update
