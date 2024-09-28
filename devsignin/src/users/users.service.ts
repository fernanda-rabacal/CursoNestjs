import { SigninDto } from './dto/signin.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User } from './models/users.model';
import { AuthService } from 'src/auth/auth.service';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User')
    private readonly usersModel: Model<User>,
    private readonly authService: AuthService,
  ) {}

  public async findAll(): Promise<User[]> {
    return this.usersModel.find();
  }

  public async signup(signupDTO: SignupDto): Promise<User> {
    const user = new this.usersModel(signupDTO);

    return user.save();
  }

  public async signin(signinDTO: SigninDto): Promise<{
    name: string;
    jwtToken: string;
    email: string;
  }> {
    const user = await this.findByEmail(signinDTO.email);

    await this.validatePassword(signinDTO.password, user);

    const jwtToken = await this.authService.createAccessToken(String(user._id));

    return { name: user.name, email: user.email, jwtToken };
  }

  private async findByEmail(email: string): Promise<User> {
    const user = await this.usersModel.findOne({ email });

    if (!user) {
      throw new NotFoundException('Invalid e-mail or password');
    }

    return user;
  }

  private async validatePassword(
    password: string,
    user: User,
  ): Promise<boolean> {
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new NotFoundException('Invalid e-mail or password');
    }

    return match;
  }
}
