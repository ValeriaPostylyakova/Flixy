import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator'

export class NewPasswordDto {
	@IsString({ message: 'Пароль должен быть строкой.' })
	@IsNotEmpty({ message: 'Пароль обязательно для заполнения.' })
	@Length(8, 32, { message: 'Пароль должен быть от 8 до 32 символов.' })
	password: string
}
