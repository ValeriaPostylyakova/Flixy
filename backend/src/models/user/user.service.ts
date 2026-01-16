import {
	ConflictException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { User } from 'generated/prisma/client'
import { AuthMethod } from 'generated/prisma/enums'
import { UpdateUserDto } from './dto/update-user.dto'
import { TUserWithAccount } from './types/user-with-account.type'
import { UserRepository } from './user.repository'

@Injectable()
export class UserService {
	public constructor(private readonly userRepository: UserRepository) {}

	public async findById(id: string): Promise<TUserWithAccount | null> {
		if (!id) return null

		const user = this.userRepository.findById(id)

		if (!user)
			throw new NotFoundException(
				'Пользователь не найден. Пожалуйста проверьте введенные данные.'
			)

		return user
	}

	public async findByEmail(email: string): Promise<TUserWithAccount | null> {
		return await this.userRepository.findMyEmail(email)
	}

	public async create(
		email: string,
		password: string,
		displayName: string,
		picture: string,
		method: AuthMethod,
		isVerified: boolean
	): Promise<TUserWithAccount> {
		const userExists = await this.userRepository.findMyEmail(email)

		if (userExists)
			throw new ConflictException(
				'Пользователь с таким email уже существует. Пожалуйста проверьте введенные данные.'
			)

		return await this.userRepository.create({
			email,
			password,
			displayName,
			picture,
			method,
			isVerified
		})
	}

	public async update(userId: string, dto: UpdateUserDto): Promise<User> {
		const user = await this.findById(userId)

		if (!user)
			throw new NotFoundException(
				'Пользователь не найден. Пожалуйста проверьте введенные данные.'
			)

		return await this.userRepository.update(user.id, dto)
	}
}
