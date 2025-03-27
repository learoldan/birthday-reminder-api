/* eslint-disable @typescript-eslint/no-explicit-any */
export async function handler(event: any) {
    const birthdays = [
        { fullName: 'Lean', birthDay: '17-08' },
        { fullName: 'Pao', birthDay: '23-05' },
    ]
    console.log('event:', event)
    return {
        statusCode: 200,
        body: JSON.stringify({ birthdays: birthdays }),
    }
}
