// src/Routes/userRoutes.ts
import { Router, Response } from 'express';
import pool from '../DataBase/db'; // Conexão com o banco de dados
import bcrypt from 'bcrypt'; // Biblioteca para hash de senhas
import { authenticateToken, AuthenticatedRequest} from '../middleware/authMiddleware'; // Middleware para autenticação de token JWT
import upload from '../middleware/uploadMiddleware'; // Middleware para upload de arquivos
import { uploadAvatar } from '../Controllers/userController'

const router = Router();
const saltRounds = 10;

// ROTA PARA BUSCAR DADOS DO PERFIL
router.get('/profile', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {

    try {
        // Busca os dados do usuário autenticado
        const [rows]: any = await pool.query(
            // FIX: Add profilePictureUrl to the SELECT statement
            'SELECT id, username, email, displayedName, phone, profilePictureUrl FROM users WHERE id = ?',
            [req.user!.id]
        );

        // Se não encontrar o usuário, retorna 404
        if (rows.length === 0) {
            res.status(404).json({ message: 'Usuário não encontrado.' });
            return;
        }

        // Se encontrar, retorna os dados do usuário
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


// ROTA PARA UPLOAD DA FOTO DE PERFIL
// Esta rota permite que o usuário faça upload de uma foto de perfil
router.post('/profile/upload-picture', authenticateToken, upload.single('profilePicture'), async (req: AuthenticatedRequest, res: Response) => {

    if (!req.file) {
        res.status(400).json({ message: 'Nenhum arquivo foi enviado.' });
        return;
    }

    try {

        // O caminho do arquivo é relativo à pasta 'public'
        const imageUrl = `/uploads/avatars/${req.file.filename}`;

        // Atualiza a URL da foto de perfil no banco de dados
        await pool.query(
            'UPDATE users SET profilePictureUrl = ? WHERE id = ?',
            [imageUrl, req.user!.id]
        );

        // Retorna a URL da nova imagem para o frontend
        res.status(200).json({
            message: 'Foto de perfil atualizada com sucesso!',
            profilePictureUrl: imageUrl
        });

    } catch (error) {
        console.error('Erro ao fazer upload da foto de perfil:', error);
        res.status(500).json({ message: 'Erro interno no servidor ao salvar a foto.' });
    }
});

router.put('/avatar', authenticateToken, upload.single('avatar'), uploadAvatar);

export default router;