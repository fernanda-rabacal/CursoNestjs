import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  public async findAll() {
    return this.usersService.findAll();
  }

  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  public async signup(@Body() signupDTO: SignupDto) {
    return this.usersService.signup(signupDTO);
  }

  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  public async signin(@Body() signinDTO: SigninDto) {
    return this.usersService.signin(signinDTO);
  }
}
