import { forwardRef, Module } from '@nestjs/common'
import { UserService } from 'src/models/user/user.service'
import { MailModule } from 'src/shared/libs/mail/mail.module'
import { MailService } from 'src/shared/libs/mail/mail.service'
import { AuthModule } from '../auth.module'
import { EmailConfirmationController } from './email-confirmation.controller'
import { EmailConfirmationService } from './email-confirmation.service'

@Module({
	imports: [MailModule, forwardRef(() => AuthModule)],
	controllers: [EmailConfirmationController],
	providers: [EmailConfirmationService, UserService, MailService],
	exports: [EmailConfirmationService]
})
export class EmailConfirmationModule {}
