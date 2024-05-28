import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Response, Request } from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

export class AuthenticationGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, @Inject(JwtService) private readonly jwtService: JwtService,
  ) { }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  private validateRequest(request: Request): any {
    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid token format');
    }
    const token = authHeader.split(' ')[1];
    try {
      const decodedToken = this.jwtService.verify(token, { secret: process.env.JWT_KEY });
      if(!decodedToken){
        throw new UnauthorizedException('Invalid token format');
      }
      request.headers.userId = decodedToken.id;
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