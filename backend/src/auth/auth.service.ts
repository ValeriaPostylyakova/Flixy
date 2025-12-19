import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { verify } from 'argon2'
import { Request, Response } from 'express'
import { User } from 'generated/prisma/browser'
import { AuthMethod } from 'generated/prisma/enums'
import { UserService } from 'src/user/user.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'

@Injectable()
export class AuthService {
	public constructor(
		private readonly userService: UserService,
		private readonly config: ConfigService
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

		return this.saveSession(req, newUser)
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

	private async saveSession(req: Request, user: User): Promise<User> {
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
}
