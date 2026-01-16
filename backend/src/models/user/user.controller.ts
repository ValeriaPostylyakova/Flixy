import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch
} from '@nestjs/common'
import { UserRole } from 'generated/prisma/enums'
import { Authorization } from 'src/shared/auth/decorators/auth.decorator'
import { Authorized } from 'src/shared/auth/decorators/authorized.decorator'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('profile')
	@HttpCode(HttpStatus.OK)
	@Authorization()
	public async findProfile(@Authorized('id') userId: string) {
		return this.userService.findById(userId)
	}

	@Patch('update-profile')
	@HttpCode(HttpStatus.OK)
	@Authorization()
	public async updateProfile(
		@Authorized('id') userId: string,
		@Body() dto: UpdateUserDto
	) {
		return this.userService.update(userId, dto)
	}

	@Get('by-id/:id')
	@HttpCode(HttpStatus.OK)
	@Authorization(UserRole.ADMIN)
	public async findUserById(@Param('id') id: string) {
		return this.userService.findById(id)
	}
}
