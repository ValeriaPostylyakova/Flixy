import { Injectable } from '@nestjs/common'
import { User } from 'generated/prisma/client'
import { PrismaService } from 'src/shared/database/prisma/prisma.service'

@Injectable()
export class EmailConfirmationRepository {
	public constructor(private readonly prismaService: PrismaService) {}

	public async updateIsVerified(id: string): Promise<User> {
		return await this.prismaService.user.update({
			where: {
				id
			},
			data: {
				isVerified: true
			}
		})
	}
}
