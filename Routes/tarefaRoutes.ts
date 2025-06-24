import { Router, Request, Response } from 'express';
import pool from '../DataBase/db';
import { authenticateToken, AuthenticatedRequest } from '../middleware/authMiddleware'; 

const router = Router();

// Rota para buscar as tarefas
router.get('/', async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query('SELECT * FROM tarefas ORDER BY dataCriacao DESC');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erro ao buscar tarefas:', error);
        res.status(500).json({ message: 'Erro interno no servidor' });
    }
});

// Rota para criar uma nova tarefa (função de administrador ainda não implementada)
router.post('/', async (req: Request, res: Response) => {

    const {
        titulo,
        descricao,
        dataLimite,
        prioridade,
        categoria,
        stdoutput
    } = req.body;

    if (!titulo || !descricao || !prioridade || !categoria || !stdoutput) { // Verifica se os campos obrigatórios estão preenchidos

        res.status(400).json({ message: 'Campos obrigatórios estão faltando.' });
        return;

    }

    try {

        // Insere a nova tarefa no banco de dados
        const [result] = await pool.query(
            'INSERT INTO tarefas (titulo, descricao, dataLimite, prioridade, categoria, stdoutput) VALUES (?, ?, ?, ?, ?, ?)',
            [titulo, descricao, dataLimite || null, prioridade, categoria, stdoutput]
        );

        res.status(201).json({ message: 'Tarefa criada com sucesso!', id: (result as any).insertId });

    } catch (error) {

        console.error('Erro ao criar tarefa:', error);
        res.status(500).json({ message: 'Erro interno no servidor' });

    }

});

// Rota para marcar uma tarefa como concluída
router.patch('/:id/concluir', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    
    const { id } = req.params; // ID da tarefa
    const { stdinput } = req.body; // Apenas o código enviado pelo usuário é necessário no corpo
    
    // 2. Obtemos o nome de usuário diretamente do token JWT, que é mais seguro.
    const autorUsername = req.user!.username; 

    if (!stdinput) { // Verifica se o input do código está preenchido
        res.status(400).json({ message: 'O código da solução é obrigatório.' });
        return;
    }

    try {
        await pool.query(
            'UPDATE tarefas SET concluida = TRUE, dataConclusao = CURRENT_TIMESTAMP, autor = ?, stdinput = ? WHERE id = ?',
            [autorUsername, stdinput, id]
        );
        res.status(200).json({ message: 'Tarefa concluída com sucesso!' });
    } catch (error) {
        console.error('Erro ao concluir tarefa:', error);
        res.status(500).json({ message: 'Erro interno no servidor' });
    }
});

export default router;