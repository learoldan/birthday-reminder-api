import {
    UpdateCommand,
    GetCommand,
    PutCommand,
    QueryCommand,
    DeleteCommand,
} from '@aws-sdk/lib-dynamodb'
import { docClient } from '../libs/dynamodb'
import { v4 as uuidv4 } from 'uuid'
import {
    NewBirthdayProps,
    CreateUserProps,
    DeleteBirthdayProps,
    UpdateBirthdayProps,
} from '../types'

const TABLE_USERS = 'users'
const TABLE_BIRTHDAYS = 'birthdays'

export async function getUserBirthdays(userId: string) {
    const command = new QueryCommand({
        TableName: TABLE_BIRTHDAYS,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId,
        },
    })

    try {
        const result = await docClient.send(command)
        return result.Items || []
    } catch (error) {
        console.error('Error fetching user birthdays:', error)
        throw new Error('Could not fetch birthdays')
    }
}

export async function addNewBirthday({ newBirthDay }: NewBirthdayProps) {
    const birthdayId = uuidv4()

    const command = new PutCommand({
        TableName: TABLE_BIRTHDAYS,
        Item: {
            userId: newBirthDay.userId,
            birthdayId,
            firstName: newBirthDay.firstName,
            lastName: newBirthDay.lastName,
            birthDay: newBirthDay.birthDay, // "MM-DD"
            notes: newBirthDay.notes,
        },
    })

    try {
        await docClient.send(command)
        return { birthdayId }
    } catch (error) {
        console.error('Error adding birthday:', error)
        throw new Error('Could not add birthday')
    }
}

export async function updateBirthday({ updateBirthDay }: UpdateBirthdayProps) {
    const updateExpressions: string[] = []
    const expressionAttributeValues: Record<string, string> = {}

    if (updateBirthDay.firstName) {
        updateExpressions.push('firstName = :firstName')
        expressionAttributeValues[':firstName'] = updateBirthDay.firstName
    }

    if (updateBirthDay.lastName) {
        updateExpressions.push('lastName = :lastName')
        expressionAttributeValues[':lastName'] = updateBirthDay.lastName
    }

    if (updateBirthDay.birthDay) {
        updateExpressions.push('birthDay = :birthDay')
        expressionAttributeValues[':birthDay'] = updateBirthDay.birthDay
    }

    if (updateBirthDay.notes) {
        updateExpressions.push('notes = :notes')
        expressionAttributeValues[':notes'] = updateBirthDay.notes
    }

    if (updateExpressions.length === 0) {
        throw new Error('No fields to update')
    }

    const command = new UpdateCommand({
        TableName: 'birthdays',
        Key: {
            userId: updateBirthDay.userId,
            birthdayId: updateBirthDay.birthdayId,
        },
        UpdateExpression: 'SET ' + updateExpressions.join(', '),
        ExpressionAttributeValues: expressionAttributeValues,
    })

    try {
        await docClient.send(command)
        return { success: true }
    } catch (error) {
        console.error('Error updating birthday:', error)
        throw new Error('Could not update birthday')
    }
}

export async function deleteBirthday({
    userId,
    birthdayId,
}: DeleteBirthdayProps) {
    const command = new DeleteCommand({
        TableName: TABLE_BIRTHDAYS,
        Key: {
            userId,
            birthdayId,
        },
    })

    try {
        await docClient.send(command)
        return { success: true }
    } catch (error) {
        console.error('Error deleting birthday:', error)
        throw new Error('Could not delete birthday')
    }
}

export async function getUser(userId: string) {
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

export async function createUser({ userId, email, name }: CreateUserProps) {
    const Item = {
        userId,
        email,
        name,
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
