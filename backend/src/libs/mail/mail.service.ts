import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { render } from '@react-email/components'
import { ConfirmationTemplates } from './templates/confirmation.template'
import { ResetPasswordTemplates } from './templates/reset-password.template'

@Injectable()
export class MailService {
	public constructor(
		private readonly mailerService: MailerService,
		private readonly configService: ConfigService
	) {}

	public async sendConfirmationEmail(email: string, token: string) {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
		const html = await render(ConfirmationTemplates({ domain, token }))

		return this.sendMail(email, 'Подтверждение почты', html)
	}

	public async sendResetPassword(email: string, token: string) {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
		const html = await render(ResetPasswordTemplates({ domain, token }))

		return this.sendMail(email, 'Сброс пароля', html)
	}

	public sendMail(email: string, subject: string, text: string) {
		return this.mailerService.sendMail({
			to: email,
			subject,
			text
		})
	}
}
