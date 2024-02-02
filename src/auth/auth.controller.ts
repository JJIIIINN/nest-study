import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { User } from './user.entity';
import { AuthService } from './auth.service';
import { AuthUserDto } from './dto/auth-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/signup')
    @UsePipes(ValidationPipe)
    signUp(@Body() authUserDto: AuthUserDto): Promise<User> {
        return this.authService.signUp(authUserDto);
    }

    @Post('/signin')
    signIn(@Body() authUserDto: AuthUserDto): Promise<{ accessToken: string }> {
        return this.authService.signIn(authUserDto);
    }

    @Post('/test')
    @UseGuards(AuthGuard())
    test(@GetUser() user: User) {
        console.log(user);
    }
}
