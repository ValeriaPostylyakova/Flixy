import { Prisma } from 'generated/prisma/client'

export type TUserWithAccount = Prisma.UserGetPayload<{
	include: { account: true }
}>
