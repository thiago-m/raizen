import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import { EmployeeController } from '../../../../src/interfaces/controllers/EmployeeController'
import { CreateEmployee } from '../../../../src/application/use-cases/employee/Create'
import { EmployeeSchema } from '../../../../src/interfaces/dtos/EmployeeSchema'
import res from '../../../../src/interfaces/utils/response'
import { setupTestEnvironment, TestEnvironment } from '../../../setup'

jest.mock('../../../../src/application/use-cases/employee/Create')
jest.mock('../../../../src/interfaces/dtos/EmployeeSchema')
jest.mock('../../../../src/interfaces/utils/response')

describe('EmployeeController', () => {
	let env: TestEnvironment

	let employeeController: EmployeeController
	let createEmployeeMock: jest.Mocked<CreateEmployee>

  beforeEach(() => {
		env = setupTestEnvironment()

		employeeController = env.employeeController
		createEmployeeMock = env.createEmployeeMock

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

  describe('create', () => {
    it('should create an employee and return 201 status', async () => {
      const body = { name: 'John Doe', age: 30, occupation: 'Developer' };
      (EmployeeSchema.validateAsync as jest.Mock).mockResolvedValue(body);

      createEmployeeMock.execute.mockResolvedValue(undefined);
      (res.set as jest.Mock).mockReturnThis();
      (res.send as jest.Mock).mockResolvedValue({
        statusCode: 201,
        body: JSON.stringify({ message: "Funcionário cadastrado com sucesso!" }),
      });

      const event = createAPIGatewayEvent(body)
      const context: Context = {} as any

      const response = await employeeController.create(event, context, () => {})

      expect(EmployeeSchema.validateAsync).toHaveBeenCalledWith(body, { abortEarly: false })
      expect(createEmployeeMock.execute).toHaveBeenCalledWith(body.name, body.age, body.occupation)
      expect(res.set).toHaveBeenCalledWith(201, { message: "Funcionário cadastrado com sucesso!" })
      expect(res.send).toHaveBeenCalled()
      expect(response.statusCode).toBe(201)
    })
		it('should return 500 if validation fails', async () => {
			const body = { name: '', age: 30, occupation: 'Developer' } // Invalid name
			const validationError = new Error('Validation failed');
			(EmployeeSchema.validateAsync as jest.Mock).mockRejectedValue(validationError);

			(res.set as jest.Mock).mockReturnThis();
			(res.send as jest.Mock).mockResolvedValue({
				statusCode: 500,
				body: JSON.stringify({ message: 'Erro ao cadastrar funcionário', error: validationError }),
			});

			const event = createAPIGatewayEvent(body)
			const context: Context = {} as any

			const response = await employeeController.create(event, context, () => {})

			expect(EmployeeSchema.validateAsync).toHaveBeenCalledWith(body, { abortEarly: false })
			expect(createEmployeeMock.execute).not.toHaveBeenCalled()
			expect(res.set).toHaveBeenCalledWith(500, { message: 'Erro ao cadastrar funcionário', error: validationError })
			expect(res.send).toHaveBeenCalled()
			expect(response.statusCode).toBe(500)
		})
  })
})
