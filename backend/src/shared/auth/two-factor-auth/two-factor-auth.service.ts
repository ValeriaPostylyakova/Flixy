import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { Token } from 'generated/prisma/client'
import { TokenType } from 'generated/prisma/enums'
import { MailService } from 'src/shared/libs/mail/mail.service'
import { TokensRepository } from '../tokens/tokens.repository'

@Injectable()
export class TwoFactorAuthService {
	public constructor(
		private readonly tokensRepository: TokensRepository,
		private readonly mailService: MailService
	) {}

	public async validateTwoFactorToken(
		email: string,
		code: string
	): Promise<boolean> {
		const existingToken = await this.tokensRepository.findByTokenEmail(
			email,
			TokenType.TWO_FACTOR
		)

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

		await this.tokensRepository.deleteToken(
			existingToken.id,
			TokenType.TWO_FACTOR
		)

		return true
	}

	public async sendTwoFactorToken(email: string): Promise<boolean> {
		const twoFactorToken = await this.generateTwoFactorToken(email)

		await this.mailService.sendToFactorToken(
			twoFactorToken.email,
			twoFactorToken.token
		)

		return true
	}

	private async generateTwoFactorToken(email: string): Promise<Token> {
		const token = Math.floor(100000 + Math.random() * 900000).toString()

		const expiresIn = new Date(new Date().getTime() + 300000)

		const existingToken = await this.tokensRepository.findByTokenEmail(
			email,
			TokenType.TWO_FACTOR
		)

		if (existingToken) {
			await this.tokensRepository.deleteToken(
				existingToken.id,
				TokenType.TWO_FACTOR
			)
		}

		const twoFactorToken = await this.tokensRepository.createToken({
			email,
			token,
			expiresIn,
			type: TokenType.TWO_FACTOR
		})

		return twoFactorToken
	}
}
