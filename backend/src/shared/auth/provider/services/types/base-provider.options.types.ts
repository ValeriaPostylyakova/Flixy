export type TypeBaseProviderOptions = {
	readonly name: string
	readonly authorize_url: string
	readonly access_url: string
	readonly profile_url: string
	readonly scopes: string[]
	readonly client_id: string
	readonly client_secret: string
}
