import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthUserDto } from './dto/auth-user.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserRepository extends Repository<User> {
    constructor(dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }

    async signUp({ username, password }: AuthUserDto): Promise<User> {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = this.create({ username, password: hashedPassword });

        try {
            return await this.save(user);
        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException('해당 username은 이미 존재합니다.');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async signIn({ username, password }: AuthUserDto, jwtService: JwtService): Promise<{ accessToken: string }> {
        const user = await this.findOne({ where: { username } });

        if (user && (await bcrypt.compare(password, user.password))) {
            const payload = { username };
            const accessToken = await jwtService.sign(payload);
            return { accessToken };
        } else {
            throw new UnauthorizedException('로그인 실패');
        }
    }
}
