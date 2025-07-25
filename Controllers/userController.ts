import { Request, Response } from 'express';
import pool from '../DataBase/db'; // Importe a sua pool de conexões com o DB

// Esta função será chamada após o middleware de upload ter processado o ficheiro
export const uploadAvatar = async (req: Request, res: Response) => {
    try {
        // O middleware de autenticação (que assumimos existir) deve adicionar o utilizador ao `req`
        const user = (req as any).user;

        // O middleware multer adiciona o ficheiro ao `req`
        const file = req.file;

        if (!file) {
            res.status(400).json({ message: 'Nenhum ficheiro foi enviado.' });
            return;
        }

        // O caminho para aceder ao ficheiro via URL.
        // O `server.ts` serve a pasta 'public', então o caminho do URL não inclui 'public'.
        const imageUrl = `/uploads/avatars/${file.filename}`;

        // Atualiza o utilizador no banco de dados com o caminho da nova imagem
        await pool.query(
            'UPDATE users SET profilePictureUrl = ? WHERE id = ?',
            [imageUrl, user.id]
        );

        res.status(200).json({
            message: 'Avatar atualizado com sucesso!',
            profilePictureUrl: imageUrl
        });

    } catch (error) {
        console.error('Erro ao fazer upload do avatar:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao atualizar o avatar.' });
    }
};