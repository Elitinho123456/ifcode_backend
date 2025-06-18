import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    throw new Error('FATAL ERROR: JWT_SECRET não está definido nas variáveis de ambiente.');
}

export interface AuthenticatedRequest extends Request {
    user?: { id: number; username: string };
}

// SOLUÇÃO: Adicione o tipo de retorno explícito ': void'
export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Token de acesso não fornecido.' });
        return; // Use um "return" vazio para parar a execução e corresponder ao tipo 'void'
    }

    jwt.verify(token, jwtSecret, (err: any, user: any) => {
        if (err) {
            res.status(403).json({ message: 'Token inválido ou expirado.' });
            return; // Use um "return" vazio aqui também
        }
        req.user = user;
        next();
    });
};