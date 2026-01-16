import { Module } from '@nestjs/common'
import { MailService } from 'src/shared/libs/mail/mail.service'
import { TokensRepository } from '../tokens/tokens.repository'
import { TwoFactorAuthService } from './two-factor-auth.service'

@Module({
	providers: [TwoFactorAuthService, MailService, TokensRepository],
	exports: [TwoFactorAuthService]
})
export class TwoFactorAuthModule {}
