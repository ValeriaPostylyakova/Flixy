import { User } from 'generated/prisma/client'

export type TMessage = { message: string }

export type TUserMessage = Promise<User | TMessage>
