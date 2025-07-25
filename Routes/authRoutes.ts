import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../DataBase/db';

const router = Router();
const saltRounds = 10;
const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';

// Rota de Registro
router.post('/register', async (req: Request, res: Response) => {

    const { username, email, password, phone } = req.body; // Desestruturação do corpo da requisição

    if (!username || !email || !password || !phone) { // Verifica se todos os campos estão preenchidos

        // Se algum campo estiver vazio, retorna um erro 400
        res.status(400).json({ message: 'Todos os campos são obrigatórios' });
        return;

    }

    try {

        const hashedPassword = await bcrypt.hash(password, saltRounds); // Criptografa a senha

        // Insere o novo usuário no banco de dados
        const [result] = await pool.query(

            'INSERT INTO users (username, email, password_hash, phone, displayedName) VALUES (?, ?, ?, ?, ?)',
            [username, email, hashedPassword, phone, username]

        );

        res.status(201).json({ message: 'Usuário criado com sucesso' });

    } catch (error) {

        console.error(error);
        res.status(500).json({ message: 'Erro ao registrar usuário' });

    }

});

// Rota de Login
router.post('/login', async (req: Request, res: Response) => {

    const { username, password } = req.body;

    if (!username || !password) {

        res.status(400).json({ message: 'Usuário e senha são obrigatórios' });
        return;

    }

    try {
        // Verifica se o usuário existe
        const [rows]: any = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

        if (rows.length === 0) { // Se não encontrar o usuário, retorna um erro 401

            res.status(401).json({ message: 'Usuário ou senha inválidos' });
            return;

        }

        const user = rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password_hash); // Compara a senha fornecida com a senha criptografada no banco de dados

        if (!isPasswordValid) { // Se a senha não for válida, retorna um erro 401

            res.status(401).json({ message: 'Usuário ou senha inválidos' });
            return;

        }

        const token = jwt.sign({ id: user.id, username: user.username }, jwtSecret, { expiresIn: '1h' }); // Gera um token JWT com o ID e o nome de usuário do usuário, com validade de 1 hora

        res.status(200).json({ token });

    } catch (error) {

        console.error(error);
        res.status(500).json({ message: 'Erro ao fazer login' });
        return;
    }

});

export default router;