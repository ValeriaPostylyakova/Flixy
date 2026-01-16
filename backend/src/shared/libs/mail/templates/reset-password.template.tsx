import { Html, Body, Heading, Text, Link } from '@react-email/components'
import React from 'react'

interface Props {
	domain: string
	token: string
}

export function ResetPasswordTemplates({ domain, token }: Props) {
	const confirmLink = `${domain}/auth/new-password?token=${token}`

	return (
		<Html>
			<Body>
				<Heading>Сброс пароля</Heading>
				<Text>Пожалуйста, нажмите на ссылку ниже, чтобы сбросить пароль.</Text>
				<Link href={confirmLink}>Подтвердить</Link>
				<Text>
					Эта ссылка действительна в течение 1 часа. Если вы не запрашивали
					сброс пароля, просто проигнорируйте это письмо.
				</Text>
				<Text>Спасибо за использование нашего сервиса!</Text>
			</Body>
		</Html>
	)
}
