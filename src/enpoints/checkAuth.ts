import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

export interface verifyRequest extends Request {
  userId?: number;
}

export const checkauth = (req: verifyRequest, res: Response, next: NextFunction): void => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    

    try {
        if (!token) {
            res.status(401).json({ message: 'Ошибка аутентификации' });
            return 
        }
        const decoded = jwt.decode(token) as {id:number};
        req.userId = decoded.id
        next();
    } catch (e) {
        res.status(401).json({ message: 'Ошибка аутентификации' });
        return 
    }
};