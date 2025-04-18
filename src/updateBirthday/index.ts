import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { updateBirthday } from '../services'

export async function handler(
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
    const updateBirthDay = JSON.parse(event.body || '{}')

    if (!updateBirthDay.userId) {
        return {
            statusCode: 401,
            body: JSON.stringify({ message: 'Unauthorized, userId missing' }),
        }
    }

    if (!updateBirthDay.birthdayId) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'birthdayId is required',
            }),
        }
    }

    try {
        const result = await updateBirthday({ updateBirthDay })
        return {
            statusCode: 201,
            body: JSON.stringify(result),
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error, message: 'Internal Server Error' }),
        }
    }
}
