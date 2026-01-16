import { TokenType } from 'generated/prisma/enums'

export type TCreateToken = {
	email: string
	token: string
	expiresIn: Date
	type: TokenType
}
