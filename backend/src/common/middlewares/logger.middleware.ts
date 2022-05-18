import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // console.log('Hey from LoggerMiddleware');
    // if (req.cookies) {
    //   // Il faut vraiment faire fonctionner cette... chose
    //   console.log('Cookies read in middleware: ' + req.cookies['jwt']);
    // }

    next();
  }
}
