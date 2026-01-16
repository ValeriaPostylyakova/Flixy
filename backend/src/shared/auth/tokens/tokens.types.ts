import { TokenType } from 'generated/prisma/enums'

export interface ICreateToken {
	email: string
	token: string
	expiresIn: Date
	type: TokenType
}
