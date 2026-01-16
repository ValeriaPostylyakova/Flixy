import {
	BadRequestException,
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Query,
	Req,
	Res,
	UseGuards
} from '@nestjs/common'
import { Recaptcha } from '@nestlab/google-recaptcha'
import type { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { ProviderGuard } from 'src/shared/guards/provider.guard'
import { ProviderService } from './provider/provider.service'
import { ConfigService } from '@nestjs/config'

@Controller('auth')
export class AuthController {
	public constructor(
		private readonly authService: AuthService,
		private readonly providerService: ProviderService,
		private readonly configService: ConfigService
	) {}

	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	@Recaptcha()
	public async register(@Req() req: Request, @Body() dto: RegisterDto) {
		return this.authService.register(req, dto)
	}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	@Recaptcha()
	public async login(@Req() req: Request, @Body() dto: LoginDto) {
		return this.authService.login(req, dto)
	}

	@UseGuards(ProviderGuard)
	@Get('oauth/connect/:provider')
	@HttpCode(HttpStatus.OK)
	public async connect(@Param('provider') provider: string) {
		const providerInstance = this.providerService.findByService(provider)

		return {
			url: providerInstance?.getAuthorizeUrl()
		}
	}

	@UseGuards(ProviderGuard)
	@Get('oauth/callback/:provider')
	@HttpCode(HttpStatus.OK)
	public async callback(
		@Req() req: Request,
		@Res() res: Response,
		@Query('code') code: string,
		@Param('provider') provider: string
	) {
		if (!code) {
			throw new BadRequestException('Не был передан код авторизации.')
		}

		await this.authService.extractProfileFromCode(req, provider, code)

		return res.redirect(
			`${this.configService.getOrThrow<string>('ALLOWED_ORIGIN')}/dashboard`
		)
	}

	@Post('logout')
	@HttpCode(HttpStatus.OK)
	public async logout(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response
	) {
		return this.authService.logout(req, res)
	}
}
