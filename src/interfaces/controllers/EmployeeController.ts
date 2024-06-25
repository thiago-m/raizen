import { ApiGatewayProxyHandler } from 'aws-lambda'
import { CreateEmployee } from '../../application/use-cases/employee/Create'
import { CreateEmployeeSchema } from '../dtos/CreateEmployee'
import res from '../utils/response'

export class EmployeeController {
  constructor(
    private createEmployee: CreateEmployee
  ){ }

  create: ApiGatewayProxyHandler = async event => {
    try {
      const body = JSON.parse(event.body)
      await CreateEmployeeSchema.validateAsync(body, { abortEarly: false })
      const { name, age, occupation } = body

      await this.createEmployee.execute(name, age, occupation)

      res.set(202, { message: "Funcionário cadastrado com sucesso!" })
    } catch(error) {
      const message = 'Erro ao cadastrar funcionário'
      res.set(500, { message, error: error.details ?? error })
      console.error(message, error.details ?? error)
    } finally {
      return res.send()
    }
  }
}
