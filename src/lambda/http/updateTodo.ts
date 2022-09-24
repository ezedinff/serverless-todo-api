import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'
import { updateTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'

const logger = createLogger('updateTodo')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing event: ', event)
  const userId = getUserId(event)
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  try {
    await updateTodo(userId, todoId, updatedTodo)

    return {
      statusCode: 201,
      body: ''
    }
  } catch (error) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error
      })
    }
  }
})

handler.use(
  cors({
    credentials: true
  })
)
