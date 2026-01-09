import {
	ConflictException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { hash } from 'argon2'
import { AuthMethod } from 'generated/prisma/enums'
import { PrismaService } from 'src/prisma/prisma.service'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from 'generated/prisma/client'

@Injectable()
export class UserService {
	public constructor(private readonly prismaService: PrismaService) {}

	public async findById(id: string) {
		if (!id) return null

		const user = await this.prismaService.user.findUnique({
			where: {
				id
			},
			include: {
				account: true
			}
		})

		if (!user)
			throw new NotFoundException(
				'Пользователь не найден. Пожалуйста проверьте введенные данные.'
			)

		return user
	}

	public async findByEmail(email: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				email
			},
			include: {
				account: true
			}
		})

		return user
	}

	public async create(
		email: string,
		password: string,
		displayName: string,
		picture: string,
		method: AuthMethod,
		isVerified: boolean
	) {
		const userExists = await this.prismaService.user.findUnique({
			where: {
				email
			}
		})

		if (userExists)
			throw new ConflictException(
				'Пользователь с таким email уже существует. Пожалуйста проверьте введенные данные.'
			)

		const user = await this.prismaService.user.create({
			data: {
				email,
				password: await hash(password),
				displayName,
				picture,
				method,
				isVerified
			},
			include: {
				account: true
			}
		})

		return user
	}

	public async update(userId: string, dto: UpdateUserDto) {
		const user = await this.findById(userId)

		if (!user)
			throw new NotFoundException(
				'Пользователь не найден. Пожалуйста проверьте введенные данные.'
			)

		const updatedUser = await this.prismaService.user.update({
			where: {
				id: user.id
			},
			data: {
				email: dto.email,
				displayName: dto.name,
				isTwoFactorEnable: dto.isTwoFactorEnabled
			}
		})

		return updatedUser
	}
}
