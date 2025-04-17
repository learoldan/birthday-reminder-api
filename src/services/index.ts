import { UpdateCommand, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb'
import { docClient } from '../libs/dynamodb'
import { v4 as uuidv4 } from 'uuid'
import { Birthday, NewBirthday, CreateUserProps } from '../types'

const TABLE_USERS = 'users'

export async function getUserBirthdays(userId: string) {
    const command = new GetCommand({
        TableName: TABLE_USERS,
        Key: { userId },
        ProjectionExpression: 'birthdays',
    })

    const result = await docClient.send(command)
    return result.Item?.birthdays || []
}

export async function addNewBirthday(userId: string, birthday: NewBirthday) {
    const birthdayWithId = {
        birthdayId: uuidv4(),
        ...birthday,
    }

    const command = new UpdateCommand({
        TableName: TABLE_USERS,
        Key: { userId },
        UpdateExpression:
            'SET birthdays = list_append(if_not_exists(birthdays, :emptyList), :newBirthday)',
        ExpressionAttributeValues: {
            ':newBirthday': [birthdayWithId],
            ':emptyList': [],
        },
        ReturnValues: 'UPDATED_NEW',
    })

    await docClient.send(command)
    return birthdayWithId
}

export async function deleteBirthday(userId: string, birthdayId: string) {
    const userData = await getUserBirthdays(userId)
    const updatedList = userData.filter(
        (b: Birthday) => b.birthdayId !== birthdayId
    )

    const command = new UpdateCommand({
        TableName: TABLE_USERS,
        Key: { userId },
        UpdateExpression: 'SET birthdays = :updatedList',
        ExpressionAttributeValues: {
            ':updatedList': updatedList,
        },
    })

    await docClient.send(command)
    return { success: true }
}

export const getUser = async (userId: string) => {
    const params = new GetCommand({
        TableName: TABLE_USERS,
        Key: { userId },
    })

    try {
        const result = await docClient.send(params)
        return result.Item || null
    } catch (error) {
        console.error('Error fetching user:', error)
        throw new Error('Error checking user in database.')
    }
}

export const createUser = async ({ userId, email, name }: CreateUserProps) => {
    const Item = {
        userId,
        email,
        name,
        birthdays: [],
        createdAt: new Date().toISOString(),
    }
    const params = new PutCommand({
        TableName: TABLE_USERS,
        Item,
    })

    try {
        await docClient.send(params)
        return Item
    } catch (error) {
        console.error('Error creating user:', error)
        throw new Error('Error saving user to database.')
    }
}
