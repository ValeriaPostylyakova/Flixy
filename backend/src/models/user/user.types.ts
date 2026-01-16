import { Prisma } from 'generated/prisma/client'
import { AuthMethod } from 'generated/prisma/enums'

export interface ICreateUser {
	email: string
	password: string
	displayName: string
	picture: string
	method: AuthMethod
	isVerified: boolean
}

export type TUserWithAccount = Prisma.UserGetPayload<{
	include: { account: true }
}>
