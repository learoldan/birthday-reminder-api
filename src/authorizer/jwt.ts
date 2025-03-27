import { JwtHeader, SigningKeyCallback } from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'

// JWKS client config
const client = jwksClient({
    jwksUri: process.env.AUTH0_JWKS_URI as string,
})

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
