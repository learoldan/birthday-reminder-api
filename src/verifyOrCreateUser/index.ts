import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getUser, createUser, getUserBirthdays } from './services'

export const handler = async (
    event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
    try {
        const user = event.requestContext.authorizer
        const email = user?.email
        const fullName = user?.fullName

        if (!email || !fullName) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing user information' }),
            }
        }

        let existingUser = await getUser(email)

        if (!existingUser) {
            await createUser(email, fullName)
            existingUser = { email, fullName }
        }

        const birthdays = await getUserBirthdays(email)

        return {
            statusCode: 200,
            body: JSON.stringify({ user: existingUser, birthdays }),
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: (error as Error).message }),
        }
    }
}
