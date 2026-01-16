import { Injectable } from '@nestjs/common'
import { TokenType } from 'generated/prisma/browser'
import { Token } from 'generated/prisma/client'
import { PrismaService } from 'src/shared/database/prisma/prisma.service'
import { ICreateToken } from './tokens.types'

@Injectable()
export class TokensRepository {
	public constructor(private readonly prismaService: PrismaService) {}

	public async findByToken(
		token: string,
		type: TokenType
	): Promise<Token | null> {
		return await this.prismaService.token.findUnique({
			where: {
				token,
				type
			}
		})
	}

	public async deleteToken(id: string, type: TokenType): Promise<Token> {
		return await this.prismaService.token.delete({
			where: {
				id,
				type
			}
		})
	}

	public async findByTokenEmail(
		email: string,
		type: TokenType
	): Promise<Token | null> {
		return await this.prismaService.token.findFirst({
			where: {
				email,
				type
			}
		})
	}

	public async createToken(data: ICreateToken): Promise<Token> {
		return await this.prismaService.token.create({
			data: {
				email: data.email,
				token: data.token,
				expiresIn: data.expiresIn,
				type: data.type
			}
		})
	}
}
