import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import { EmployeeController } from '../../../../src/interfaces/controllers/EmployeeController'
import { DeleteEmployee } from '../../../../src/application/use-cases/employee/Delete'
import res from '../../../../src/interfaces/utils/response'
import { setupTestEnvironment, TestEnvironment } from '../../../setup'

jest.mock('../../../../src/application/use-cases/employee/Delete')
jest.mock('../../../../src/interfaces/utils/response')


describe('EmployeeController', () => {
	let env: TestEnvironment

  let employeeController: EmployeeController
  let deleteEmployeeMock: jest.Mocked<DeleteEmployee>

  beforeEach(() => {
		env = setupTestEnvironment()

		employeeController = env.employeeController
		deleteEmployeeMock = env.deleteEmployeeMock

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
    })
  })
  describe('delete', () => {
    it('should delete an employee and return 200 status', async () => {
      deleteEmployeeMock.execute.mockResolvedValue(undefined);

      (res.set as jest.Mock).mockReturnThis();
      (res.send as jest.Mock).mockResolvedValue({
        statusCode: 200,
      })

      const event = createAPIGatewayEvent(null, { id: '1' })
      const context: Context = {} as any

      const response = await employeeController.delete(event, context, () => {})

      expect(deleteEmployeeMock.execute).toHaveBeenCalledWith('1')
      expect(res.set).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalled()
      expect(response.statusCode).toBe(200)
    })

    it('should return 500 if there is an error', async () => {
      const error = new Error('Some error')
      deleteEmployeeMock.execute.mockRejectedValue(error);

      (res.set as jest.Mock).mockReturnThis();
      (res.send as jest.Mock).mockResolvedValue({
        statusCode: 500,
        body: JSON.stringify({ message: 'Erro ao deletar funcionário', id: '1', error: error.message }),
      })

      const event = createAPIGatewayEvent(null, { id: '1' })
      const context: Context = {} as any

      const response = await employeeController.delete(event, context, () => {})

      expect(deleteEmployeeMock.execute).toHaveBeenCalledWith('1')
      expect(res.set).toHaveBeenCalledWith(500, { message: 'Erro ao deletar funcionário', id: '1', error })
      expect(res.send).toHaveBeenCalled()
      expect(response.statusCode).toBe(500)
    })
  })
})
