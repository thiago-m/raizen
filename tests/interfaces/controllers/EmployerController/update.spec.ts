import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import { EmployeeController } from '../../../../src/interfaces/controllers/EmployeeController'
import { UpdateEmployee } from '../../../../src/application/use-cases/employee/Update'
import { EmployeeSchema } from '../../../../src/interfaces/dtos/EmployeeSchema'
import res from '../../../../src/interfaces/utils/response'
import { setupTestEnvironment, TestEnvironment } from '../../../setup'

jest.mock('../../../../src/application/use-cases/employee/Update')
jest.mock('../../../../src/interfaces/dtos/EmployeeSchema')
jest.mock('../../../../src/interfaces/utils/response')

describe('EmployeeController', () => {
	let env: TestEnvironment

  let employeeController: EmployeeController
  let updateEmployeeMock: jest.Mocked<UpdateEmployee>

  beforeEach(() => {
		env = setupTestEnvironment()

		employeeController = env.employeeController
		updateEmployeeMock = env.updateEmployeeMock

    jest.clearAllMocks()
  })

  const createAPIGatewayEvent = (body: any, pathParameters: any = null): APIGatewayProxyEvent => ({
    body: JSON.stringify(body),
    headers: {},
    multiValueHeaders: {},
    httpMethod: 'POST',
    isBase64Encoded: false,
    path: '/employees',
    pathParameters,
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    stageVariables: null,
    requestContext: null,
    resource: null,
  } as APIGatewayProxyEvent)

	beforeAll(() => {
    (res.set as jest.Mock) = jest.fn().mockReturnThis();
    (res.send as jest.Mock) = jest.fn().mockResolvedValue({
      statusCode: 200,
      body: JSON.stringify({ message: 'Success' }),
    });
  })

	describe('update', () => {
    it('should update an employee and return 200 status', async () => {
      const body = { name: 'John Doe', age: 30, occupation: 'Developer' };
      (EmployeeSchema.validateAsync as jest.Mock).mockResolvedValue(body)

      updateEmployeeMock.execute.mockResolvedValue(undefined);
      (res.set as jest.Mock).mockReturnThis();
      (res.send as jest.Mock).mockResolvedValue({
        statusCode: 200,
      })

      const event = createAPIGatewayEvent(body, { id: '1' })
      const context: Context = {} as any

      const response = await employeeController.update(event, context, () => {})

      expect(EmployeeSchema.validateAsync).toHaveBeenCalledWith(body, { abortEarly: false })
      expect(updateEmployeeMock.execute).toHaveBeenCalledWith('1', body.name, body.age, body.occupation)
      expect(res.set).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalled()
      expect(response.statusCode).toBe(200)
    })

    it('should return 500 if validation fails', async () => {
      const body = { name: '', age: 30, occupation: 'Developer' } // Invalid name
      const validationError = new Error('Validation failed');
      (EmployeeSchema.validateAsync as jest.Mock).mockRejectedValue(validationError);

      (res.set as jest.Mock).mockReturnThis();
      (res.send as jest.Mock).mockResolvedValue({
        statusCode: 500,
        body: JSON.stringify({ message: 'Erro atualizar funcionário', id: '1', error: validationError.message }),
      })

      const event = createAPIGatewayEvent(body, { id: '1' })
      const context: Context = {} as any

      const response = await employeeController.update(event, context, () => {})

      expect(EmployeeSchema.validateAsync).toHaveBeenCalledWith(body, { abortEarly: false })
      expect(updateEmployeeMock.execute).not.toHaveBeenCalled()
      expect(res.set).toHaveBeenCalledWith(500, { message: 'Erro atualizar funcionário', id: '1', error: validationError })
      expect(res.send).toHaveBeenCalled()
      expect(response.statusCode).toBe(500)
    })
  })
})
