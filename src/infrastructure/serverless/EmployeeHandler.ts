import { DynamoDBEmployeeRepository } from "../database/dynamoose/EmployeeDBRepository"
import { EmployeeController } from "../../interfaces/controllers/EmployeeController"
import { CreateEmployee } from "../../application/use-cases/employee/Create"
import { GetEmployeeById } from "../../application/use-cases/employee/GetById"
import { ListEmployee } from "../../application/use-cases/employee/List"
import { UpdateEmployee } from "../../application/use-cases/employee/Update"
import { DeleteEmployee } from "../../application/use-cases/employee/Delete"

const employeeRepository = new DynamoDBEmployeeRepository()

const createEmployee = new CreateEmployee(employeeRepository)
const getEmployeeById = new GetEmployeeById(employeeRepository)
const listEmployee = new ListEmployee(employeeRepository)
const updateEmployee = new UpdateEmployee(employeeRepository)
const deleteEmployee = new DeleteEmployee(employeeRepository)

const employeeController = new EmployeeController(
	createEmployee,
	getEmployeeById,
	listEmployee,
	updateEmployee,
	deleteEmployee
)

export const createEmployeeHandler = employeeController.create
export const getEmployeeByIdHandler = employeeController.getById
export const listEmployeeHandler = employeeController.list
export const updateEmployeeHandler = employeeController.update
export const deleteEmployeeHandler = employeeController.delete
