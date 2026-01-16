import { AuthMethod } from 'generated/prisma/enums'

export type TCreateUser = {
	email: string
	password: string
	displayName: string
	picture: string
	method: AuthMethod
	isVerified: boolean
}
