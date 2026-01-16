import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Req
} from '@nestjs/common'
import type { Request } from 'express'
import { User } from 'generated/prisma/client'
import { ConfirmationDto } from './dto/confirmation.dto'
import { EmailConfirmationService } from './email-confirmation.service'

@Controller('auth/email-confirmation')
export class EmailConfirmationController {
	constructor(
		private readonly emailConfirmationService: EmailConfirmationService
	) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	public async newVerification(
		@Req() req: Request,
		@Body() dto: ConfirmationDto
	): Promise<User> {
		return await this.emailConfirmationService.newVerificationToken(req, dto)
	}
}
