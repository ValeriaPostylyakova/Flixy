import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch
} from '@nestjs/common'
import { User } from 'generated/prisma/client'
import { UserRole } from 'generated/prisma/enums'
import { Authorization } from 'src/shared/auth/decorators/auth.decorator'
import { Authorized } from 'src/shared/auth/decorators/authorized.decorator'
import { UpdateUserDto } from './dto/update-user.dto'
import { TUserWithAccount } from './types/user-with-account.type'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('profile')
	@HttpCode(HttpStatus.OK)
	@Authorization()
	public async findProfile(
		@Authorized('id') userId: string
	): Promise<TUserWithAccount | null> {
		return this.userService.findById(userId)
	}

	@Patch('update-profile')
	@HttpCode(HttpStatus.OK)
	@Authorization()
	public async updateProfile(
		@Authorized('id') userId: string,
		@Body() dto: UpdateUserDto
	): Promise<User> {
		return this.userService.update(userId, dto)
	}

	@Get('by-id/:id')
	@HttpCode(HttpStatus.OK)
	@Authorization(UserRole.ADMIN)
	public async findUserById(
		@Param('id') id: string
	): Promise<TUserWithAccount | null> {
		return this.userService.findById(id)
	}
}
