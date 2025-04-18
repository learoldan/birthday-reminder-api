import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { addNewBirthday } from '../services'

export async function handler(
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
    const { userId, firstName, lastName, birthDay, notes } = JSON.parse(
        event.body || '{}'
    )

    // Fields validations
    if (!userId) {
        return {
            statusCode: 401,
            body: JSON.stringify({ message: 'Unauthorized, userId missing' }),
        }
    }
    if (!firstName) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'firstName is required',
            }),
        }
    }
    if (!lastName) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'lastName is required',
            }),
        }
    }
    if (!birthDay) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'birthDay is required',
            }),
        }
    }
    const newBirthDay = { userId, firstName, lastName, birthDay, notes }

    try {
        const result = await addNewBirthday({ newBirthDay })
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
