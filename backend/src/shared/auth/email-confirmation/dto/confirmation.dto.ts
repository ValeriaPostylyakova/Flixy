import { IsNotEmpty, IsString } from 'class-validator'

export class ConfirmationDto {
	@IsNotEmpty({ message: 'Поле токена не может быть пустым' })
	@IsString({ message: 'Токен должен быть строкой' })
	token: string
}
