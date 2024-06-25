import { ApiGatewayProxyHandler } from 'aws-lambda'
import res from '../utils/response'
import { EmployeeSchema } from '../dtos/EmployeeSchema'
import { CreateEmployee } from '../../application/use-cases/employee/Create'
import { GetEmployeeById } from '../../application/use-cases/employee/GetById'
import { ListEmployee } from '../../application/use-cases/employee/List'
import { UpdateEmployee } from '../../application/use-cases/employee/Update'
export class EmployeeController {
  constructor(
    private createEmployee: CreateEmployee,
		private getEmployeeById: GetEmployeeById,
		private listEmployee: ListEmployee,
		private updateEmployee: UpdateEmployee
  ){ }

  create: ApiGatewayProxyHandler = async event => {
    try {
      const body = JSON.parse(event.body)
      await EmployeeSchema.validateAsync(body, { abortEarly: false })
      const { name, age, occupation } = body

      await this.createEmployee.execute(name, age, occupation)

      res.set(201, { message: "Funcionário cadastrado com sucesso!" })
    } catch(error) {
      const message = 'Erro ao cadastrar funcionário'
      res.set(500, { message, error: error.details ?? error })
      console.error(message, error.details ?? error)
    } finally {
      return res.send()
    }
  }

	getById: ApiGatewayProxyHandler = async event => {
    const { id } = event.pathParameters
		try {
			const employee = await this.getEmployeeById.execute(id)
			if(!employee) return res.set(404, {message: 'Nenhum funcionário com esse id'})
			else return res.set(200, employee)
		} catch(error) {
      const message = 'Erro ao procurar funcionário'
      res.set(500, { message, id, error })
      console.error(message, error)
    } finally { return res.send() }
	}

	list: ApiGatewayProxyHandler = async event => {
		try {
			const employees = await this.listEmployee.execute()
			return res.set(200, employees)
		} catch(error) {
			const message = 'Erro ao listar funcionários'
			res.set(500, {message, error})
		} finally { return res.send() }
	}

	update: ApiGatewayProxyHandler = async event => {
    const { id } = event.pathParameters
		try {
      const body = JSON.parse(event.body)
      await EmployeeSchema.validateAsync(body, { abortEarly: false })
      const { name, age, occupation } = body

			await this.updateEmployee.execute(id, name , age, occupation)

			return res.set(200)
		} catch(error) {
			const message = 'Erro atualizar funcionário'
			res.set(500, {message, id, error})
		} finally { return res.send() }
	}
}
