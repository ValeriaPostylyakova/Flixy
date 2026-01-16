import { Injectable } from '@nestjs/common'
import { TokenType } from 'generated/prisma/browser'
import { PrismaService } from 'src/shared/database/prisma/prisma.service'
import { TCreateToken } from './types/create.type'

@Injectable()
export class TokensRepository {
	public constructor(private readonly prismaService: PrismaService) {}

	public async findByToken(token: string, type: TokenType) {
		return await this.prismaService.token.findUnique({
			where: {
				token,
				type
			}
		})
	}

	public async deleteToken(id: string, type: TokenType) {
		return await this.prismaService.token.delete({
			where: {
				id,
				type
			}
		})
	}

	public async findByTokenEmail(email: string, type: TokenType) {
		return await this.prismaService.token.findFirst({
			where: {
				email,
				type
			}
		})
	}

	public async createToken(data: TCreateToken) {
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
