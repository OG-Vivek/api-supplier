import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
// import { Constants } from 'src/util/constants';

@Injectable()
export class ResponseMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res.removeHeader('X-Powered-By');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', '');
    res.setHeader('Feature-Policy', '');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Content-Security-Policy',"default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval'; img-src 'self' https: data: http:; style-src 'self' https: 'unsafe-inline'; font-src 'self' https: data:; script-src 'self' https: 'unsafe-inline' 'unsafe-eval'; connect-src 'self' https: http:;");
    next();
  }
}
