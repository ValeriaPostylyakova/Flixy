import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	Length
} from 'class-validator'

export class LoginDto {
	@IsString({ message: 'Email должен быть строкой.' })
	@IsNotEmpty({ message: 'Email обязательно для заполнения.' })
	@IsEmail({}, { message: 'Некорректный email.' })
	email: string

	@IsString({ message: 'Пароль должен быть строкой.' })
	@IsNotEmpty({ message: 'Пароль обязательно для заполнения.' })
	@Length(8, 32, { message: 'Пароль должен быть от 8 до 32 символов.' })
	password: string

	@IsOptional()
	@IsString({ message: 'Код должен быть строкой.' })
	code: string
}
