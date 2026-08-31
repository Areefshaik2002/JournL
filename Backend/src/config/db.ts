import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import dotenv from 'dotenv'

dotenv.config()

const hasAwsCredentials = Boolean(
  process.env.AWS_ACCESS_KEY_ID && 
  process.env.AWS_SECRET_ACCESS_KEY && 
  process.env.AWS_ACCESS_KEY_ID.trim() !== ''
)

let docClient: DynamoDBDocumentClient | null = null

if (hasAwsCredentials) {
  const client = new DynamoDBClient({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
  })

  docClient = DynamoDBDocumentClient.from(client, {
    marshallOptions: {
      removeUndefinedValues: true,
    },
  })
  console.log('✅ AWS DynamoDB Client Initialized')
} else {
  console.log('ℹ️ AWS Credentials not provided. Backend using local mock database store.')
}

export { docClient, hasAwsCredentials }