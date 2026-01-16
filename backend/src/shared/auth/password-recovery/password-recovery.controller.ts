import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Param,
	Post
} from '@nestjs/common'
import { Recaptcha } from '@nestlab/google-recaptcha'
import { NewPasswordDto } from './dto/new-password.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { PasswordRecoveryService } from './password-recovery.service'

@Controller('auth/password-recovery')
export class PasswordRecoveryController {
	constructor(
		private readonly passwordRecoveryService: PasswordRecoveryService
	) {}

	@Recaptcha()
	@Post('reset')
	@HttpCode(HttpStatus.OK)
	async reset(@Body() dto: ResetPasswordDto): Promise<boolean> {
		return this.passwordRecoveryService.reset(dto)
	}

	@Recaptcha()
	@Post('new/:token')
	@HttpCode(HttpStatus.OK)
	async newPassword(
		@Param('token') token: string,
		@Body() dto: NewPasswordDto
	): Promise<boolean> {
		return this.passwordRecoveryService.newPassword(dto, token)
	}
}
