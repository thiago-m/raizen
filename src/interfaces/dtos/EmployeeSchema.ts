import * as Joi from 'joi'

export const EmployeeSchema = Joi.object({
  name: Joi.string(),
  age: Joi.number().integer().min(0).max(130),
  occupation: Joi.string()
})
