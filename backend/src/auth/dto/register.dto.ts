import {
	IsEmail,
	IsNotEmpty,
	IsString,
	Length,
	Validate,
} from 'class-validator'
import { IsValidatePassword } from '../../libs/common/decorators/is-validate-password'

export class RegisterDto {
	@IsString({ message: 'Имя должно быть строкой.' })
	@IsNotEmpty({ message: 'Имя обязательно для заполнения.' })
	name: string

	@IsString({ message: 'Email должен быть строкой.' })
	@IsNotEmpty({ message: 'Email обязательно для заполнения.' })
	@IsEmail({}, { message: 'Некорректный email.' })
	email: string

	@IsString({ message: 'Пароль должен быть строкой.' })
	@IsNotEmpty({ message: 'Пароль обязательно для заполнения.' })
	@Length(8, 32, { message: 'Пароль должен быть от 8 до 32 символов.' })
	password: string

	@IsString({ message: 'Пароль должен быть строкой.' })
	@IsNotEmpty({ message: 'Пароль обязательно для заполнения.' })
	@Length(8, 32, { message: 'Пароль должен быть от 8 до 32 символов.' })
	@Validate(IsValidatePassword, {
		message: 'Пароли не совпадают.',
	})
	confirmPassword: string
}
