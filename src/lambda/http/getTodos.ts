import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { getUserId, parseLimitParameter, parseNextKeyParameter, encodeNextKey } from '../utils'
import { createLogger } from '../../utils/logger'
import { getAllTodos } from '../../businessLogic/todos'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

const logger = createLogger('getTodos')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  logger.info('Processing event: ', event)

  let nextKey // Next key to continue scan operation if necessary
  let limit // Maximum number of elements to return

  try {
    // Parse query parameters
    nextKey = parseNextKeyParameter(event)
    limit = parseLimitParameter(event) || 20
  } catch (e) {
    logger.error('Failed to parse query parameters: ', e.message)
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Invalid parameters'
      })
    }
  }

  const userId = getUserId(event)
  const items = await getAllTodos(userId, nextKey, limit);

  return {
    statusCode: 200,
    body: JSON.stringify({
      items: items.todoItems,
      // Encode the JSON object so a client can return it in a URL as is
      nextKey: encodeNextKey(items.lastEvaluatedKey)
    })
  }
})

handler.use(
  cors({
    credentials: true
  })
)
