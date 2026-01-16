import { Html, Body, Heading, Text, Link } from '@react-email/components'
import React from 'react'

interface Props {
	domain: string
	token: string
}

export function ConfirmationTemplates({ domain, token }: Props) {
	const confirmLink = `${domain}/auth/confirmation?token=${token}`

	return (
		<Html>
			<Body>
				<Heading>Подтверждение почты</Heading>
				<Text>
					Пожалуйста, нажмите на ссылку ниже, чтобы подтвердить свой адрес
					электронной почты.
				</Text>
				<Link href={confirmLink}>Подтвердить</Link>
				<Text>
					Эта ссылка действительна в течение 1 часа. Если вы не запрашивали
					подтверждение, просто проигнорируйте это письмо.
				</Text>
				<Text>Спасибо за использование нашего сервиса!</Text>
			</Body>
		</Html>
	)
}
