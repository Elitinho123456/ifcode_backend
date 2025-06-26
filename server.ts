import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './Routes/authRoutes';
import codeRoutes from './Routes/codeRoutes';
import tarefaRoutes from './Routes/tarefaRoutes';
import userRoutes from './Routes/userRoutes';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public'))); // Serve arquivos estáticos da pasta 'public'

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/code', codeRoutes);
app.use('/api/tarefas', tarefaRoutes);
app.use('/api/user', userRoutes);


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});