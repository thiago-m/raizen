import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import { EmployeeController } from '../../../../src/interfaces/controllers/EmployeeController'
import { CreateEmployee } from '../../../../src/application/use-cases/employee/Create'
import { GetEmployeeById } from '../../../../src/application/use-cases/employee/GetById'
import res from '../../../../src/interfaces/utils/response'
import { setupTestEnvironment, TestEnvironment } from '../../../setup'

jest.mock('../../../../src/application/use-cases/employee/GetById')
jest.mock('../../../../src/interfaces/utils/response')

describe('EmployeeController', () => {
	let env: TestEnvironment

  let employeeController: EmployeeController
  let createEmployeeMock: jest.Mocked<CreateEmployee>
  let getEmployeeByIdMock: jest.Mocked<GetEmployeeById>

  beforeEach(() => {
		env = setupTestEnvironment()

		employeeController = env.employeeController
		getEmployeeByIdMock = env.getEmployeeByIdMock

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

  describe('getById', () => {
    it('should return employee details for a valid id', async () => {
      const employee = { id: '1', name: 'John Doe', age: 30, occupation: 'Developer' }
      getEmployeeByIdMock.execute.mockResolvedValue(employee);

      (res.set as jest.Mock).mockReturnThis();
      (res.send as jest.Mock).mockResolvedValue({
        statusCode: 200,
        body: JSON.stringify(employee),
      })

      const event = createAPIGatewayEvent(null, { id: '1' })
      const context: Context = {} as any

      const response = await employeeController.getById(event, context, () => {})

      expect(getEmployeeByIdMock.execute).toHaveBeenCalledWith('1')
      expect(res.set).toHaveBeenCalledWith(200, employee)
      expect(res.send).toHaveBeenCalled()
      expect(response.statusCode).toBe(200)
    })

    it('should return 404 if employee not found', async () => {
      getEmployeeByIdMock.execute.mockResolvedValue(null);

      (res.set as jest.Mock).mockReturnThis();
      (res.send as jest.Mock).mockResolvedValue({
        statusCode: 404,
        body: JSON.stringify({ message: 'Nenhum funcionário com esse id' }),
      })

      const event = createAPIGatewayEvent(null, { id: '1' })
      const context: Context = {} as any

      const response = await employeeController.getById(event, context, () => {})

      expect(getEmployeeByIdMock.execute).toHaveBeenCalledWith('1')
      expect(res.set).toHaveBeenCalledWith(404, { message: 'Nenhum funcionário com esse id' })
      expect(res.send).toHaveBeenCalled()
      expect(response.statusCode).toBe(404)
    })

    it('should return 500 if there is an error', async () => {
      const error = new Error('Some error')
      getEmployeeByIdMock.execute.mockRejectedValue(error);

      (res.set as jest.Mock).mockReturnThis();
      (res.send as jest.Mock).mockResolvedValue({
        statusCode: 500,
        body: JSON.stringify({ message: 'Erro ao procurar funcionário', id: '1', error: error.message }),
      })

      const event = createAPIGatewayEvent(null, { id: '1' })
      const context: Context = {} as any

      const response = await employeeController.getById(event, context, () => {})

      expect(getEmployeeByIdMock.execute).toHaveBeenCalledWith('1')
      expect(res.set).toHaveBeenCalledWith(500, { message: 'Erro ao procurar funcionário', id: '1', error })
      expect(res.send).toHaveBeenCalled()
      expect(response.statusCode).toBe(500)
    })
  })
})
