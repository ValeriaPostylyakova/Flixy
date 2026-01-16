import {
	BadRequestException,
	forwardRef,
	Inject,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { Request } from 'express'
import { User } from 'generated/prisma/client'
import { TokenType } from 'generated/prisma/enums'
import { UserService } from 'src/models/user/user.service'
import { MailService } from 'src/shared/libs/mail/mail.service'
import { v4 as uuidv4 } from 'uuid'
import { ConfirmationDto } from './dto/confirmation.dto'
import { EmailConfirmationRepository } from './email-confirmation.repository'

import { AuthService } from '../auth.service'
import { TokensRepository } from '../tokens/tokens.repository'

@Injectable()
export class EmailConfirmationService {
	public constructor(
		private readonly mailService: MailService,
		private readonly userService: UserService,
		private readonly tokensRepository: TokensRepository,
		private readonly emailConfirmationRepository: EmailConfirmationRepository,

		@Inject(forwardRef(() => AuthService))
		private readonly authService: AuthService
	) {}

	public async newVerificationToken(req: Request, dto: ConfirmationDto) {
		const existingToken = await this.tokensRepository.findByToken(
			dto.token,
			TokenType.VERIFICATION
		)

		if (!existingToken)
			throw new NotFoundException(
				'Токен подтверждения не найден. Пожалуйста, убедитесь, что у вас правильный токен.'
			)

		const hasExpared = new Date() > new Date(existingToken.expiresIn)

		if (hasExpared)
			throw new BadRequestException(
				'Токен подтверждения истек. Пожалуйста, запросите новый токен для подтверждения.'
			)

		const existingUser = await this.userService.findByEmail(existingToken.email)

		if (!existingUser)
			throw new NotFoundException(
				'Пользователь не найден. Пожалуйста, зарегистрируйтесь.'
			)

		await this.emailConfirmationRepository.updateIsVerified(existingUser.id)

		await this.tokensRepository.deleteToken(
			existingToken.id,
			TokenType.VERIFICATION
		)

		return this.authService.saveSession(req, existingUser)
	}

	public async sendVerificationToken(user: User) {
		const verificationToken = await this.generateVerificationToken(user.email)

		await this.mailService.sendConfirmationEmail(
			verificationToken.email,
			verificationToken.token
		)

		return true
	}

	private async generateVerificationToken(email: string) {
		const token = uuidv4()
		const expiresIn = new Date(new Date().getTime() + 60 * 60 * 1000)

		const existingToken = await this.tokensRepository.findByTokenEmail(
			email,
			TokenType.VERIFICATION
		)

		if (existingToken) {
			await this.tokensRepository.deleteToken(
				existingToken.id,
				TokenType.VERIFICATION
			)
		}

		return await this.tokensRepository.createToken({
			email,
			token,
			expiresIn,
			type: TokenType.VERIFICATION
		})
	}
}
