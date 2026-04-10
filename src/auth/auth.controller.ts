import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterRequestDto } from './dto/register-request.dto';
import { Controller, Post, UseGuards, Request, Get, Body } from '@nestjs/common';

@Controller({ path: 'auth' })
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('login')
  async login(@Body() loginRequest: LoginRequestDto): Promise<LoginResponseDto> {
    return this.authService.login(loginRequest);
  }

  @Post('register')
  async register(@Body() registerRequest: RegisterRequestDto): Promise<void> {
    return this.authService.register(registerRequest);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  public me(@Request() request) {
    return request.user;
  }
}
