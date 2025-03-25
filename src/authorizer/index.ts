/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    APIGatewayTokenAuthorizerEvent,
    APIGatewayAuthorizerResult,
} from 'aws-lambda'
import jwt, { VerifyErrors, JwtHeader, SigningKeyCallback } from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'
// import { getKey } from '../../lib/jwt'

// Configuración del cliente JWKS
const client = jwksClient({
    jwksUri: process.env.AUTH0_JWKS_URI as string,
})

// Función corregida
export const getKey = (
    header: JwtHeader,
    callback: SigningKeyCallback
): void => {
    if (!header.kid) {
        callback(new Error('No KID found in token header'), undefined)
        return
    }

    client.getSigningKey(header.kid, (err, key) => {
        if (err) {
            callback(err, undefined)
        } else {
            const signingKey = key?.getPublicKey()
            callback(null, signingKey)
        }
    })
}

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
                issuer: process.env.AUTH0_ISSUER,
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
