import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getUserBirthdays } from '../services'

export async function handler(
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
    const userId = event.requestContext.authorizer?.principalId // ID from the Auth0 autenticated user
    try {
        const birthdays = await getUserBirthdays(userId)
        return {
            statusCode: 200,
            body: JSON.stringify({ birthdays }),
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error, message: 'Internal Server Error' }),
        }
    }
}
