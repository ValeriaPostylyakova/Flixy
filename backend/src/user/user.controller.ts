import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common'
import { UserRole } from 'generated/prisma/enums'
import { Authorization } from 'src/auth/decorators/auth.decorator'
import { Authorized } from 'src/auth/decorators/authorized.decorator'
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

	@Get('by-id/:id')
	@HttpCode(HttpStatus.OK)
	@Authorization(UserRole.ADMIN)
	public async findUserById(@Param('id') id: string) {
		return this.userService.findById(id)
	}
}
