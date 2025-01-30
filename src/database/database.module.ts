import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.getOrThrow('DB_HOST'),
                port: +configService.getOrThrow<Number>('DB_PORT'),
                username: configService.getOrThrow('DB_USER'),
                password: configService.getOrThrow('DB_PASSWORD'),
                database: configService.getOrThrow('DB_NAME'),
                entities:[User],
                synchronize: true,
            }),
            inject: [ConfigService],
        }),
    ],
})
export class DatabaseModule {}
