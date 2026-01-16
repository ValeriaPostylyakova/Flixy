import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/database/prisma/prisma.service'

@Injectable()
export class EmailConfirmationRepository {
	public constructor(private readonly prismaService: PrismaService) {}

	public async updateIsVerified(id: string) {
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
