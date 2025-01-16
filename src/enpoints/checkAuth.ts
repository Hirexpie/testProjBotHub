import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

export interface verifyRequest extends Request {
  userId?: number;
}

export const checkToken = (req: verifyRequest, res: Response, next: NextFunction): void => {
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

export const checkAuth = (req: verifyRequest, res: Response, next: NextFunction) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    if (!token) {
        req.userId = undefined
        next();
        return
    }
    try {
        const decoded = jwt.decode(token) as {id:number};
        req.userId = decoded.id
        
        next();
    }
    catch {
        res.status(401).json({ message: 'Ошибка аутентификации' });
        return 
    }
    
   
}