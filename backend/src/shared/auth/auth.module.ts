import { forwardRef, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha'
import { getProvidersConfig } from 'src/shared/configs/providers.config'
import { getRecaptchaSecret } from 'src/shared/configs/recaptcha.config'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { ProviderModule } from './provider/provider.module'

import { UserModule } from 'src/models/user/user.module'
import { MailService } from 'src/shared/libs/mail/mail.service'
import { EmailConfirmationModule } from './email-confirmation/email-confirmation.module'
import { TwoFactorAuthModule } from './two-factor-auth/two-factor-auth.module'

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
		forwardRef(() => EmailConfirmationModule),
		UserModule,
		TwoFactorAuthModule
	],
	controllers: [AuthController],
	providers: [AuthService, MailService],
	exports: [AuthService]
})
export class AuthModule {}
