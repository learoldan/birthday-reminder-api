// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function handler(event: any) {
    console.log('event:', event)
    return {
        statusCode: 200,
        body: JSON.stringify({ response: 'you created a new birthday' }),
    }
}
