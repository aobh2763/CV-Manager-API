import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../modules/user/user.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterRequestDto } from './dto/register-request.dto';
import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserRole } from '../modules/user/user.entity';

@Injectable()
export class AuthService {
  private jwtSecret: string;
  private jwtExpiresIn: number;

  constructor(
    private jwtService: JwtService,
    private usersService: UserService,
    private configService: ConfigService,
  ) {
    this.jwtSecret = this.configService.get<string>('auth.jwtSecret', {
      infer: true,
    })!;
    this.jwtExpiresIn = 60 * 60 * 24;
  }

  async decodeToken(token: string): Promise<{ id: number; role: UserRole }> {
    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: this.jwtSecret,
      });
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  async login(loginRequest: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.usersService.findOneByEmail(loginRequest.email);

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
        id: user.id,
        role: user.role,
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
    if (registerRequest.username) {
      await this.usersService.createWithDto({
        username: registerRequest.username,
        email: registerRequest.email,
        password: registerRequest.password,
        role: UserRole.USER, // admin accounts should be predefined i think
      });
    }
  }
}
