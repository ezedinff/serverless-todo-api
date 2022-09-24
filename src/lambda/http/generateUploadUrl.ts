import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'
import { attachTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'

const logger = createLogger('generateUploadUrl')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing event: ', event)
  const userId = getUserId(event)
  const todoId = event.pathParameters.todoId

  try {
    const url = await attachTodo(userId, todoId)
    return {
      statusCode: 200,
      body: JSON.stringify({
        "uploadUrl": url
      })
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

