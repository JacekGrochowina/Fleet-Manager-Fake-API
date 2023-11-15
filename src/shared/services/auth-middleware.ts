import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ErrorHandler } from './error-handler.js';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token: string | undefined = req.header("auth-token");

  if (!token) {
    ErrorHandler.handleUnauthorized(res);
    return;
  }

  try {
    const verified: string | JwtPayload = jwt.verify(token, process.env.TOKEN_SECRET);
    res.locals.user = verified;
    next();
  } catch (err) {
    ErrorHandler.handleBadRequest(res, 'Invalid Token');
  }
}
