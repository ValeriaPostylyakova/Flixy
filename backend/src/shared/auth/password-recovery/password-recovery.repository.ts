import { Injectable } from '@nestjs/common'
import { hash } from 'argon2'
import { User } from 'generated/prisma/client'
import { PrismaService } from 'src/shared/database/prisma/prisma.service'

@Injectable()
export class PasswordRecoveryRepository {
	public constructor(private readonly prismaService: PrismaService) {}

	public async updatePassword(id: string, password: string): Promise<User> {
		return await this.prismaService.user.update({
			where: {
				id: id
			},
			data: {
				password: await hash(password)
			}
		})
	}
}
