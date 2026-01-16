import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { verify } from 'argon2'
import { Request, Response } from 'express'
import { User } from 'generated/prisma/browser'
import { AuthMethod } from 'generated/prisma/enums'
import { PrismaService } from 'src/shared/database/prisma/prisma.service'
import { UserService } from 'src/models/user/user.service'

import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { ProviderService } from './provider/provider.service'
import { EmailConfirmationService } from './email-confirmation/email-confirmation.service'
import { TwoFactorAuthService } from './two-factor-auth/two-factor-auth.service'

@Injectable()
export class AuthService {
	public constructor(
		private readonly userService: UserService,
		private readonly config: ConfigService,
		private readonly providerService: ProviderService,
		private readonly prismaService: PrismaService,
		private readonly emailConfirmationService: EmailConfirmationService,
		private readonly twoFactorAuthService: TwoFactorAuthService
	) {}

	public async register(req: Request, dto: RegisterDto) {
		const isExistUser = await this.userService.findByEmail(dto.email)

		if (isExistUser)
			throw new ConflictException(
				'Пользователь с таким email уже существует. Пожалуйста, используйте другой email или войдите в систему.'
			)

		const newUser = await this.userService.create(
			dto.email,
			dto.password,
			dto.name,
			'',
			AuthMethod.CREDENTIALS,
			false
		)

		this.emailConfirmationService.sendVerificationToken(newUser)

		return {
			message:
				'Вы успешно зарегистрировались. Пожалуйста, подтвердите почту. Сообщение было отправлено на ваш почтовый адрес.'
		}
	}

	public async login(req: Request, dto: LoginDto) {
		const user = await this.userService.findByEmail(dto.email)

		if (!user || !user.password)
			throw new NotFoundException(
				'Пользователь не найден. Пожалуйста, зарегистрируйтесь.'
			)

		const isValidPassword = await verify(user.password, dto.password)

		if (!isValidPassword)
			throw new UnauthorizedException(
				'Неверный пароль. Пожалуйста, попробуйте ещё раз или восстановите пароль, если забыли его.'
			)

		if (!user.isVerified) {
			await this.emailConfirmationService.sendVerificationToken(user)
			throw new UnauthorizedException(
				'Ваш email не подтвержден. Пожалуйста, проверьте вашу почту и  подтвердите адрес.'
			)
		}

		if (!user.isTwoFactorEnable) {
			return this.saveSession(req, user)
		}

		if (!dto.code) {
			await this.twoFactorAuthService.sendTwoFactorToken(user.email)

			return {
				message:
					'Для входа в систему вам необходимо ввести код из сообщения, отправленного на ваш почтовый адрес.'
			}
		}

		await this.twoFactorAuthService.validateTwoFactorToken(user.email, dto.code)

		return this.saveSession(req, user)
	}

	public async logout(req: Request, res: Response): Promise<void> {
		return new Promise((resolve, reject) => {
			req.session.destroy(err => {
				if (err)
					reject(
						new InternalServerErrorException(
							'Не удалось завершить сессию. Возможно, возникла проблема с сервером или сессия уже завершена.'
						)
					)

				res.clearCookie(this.config.getOrThrow<string>('SESSION_NAME'))
				resolve()
			})
		})
	}

	public async saveSession(req: Request, user: User): Promise<User> {
		return new Promise((resolve, reject) => {
			req.session.userId = user.id

			req.session.save(err => {
				if (err)
					reject(
						new InternalServerErrorException(
							'Не удалось сохрантиь сессию. Пожалуйста, проверьте, правильно ли настроены параметры сессии'
						)
					)

				resolve(user)
			})
		})
	}

	public async extractProfileFromCode(
		req: Request,
		provider: string,
		code: string
	) {
		const providerInstance = this.providerService.findByService(provider)
		const profile = await providerInstance?.findUserByCode(code)

		if (!profile) return

		const account = await this.prismaService.account.findFirst({
			where: {
				id: profile?.id,
				provider: profile?.provider
			}
		})

		let user = account?.userId
			? await this.userService.findById(account.userId)
			: null

		if (user) {
			await this.saveSession(req, user)
		}

		user = await this.userService.create(
			profile.email,
			'',
			profile.name,
			profile.picture,
			AuthMethod[profile.provider.toUpperCase()],
			true
		)

		if (!account) {
			await this.prismaService.account.create({
				data: {
					provider: profile.provider,
					userId: user.id,
					type: 'oauth',
					accessToken: profile.access_token,
					refreshToken: profile.refresh_token,
					expiresAt: profile.expires_at as number
				}
			})
		}

		return this.saveSession(req, user)
	}
}
