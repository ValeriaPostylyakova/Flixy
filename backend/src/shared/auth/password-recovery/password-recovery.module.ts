import { Module } from '@nestjs/common'
import { UserService } from 'src/models/user/user.service'
import { PasswordRecoveryController } from './password-recovery.controller'
import { PasswordRecoveryService } from './password-recovery.service'

import { MailService } from 'src/shared/libs/mail/mail.service'

@Module({
	controllers: [PasswordRecoveryController],
	providers: [PasswordRecoveryService, UserService, MailService]
})
export class PasswordRecoveryModule {}
