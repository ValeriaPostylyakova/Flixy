import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from './shared/auth/auth.module'
import { ProviderModule } from './shared/auth/provider/provider.module'
import { PrismaModule } from './shared/database/prisma/prisma.module'
import { IS_DEV_ENV } from './shared/libs/common/utils/is-dev.util'

import { UserModule } from './models/user/user.module'
import { EmailConfirmationModule } from './shared/auth/email-confirmation/email-confirmation.module'
import { PasswordRecoveryModule } from './shared/auth/password-recovery/password-recovery.module'
import { TwoFactorAuthModule } from './shared/auth/two-factor-auth/two-factor-auth.module'
import { MailModule } from './shared/libs/mail/mail.module'

@Module({
	imports: [
		PrismaModule,
		ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: !IS_DEV_ENV }),
		AuthModule,
		UserModule,
		ProviderModule,
		MailModule,
		EmailConfirmationModule,
		PasswordRecoveryModule,
		TwoFactorAuthModule
	]
})
export class AppModule {}
