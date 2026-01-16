import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class ResetPasswordDto {
	@IsString({ message: 'Email должен быть строкой.' })
	@IsNotEmpty({ message: 'Email обязательно для заполнения.' })
	@IsEmail({}, { message: 'Некорректный email.' })
	email: string
}
