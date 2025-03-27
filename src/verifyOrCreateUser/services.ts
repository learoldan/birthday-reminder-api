import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb'
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda'

const dynamoDbClient = new DynamoDBClient({})
const lambdaClient = new LambdaClient({})
const GET_BIRTHDAYS_LAMBDA = 'getUserBirthdays'

const getUser = async (email: string) => {
    const params = new GetCommand({
        TableName: 'users',
        Key: { email },
    })

    try {
        const result = await dynamoDbClient.send(params)
        return result.Item || null
    } catch (error) {
        console.error('Error fetching user:', error)
        throw new Error('Error checking user in database.')
    }
}

const createUser = async (email: string, name: string) => {
    const params = new PutCommand({
        TableName: 'users',
        Item: {
            email,
            name,
            createdAt: new Date().toISOString(),
        },
    })

    try {
        await dynamoDbClient.send(params)
    } catch (error) {
        console.error('Error creating user:', error)
        throw new Error('Error saving user to database.')
    }
}

const getUserBirthdays = async (email: string) => {
    try {
        const response = await lambdaClient.send(
            new InvokeCommand({
                FunctionName: GET_BIRTHDAYS_LAMBDA,
                Payload: Buffer.from(JSON.stringify({ email })),
            })
        )

        return JSON.parse(
            Buffer.from(response.Payload as Uint8Array).toString()
        )
    } catch (error) {
        console.error('Error calling getUserBirthdays:', error)
        throw new Error('Error fetching user birthdays.')
    }
}

export { getUser, createUser, getUserBirthdays }
