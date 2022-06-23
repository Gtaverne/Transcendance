import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

var jwt = require('jsonwebtoken');
const Token_Secret = process.env.JWT_Secret;

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!req.query.jwt || req.query.jwt === '') {
      console.log('Middleware: no token in that query: ', req.url);
      return res.status(403).end();
    } else {
      try {
        const idFromToken = jwt.verify(req.query.jwt, Token_Secret);
        if (idFromToken > 0) {
          next();
        } else {
          console.log('Middleware: invalid token in  ', req.url);
          return res.status(403).end();
        }
      } catch (error) {
        console.log('Middleware: invalid token in  ', req.url);
        return res.status(403).end();
      }
    }
  }
}
