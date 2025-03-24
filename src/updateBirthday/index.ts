export async function handler(event: any) {
    console.log('event:', event)
    return {
        statusCode: 200,
        body: JSON.stringify({ resposne: 'you updated the birthday' }),
    }
}
