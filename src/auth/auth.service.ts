import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterRequestDto } from './dto/register-request.dto';
import { HttpStatus, Injectable, UnprocessableEntityException } from '@nestjs/common';

@Injectable()
export class AuthService {
  private jwtSecret: string;
  private jwtExpiresIn: number;

  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService
  ) {
    this.jwtSecret = this.configService.get<string>('auth.jwtSecret', { infer: true })!;
    this.jwtExpiresIn = this.configService.get<number>('auth.jwtExpiresIn', { infer: true })!;
  }

  async login(loginRequest: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.usersService.findOne(loginRequest.email);

    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          email: 'notFound',
        },
      });
    }

    const isValidPassword = await bcrypt.compare(
      loginRequest.password,
      user.password,
    );

    if (!user.password || !isValidPassword) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          password: 'incorrectPassword',
        },
      });
    }

    const token = await this.jwtService.signAsync(
      {
        id: loginRequest.email,
      },
      {
        secret: this.jwtSecret,
        expiresIn: this.jwtExpiresIn,
      },
    );

    return {
      accessToken: token,
      tokenExpiresIn: this.jwtExpiresIn,
    };
  }

  async register(registerRequest: RegisterRequestDto) {
    // TODO: create user
  }
}

