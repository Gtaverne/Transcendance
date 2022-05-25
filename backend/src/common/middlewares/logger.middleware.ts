import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

var jwt = require('jsonwebtoken');
const Token_Secret = process.env.JWT_Secret;

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!req.query.jwt || req.query.jwt === '') {
      console.log('Middleware: no token in that query: ', req.url);
      return res.status(413);
    } else {
      const idFromToken = jwt.verify(req.query.jwt, Token_Secret);
      // console.log('Middleware: url: ', req.url, ' id from token=', idFromToken)
      if (idFromToken) {
        next();
      } else {
        return res.status(413);
      }
    }
  }
}
