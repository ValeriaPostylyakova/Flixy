import { Inject, Injectable } from '@nestjs/common'
import { BaseOAuthService } from './services/base-oauth.service'
import * as providerConstants from './services/provider.constants'

@Injectable()
export class ProviderService {
	public constructor(
		@Inject(providerConstants.ProviderOptionsSymbol)
		private readonly options: providerConstants.TypeOptions
	) {}

	public onModuleInit() {
		for (const provider of this.options.services) {
			provider.baseUrl = this.options.baseUrl
		}
	}

	public findByService(service: string): BaseOAuthService | null {
		return (
			this.options.services.find(provider => provider.name === service) ?? null
		)
	}
}
