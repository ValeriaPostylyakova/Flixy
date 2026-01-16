import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { TokenType } from 'generated/prisma/enums'
import { PrismaService } from 'src/shared/database/prisma/prisma.service'
import { MailService } from 'src/shared/libs/mail/mail.service'

@Injectable()
export class TwoFactorAuthService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService
	) {}

	public async validateTwoFactorToken(email: string, code: string) {
		const existingToken = await this.prismaService.token.findFirst({
			where: {
				email,
				type: TokenType.TWO_FACTOR
			}
		})

		if (!existingToken) {
			throw new NotFoundException(
				'Токен не найден. Пожалуйста, запросите новый токен.'
			)
		}

		if (existingToken.token !== code) {
			throw new BadRequestException(
				'Неверный код. Пожалуйста, попробуйте ещё раз.'
			)
		}

		const hasExpared = new Date() > new Date(existingToken.expiresIn)

		if (hasExpared) {
			throw new NotFoundException(
				'Токен истек. Пожалуйста, запросите новый токен.'
			)
		}

		await this.prismaService.token.delete({
			where: {
				id: existingToken.id,
				type: TokenType.TWO_FACTOR
			}
		})

		return true
	}

	public async sendTwoFactorToken(email: string) {
		const twoFactorToken = await this.generateTwoFactorToken(email)

		await this.mailService.sendToFactorToken(
			twoFactorToken.email,
			twoFactorToken.token
		)

		return true
	}

	private async generateTwoFactorToken(email: string) {
		const token = Math.floor(100000 + Math.random() * 900000).toString()

		const expiresIn = new Date(new Date().getTime() + 300000)

		const existingToken = await this.prismaService.token.findFirst({
			where: {
				email,
				type: TokenType.TWO_FACTOR
			}
		})

		if (existingToken) {
			await this.prismaService.token.delete({
				where: {
					id: existingToken.id,
					type: TokenType.TWO_FACTOR
				}
			})
		}

		const twoFactorToken = await this.prismaService.token.create({
			data: {
				email,
				token,
				expiresIn,
				type: TokenType.TWO_FACTOR
			}
		})

		return twoFactorToken
	}
}
