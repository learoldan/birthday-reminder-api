import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getUser, createUser } from '../services'

export const handler = async (
    event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
    try {
        const body = JSON.parse(event.body as string)
        const userId = body?.userId
        const email = body?.email
        const name = body?.name

        if (!userId) {
            return {
                statusCode: 401,
                body: JSON.stringify({
                    message: 'Unauthorized, userId missing',
                }),
            }
        }

        if (!email || !name) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing user information' }),
            }
        }

        let existingUser = await getUser(userId)

        if (!existingUser) {
            existingUser = await createUser({ userId, email, name })
        }

        const birthdays = existingUser.birthdays

        return {
            statusCode: 200,
            body: JSON.stringify({ birthdays }),
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: (error as Error).message }),
        }
    }
}
