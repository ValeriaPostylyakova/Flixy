import {
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator'
import { RegisterDto } from 'src/auth/dto/register.dto'

@ValidatorConstraint({ name: 'IsValidatePassword', async: false })
export class IsValidatePassword implements ValidatorConstraintInterface {
	public validate(password: string, args: ValidationArguments) {
		const objest = args.object as RegisterDto
		return password === objest.confirmPassword
	}

	public defaultMessage(args?: ValidationArguments) {
		return 'Пароли не совпадают.'
	}
}
