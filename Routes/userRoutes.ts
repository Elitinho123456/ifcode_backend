// src/Routes/userRoutes.ts
import { Router, Request, Response } from 'express';
import pool from '../DataBase/db';
import bcrypt from 'bcrypt';
import { authenticateToken, AuthenticatedRequest} from '../middleware/authMiddleware';

const router = Router();
const saltRounds = 10;

// Estendendo a interface Request para incluir a propriedade 'user'

// ROTA PARA BUSCAR DADOS DO PERFIL
router.get('/profile', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const [rows]: any = await pool.query(
            'SELECT id, username, email, displayedName, phone FROM users WHERE id = ?',
            [req.user!.id]
        );

        if (rows.length === 0) {
            res.status(404).json({ message: 'Usuário não encontrado.' });
            return;
        }

        const user = rows[0];
        // Ocultamos dados sensíveis por padrão no retorno
        res.status(200).json({
            ...user,
            email: user.email ? `${user.email.substring(0, 3)}...` : null,
            phone: user.phone ? `...${user.phone.slice(-4)}` : null,
        });

    } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

// ROTA PARA ATUALIZAR UM CAMPO ESPECÍFICO
router.put('/profile/update', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    const { field, value } = req.body;

    if (!field || value === undefined) {
        res.status(400).json({ message: 'O campo e o valor para atualização são obrigatórios.' });
        return;
    }

    const allowedFields = ['displayedName', 'username', 'email', 'phone'];
    if (!allowedFields.includes(field)) {
        res.status(400).json({ message: 'Campo de atualização inválido.' });
        return;
    }

    try {
        await pool.query(
            `UPDATE users SET ${field} = ? WHERE id = ?`,
            [value, req.user!.id]
        );
        res.status(200).json({ message: `${field} atualizado com sucesso!` });

    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ message: `O ${field} '${value}' já está em uso.` });
            return;
        }
        console.error(`Erro ao atualizar ${field}:`, error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

// ROTA PARA ATUALIZAR A SENHA
router.put('/profile/update-password', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
        res.status(400).json({ message: 'A nova senha deve ter pelo menos 6 caracteres.' });
        return;
    }

    try {
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        await pool.query(
            'UPDATE users SET password_hash = ? WHERE id = ?',
            [hashedPassword, req.user!.id]
        );
        res.status(200).json({ message: 'Senha atualizada com sucesso!' });

    } catch (error) {
        console.error('Erro ao atualizar senha:', error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

export default router;