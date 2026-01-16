import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { RedisStore } from 'connect-redis'
import session from 'express-session'
import ms from 'ms'
import { createClient } from 'redis'
import { AppModule } from './app.module'
import { parseBoolean } from './shared/libs/common/utils/parse-boolean'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.setGlobalPrefix('api')

	const config = app.get(ConfigService)

	const redisClient = createClient({
		url: config.getOrThrow<string>('REDIS_URL')
	})
	redisClient.on('error', err => console.error('Redis Client Error', err))
	await redisClient.connect()

	const store = new RedisStore({
		client: redisClient,
		prefix: config.getOrThrow<string>('SESSION_FOLDER')
	})

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true
		})
	)

	app.use(
		session({
			store,
			secret: config.getOrThrow<string>('SESSION_SECRET'),
			name: config.getOrThrow<string>('SESSION_NAME'),
			resave: false,
			saveUninitialized: false,
			cookie: {
				maxAge: ms(config.getOrThrow<string>('SESSION_MAX_AGE')),
				httpOnly: parseBoolean(config.getOrThrow<string>('SESSION_HTTP_ONLY')),
				secure: parseBoolean(config.getOrThrow<string>('SESSION_SECURE')),
				sameSite: 'lax'
			}
		})
	)

	app.enableCors({
		origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
		credentials: true,
		exposedHeaders: ['set-cookie']
	})

	await app.listen(config.getOrThrow<number>('APPLICATION_PORT'))
}

bootstrap()
