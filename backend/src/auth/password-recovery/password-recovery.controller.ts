import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Param,
	Post
} from '@nestjs/common'
import { PasswordRecoveryService } from './password-recovery.service'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { NewPasswordDto } from './dto/new-password.dto'
import { Recaptcha } from '@nestlab/google-recaptcha'

@Controller('auth/password-recovery')
export class PasswordRecoveryController {
	constructor(
		private readonly passwordRecoveryService: PasswordRecoveryService
	) {}

	@Recaptcha()
	@Post('reset-password')
	@HttpCode(HttpStatus.OK)
	async reset(@Body() dto: ResetPasswordDto) {
		return this.passwordRecoveryService.reset(dto)
	}

	@Recaptcha()
	@Post('new-password/:token')
	@HttpCode(HttpStatus.OK)
	async newPassword(
		@Param('token') token: string,
		@Body() dto: NewPasswordDto
	) {
		return this.passwordRecoveryService.newPassword(dto, token)
	}
}
