import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import path from 'path';

// Define o tipo do arquivo para o callback do fileFilter
type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

// Configuração de armazenamento do Multer
const storage = multer.diskStorage({
    
    // Define a pasta de destino para os arquivos
    destination: (req: Request, file: Express.Multer.File, cb: DestinationCallback): void => {
        cb(null, 'public/uploads/avatars/');
    },

    // Define o nome do arquivo para evitar colisões de nomes
    filename: (req: Request, file: Express.Multer.File, cb: FileNameCallback): void => {

        // Gera um nome único para o arquivo usando o ID do usuário e a data atual
        const user = (req as any).user;
        const uniqueSuffix = `${user.id}-${Date.now()}${path.extname(file.originalname)}`;

        cb(null, `avatar-${uniqueSuffix}`); // Define o nome do arquivo como 'avatar-<user_id>-<timestamp>.<ext>'

    }
});

// Filtro para validar o tipo do arquivo
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {

    // Verifica se o arquivo é uma imagem
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // Aceita o arquivo
    } else {
        cb(new Error('Tipo de arquivo inválido. Apenas imagens são permitidas!')); // Rejeita o arquivo
    }

};

// Configuração final do Multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10 // Limite de 10 MB para o tamanho do arquivo
    },
    fileFilter: fileFilter
});

export default upload;