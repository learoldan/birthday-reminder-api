import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

// DynamoDB client config
const dynamoDbClient = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(dynamoDbClient)

export { docClient }
