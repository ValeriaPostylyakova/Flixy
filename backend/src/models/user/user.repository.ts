import { Injectable } from '@nestjs/common'
import { hash } from 'argon2'
import { User } from 'generated/prisma/client'
import { PrismaService } from 'src/shared/database/prisma/prisma.service'
import { UpdateUserDto } from './dto/update-user.dto'
import { TCreateUser } from './types/create.type'
import { TUserWithAccount } from './types/user-with-account.type'

@Injectable()
export class UserRepository {
	public constructor(private readonly prismaService: PrismaService) {}

	public async findById(id: string): Promise<TUserWithAccount | null> {
		return await this.prismaService.user.findUnique({
			where: {
				id
			},
			include: {
				account: true
			}
		})
	}

	public async findMyEmail(email: string): Promise<TUserWithAccount | null> {
		return await this.prismaService.user.findUnique({
			where: {
				email
			},
			include: {
				account: true
			}
		})
	}

	public async create(user: TCreateUser): Promise<TUserWithAccount> {
		return await this.prismaService.user.create({
			data: {
				email: user.email,
				password: await hash(user.password),
				displayName: user.displayName,
				picture: user.picture,
				method: user.method,
				isVerified: user.isVerified
			},
			include: {
				account: true
			}
		})
	}

	public async update(id: string, dto: UpdateUserDto): Promise<User> {
		return await this.prismaService.user.update({
			where: {
				id
			},
			data: {
				email: dto.email,
				displayName: dto.name,
				isTwoFactorEnable: dto.isTwoFactorEnabled
			}
		})
	}
}
