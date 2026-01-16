export type TypeUserInfo = {
	readonly id: string
	readonly email: string
	readonly name: string
	readonly picture: string
	readonly access_token?: string | null
	readonly refresh_token?: string
	readonly expires_at?: number
	readonly provider: string
}
