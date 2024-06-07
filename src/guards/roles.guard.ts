import { CanActivate, ExecutionContext, UnauthorizedException, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import {  Request } from 'express';
import * as dotenv from 'dotenv';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/model/user.model';
dotenv.config();

export class RolesGuard implements CanActivate {
  private readonly secret: string;

  constructor(
    @Inject(JwtService) private readonly jwtService: JwtService,
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {
    this.secret = process.env.JWT_KEY;
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  async validateRequest(req: Request) {
    try {
      const authorization = req.headers.authorization;
      if (!authorization || !authorization.startsWith('Bearer ')) {
        return false;
      }
      const token = authorization.split(' ')[1];
      const TokenData = await this.jwtService.verify(token, { secret: this.secret });
      let user = await this.userModel.findById(TokenData.id);
      if (!user) {
        return false;
      }
      return true;
    } catch (error) {
      console.log("error", error)
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token');
      } else {
        throw new UnauthorizedException('Unauthorized');
      }
    }
  }
}