import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import { EmployeeController } from '../../../../src/interfaces/controllers/EmployeeController'
import { ListEmployee } from '../../../../src/application/use-cases/employee/List'
import res from '../../../../src/interfaces/utils/response'
import { IdGenerator } from '../../../../src/application/ports/IdGenerator'
import { setupTestEnvironment, TestEnvironment } from '../../../setup'

jest.mock('../../../../src/application/use-cases/employee/List')
jest.mock('../../../../src/interfaces/utils/response')

let mockIdGenerator: IdGenerator

describe('EmployeeController', () => {
	let env: TestEnvironment

  let employeeController: EmployeeController
  let listEmployeeMock: jest.Mocked<ListEmployee>

  beforeEach(() => {
		env = setupTestEnvironment()

		employeeController = env.employeeController
		listEmployeeMock = env.listEmployeeMock

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

  describe('list', () => {
    it('should return list of employees', async () => {
      const employees = [
        { id: '1', name: 'John Doe', age: 30, occupation: 'Developer' },
        { id: '2', name: 'Jane Doe', age: 25, occupation: 'Designer' },
      ]
      listEmployeeMock.execute.mockResolvedValue(employees);

      (res.set as jest.Mock).mockReturnThis();
      (res.send as jest.Mock).mockResolvedValue({
        statusCode: 200,
        body: JSON.stringify(employees),
      })

      const event = createAPIGatewayEvent(null)
      const context: Context = {} as any

      const response = await employeeController.list(event, context, () => {})

      expect(listEmployeeMock.execute).toHaveBeenCalled()
      expect(res.set).toHaveBeenCalledWith(200, employees)
      expect(res.send).toHaveBeenCalled()
      expect(response.statusCode).toBe(200)
    })
	})
})
