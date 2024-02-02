import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { AuthUserDto } from './dto/auth-user.dto';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private userRepository: UserRepository,
        private jwtService: JwtService,
    ) {}

    signUp(authUserDto: AuthUserDto): Promise<User> {
        return this.userRepository.signUp(authUserDto);
    }

    signIn(authUserDto: AuthUserDto): Promise<{ accessToken: string }> {
        return this.userRepository.signIn(authUserDto, this.jwtService);
    }
}
