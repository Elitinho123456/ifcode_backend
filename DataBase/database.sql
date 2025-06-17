CREATE DATABASE IF NOT EXISTS codespace;

USE codespace;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tarefas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    concluida BOOLEAN NOT NULL DEFAULT FALSE,
    dataCriacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    dataConclusao TIMESTAMP NULL,
    dataLimite TIMESTAMP NULL,
    prioridade ENUM('baixa', 'media', 'alta') NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    autor VARCHAR(255),
    stdinput TEXT,
    stdoutput TEXT NOT NULL
);