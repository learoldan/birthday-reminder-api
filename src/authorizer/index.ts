/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    APIGatewayTokenAuthorizerEvent,
    APIGatewayAuthorizerResult,
} from 'aws-lambda'
import jwt, { VerifyErrors } from 'jsonwebtoken'
import { getKey } from './jwt'

export const handler = async (
    event: APIGatewayTokenAuthorizerEvent
): Promise<APIGatewayAuthorizerResult> => {
    const token = event.authorizationToken?.split(' ')[1]

    if (!token) {
        throw new Error('Unauthorized')
    }

    return new Promise((resolve, reject) => {
        jwt.verify(
            token,
            getKey,
            {
                audience: process.env.AUTH0_API_AUDIENCE,
                issuer: process.env.AUTH0_TOKEN_ISSUER,
            },
            (err: VerifyErrors | null, decoded: any) => {
                if (err) {
                    reject('Unauthorized')
                } else {
                    resolve({
                        principalId: decoded.sub,
                        policyDocument: {
                            Version: '2012-10-17',
                            Statement: [
                                {
                                    Action: 'execute-api:Invoke',
                                    Effect: 'Allow',
                                    Resource: event.methodArn,
                                },
                            ],
                        },
                    })
                }
            }
        )
    })
}
