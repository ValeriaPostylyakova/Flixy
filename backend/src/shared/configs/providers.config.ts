import { ConfigService } from '@nestjs/config'
import { GoogleProviderService } from 'src/shared/auth/provider/services/google.provider'
import { TypeOptions } from 'src/shared/auth/provider/services/provider.constants'
import { YandexProviderService } from 'src/shared/auth/provider/services/yandex.provider'

export const getProvidersConfig = async (
	configService: ConfigService
): Promise<TypeOptions> => ({
	baseUrl: configService.getOrThrow<string>('APPLICATION_URL'),
	services: [
		new GoogleProviderService({
			client_id: configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
			client_secret: configService.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
			scopes: ['email', 'profile']
		}),
		new YandexProviderService({
			client_id: configService.getOrThrow<string>('YANDEX_CLIENT_ID'),
			client_secret: configService.getOrThrow<string>('YANDEX_CLIENT_SECRET'),
			scopes: ['login:email', 'login:avatar', 'login:info']
		})
	]
})
