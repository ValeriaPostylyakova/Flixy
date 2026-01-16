import { Module } from '@nestjs/common'
import { PasswordRecoveryController } from './password-recovery.controller'
import { PasswordRecoveryService } from './password-recovery.service'

import { UserModule } from 'src/models/user/user.module'
import { MailService } from 'src/shared/libs/mail/mail.service'
import { TokensRepository } from '../tokens/tokens.repository'
import { PasswordRecoveryRepository } from './password-recovery.repository'

@Module({
	imports: [UserModule],
	controllers: [PasswordRecoveryController],
	providers: [
		PasswordRecoveryService,
		MailService,
		TokensRepository,
		PasswordRecoveryRepository
	],
	exports: [PasswordRecoveryService]
})
export class PasswordRecoveryModule {}
