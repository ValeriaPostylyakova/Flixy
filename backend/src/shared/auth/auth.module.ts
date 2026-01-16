import { forwardRef, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha'
import { UserService } from 'src/models/user/user.service'
import { getProvidersConfig } from 'src/shared/configs/providers.config'
import { getRecaptchaSecret } from 'src/shared/configs/recaptcha.config'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { ProviderModule } from './provider/provider.module'

import { MailService } from 'src/shared/libs/mail/mail.service'
import { EmailConfirmationModule } from './email-confirmation/email-confirmation.module'
import { TwoFactorAuthService } from './two-factor-auth/two-factor-auth.service'

@Module({
	imports: [
		ProviderModule.registerAsync({
			imports: [ConfigModule],
			useFactory: getProvidersConfig,
			inject: [ConfigService]
		}),

		GoogleRecaptchaModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getRecaptchaSecret,
			inject: [ConfigService]
		}),
		forwardRef(() => EmailConfirmationModule)
	],
	controllers: [AuthController],
	providers: [AuthService, UserService, MailService, TwoFactorAuthService],
	exports: [AuthService]
})
export class AuthModule {}
