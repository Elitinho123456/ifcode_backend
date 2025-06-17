import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './Users/authRoutes';
import codeRoutes from './Users/codeRoutes';
import tarefaRoutes from './Users/tarefaRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/code', codeRoutes);
app.use('/api/tarefas', tarefaRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});