import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { TokenType } from 'generated/prisma/enums'
import { UserService } from 'src/models/user/user.service'
import { MailService } from 'src/shared/libs/mail/mail.service'
import { v4 as uuidv4 } from 'uuid'
import { PasswordRecoveryRepository } from './password-recovery.repository'

import { TokensRepository } from '../tokens/tokens.repository'
import { NewPasswordDto } from './dto/new-password.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'

@Injectable()
export class PasswordRecoveryService {
	public constructor(
		private readonly mailService: MailService,
		private readonly userService: UserService,
		private readonly tokensRepository: TokensRepository,
		private readonly passwordRecoveryRepository: PasswordRecoveryRepository
	) {}

	public async reset(dto: ResetPasswordDto) {
		const existingUser = await this.userService.findByEmail(dto.email)

		if (!existingUser) {
			throw new NotFoundException(
				'Пользователь не найден. Пожалуйста, зарегистрируйтесь.'
			)
		}

		const resetPasswordToken = await this.generateResetPasswordToken(dto.email)

		await this.mailService.sendResetPassword(
			resetPasswordToken.email,
			resetPasswordToken.token
		)

		return true
	}

	public async newPassword(dto: NewPasswordDto, token: string) {
		const existingToken = await this.tokensRepository.findByToken(
			token,
			TokenType.PASSWORD_RESET
		)

		if (!existingToken) {
			throw new BadRequestException(
				'Токен сброса пароля не найден. Пожалуйста, запросите новый токен для сброса пароля.'
			)
		}

		const hasExpared = new Date() > new Date(existingToken.expiresIn)

		if (hasExpared) {
			throw new BadRequestException(
				'Токен сброса пароля истек. Пожалуйста, запросите новый токен для сброса пароля.'
			)
		}

		const user = await this.userService.findByEmail(existingToken.email)

		if (!user) {
			throw new NotFoundException(
				'Пользователь не найден. Пожалуйста, зарегистрируйтесь.'
			)
		}

		await this.passwordRecoveryRepository.updatePassword(user.id, dto.password)

		await this.tokensRepository.deleteToken(
			existingToken.id,
			TokenType.PASSWORD_RESET
		)

		return true
	}

	private async generateResetPasswordToken(email: string) {
		const token = uuidv4()
		const expiresIn = new Date(new Date().getTime() + 60 * 60 * 1000)

		const existingToken = await this.tokensRepository.findByTokenEmail(
			email,
			TokenType.PASSWORD_RESET
		)

		if (existingToken) {
			await this.tokensRepository.deleteToken(
				existingToken.id,
				TokenType.PASSWORD_RESET
			)
		}

		return await this.tokensRepository.createToken({
			email,
			token,
			expiresIn,
			type: TokenType.PASSWORD_RESET
		})
	}
}
