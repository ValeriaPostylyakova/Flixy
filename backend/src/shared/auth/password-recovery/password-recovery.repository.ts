import { Injectable } from '@nestjs/common'
import { hash } from 'argon2'
import { PrismaService } from 'src/shared/database/prisma/prisma.service'

@Injectable()
export class PasswordRecoveryRepository {
	public constructor(private readonly prismaService: PrismaService) {}

	public async updatePassword(id: string, password: string) {
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
