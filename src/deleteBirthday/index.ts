import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { deleteBirthday } from '../services'

export async function handler(
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
    const { userId, birthdayId } = JSON.parse(event.body || '{}')

    if (!userId) {
        return {
            statusCode: 401,
            body: JSON.stringify({ message: 'Unauthorized, userId missing' }),
        }
    }

    if (!birthdayId) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'birthdayId is required',
            }),
        }
    }

    try {
        const result = await deleteBirthday({ userId, birthdayId })
        return {
            statusCode: 204,
            body: JSON.stringify(result),
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error, message: 'Internal Server Error' }),
        }
    }
}
