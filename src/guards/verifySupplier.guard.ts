import { CanActivate, ExecutionContext, UnauthorizedException, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import {Request } from 'express';
import * as dotenv from 'dotenv';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Supplier } from 'src/model/supplier.model';
dotenv.config();

export class verifySupplierGuard implements CanActivate {
  constructor(@Inject(JwtService) private readonly jwtService: JwtService,
  @InjectModel('Supplier') private readonly userModel: Model<Supplier>,
  ) { }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  async validateRequest(request: Request) {
    const authHeader = request.headers['x-access-token'] as string;
    if (!authHeader) {
      throw new UnauthorizedException('Invalid token format');
    }
    try {
      const decodedToken = this.jwtService.verify(authHeader, { secret: process.env.JWT_KEY });
      if(!decodedToken){
        throw new UnauthorizedException('Invalid token format');
      }
      let supplier = await this.userModel.findById(decodedToken.id);
      if(!supplier)
        return false;
      request.headers.supId = supplier.id
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