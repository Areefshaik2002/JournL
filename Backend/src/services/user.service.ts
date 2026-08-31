import type { User } from '../models/types.js'
import { GetCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb'
import { docClient, hasAwsCredentials } from '../config/db.js'

const USERS_TABLE = process.env.USERS_TABLE_NAME || 'JournL-Users'

// In-memory fallback store
const mockUsersStore: Map<string, User> = new Map()

export class UserService {
  static async createUser(user: User): Promise<User> {
    if (hasAwsCredentials && docClient) {
      await docClient.send(
        new PutCommand({
          TableName: USERS_TABLE,
          Item: user,
        })
      )
    } else {
      mockUsersStore.set(user.userId, user)
    }
    return user
  }

  static async findByEmail(email: string): Promise<User | null> {
    if (hasAwsCredentials && docClient) {
      const response = await docClient.send(
        new ScanCommand({
          TableName: USERS_TABLE,
          FilterExpression: 'email = :email',
          ExpressionAttributeValues: {
            ':email': email.toLowerCase(),
          },
        })
      )
      if (response.Items && response.Items.length > 0) {
        return response.Items[0] as User
      }
      return null
    } else {
      for (const user of mockUsersStore.values()) {
        if (user.email.toLowerCase() === email.toLowerCase()) {
          return user
        }
      }
      return null
    }
  }

  static async findById(userId: string): Promise<User | null> {
    if (hasAwsCredentials && docClient) {
      const response = await docClient.send(
        new GetCommand({
          TableName: USERS_TABLE,
          Key: { userId },
        })
      )
      return (response.Item as User) || null
    } else {
      return mockUsersStore.get(userId) || null
    }
  }
}
