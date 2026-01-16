import { forwardRef, Module } from '@nestjs/common'
import { UserService } from 'src/models/user/user.service'
import { MailModule } from 'src/shared/libs/mail/mail.module'
import { MailService } from 'src/shared/libs/mail/mail.service'
import { AuthModule } from '../auth.module'
import { EmailConfirmationController } from './email-confirmation.controller'
import { EmailConfirmationService } from './email-confirmation.service'
import { UserModule } from 'src/models/user/user.module'
import { EmailConfirmationRepository } from './email-confirmation.repository'
import { TokensRepository } from '../tokens/tokens.repository'

@Module({
	imports: [MailModule, forwardRef(() => AuthModule), UserModule],
	controllers: [EmailConfirmationController],
	providers: [
		EmailConfirmationService,
		MailService,
		EmailConfirmationRepository,
		TokensRepository
	],
	exports: [EmailConfirmationService]
})
export class EmailConfirmationModule {}
