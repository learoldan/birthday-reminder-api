import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { addNewBirthday } from '../services'

export async function handler(
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
    const userId = event.requestContext.authorizer?.principalId // ID from the Auth0 autenticated user

    if (!userId) {
        return {
            statusCode: 401,
            body: JSON.stringify({ message: 'Unauthorized, userId missing' }),
        }
    }

    const { firstName, lastName, birthDay, notes } = JSON.parse(
        event.body || '{}'
    )

    // Fields validations
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
    const birthday = { firstName, lastName, birthDay, notes }

    try {
        const result = await addNewBirthday(userId, birthday)
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
