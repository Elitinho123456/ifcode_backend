import express, { Response, Request } from 'express';
import axios from 'axios';
import cors from 'cors';
import ts from 'typescript';
import dotenv from 'dotenv';
dotenv.config()

const app = express();
const PORT = process.env.PORT;

// Configuração do Judge0
const JUDGE0_API_URL = process.env.JUDGE0_API_URL;
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST;
app.use(cors()); // Permite requisições do seu frontend (React)
app.use(express.json()); // Habilita o parsing de JSON no corpo da requisição

// Endpoint para compilar e executar o código
app.post("/run-code",async (req:Request,res:Response)=>{
    const { code } = req.body;

    try {
        let sourceCodeToSend = code;
        console.log(sourceCodeToSend)
        //let finalLanguageId = language_id; // Assume que 71 é JavaScript padrão

    //    if (language_id === 74) {
    //         const transpileResult = ts.transpileModule(code, {
    //             compilerOptions: {
    //                 target: ts.ScriptTarget.ES2016,
    //                 module: ts.ModuleKind.CommonJS
    //             }
    //         });
    //         sourceCodeToSend = transpileResult.outputText;
    //         finalLanguageId = 63;
    //     } else if (language_id === "typescript") {
    //         const transpileResult = ts.transpileModule(code, {
    //             compilerOptions: {
    //                 target: ts.ScriptTarget.ES2016,
    //                 module: ts.ModuleKind.CommonJS
    //             }
    //         });
    //         sourceCodeToSend = transpileResult.outputText;
    //         finalLanguageId = 63;
    //     }


        const submissionData = {
            source_code: sourceCodeToSend,
             language_id: 63, // ID para JavaScript (Node.js)
            // stdin: stdin,
            // expected_output: expected_output,
            cpu_time_limit: 2, // Limite de tempo em segundos
            memory_limit: 128000, // Limite de memória em KB (128 MB)
            base64_encoded: false // Não estamos codificando em base64 aqui, mas você pode se precisar
        };

        const options = {
            method: 'POST',
            url: `http://judge0-ce.p.rapidapi.com/submissions`,
            params: { base64_encoded: 'false', fields: '*' },
            headers: {
                'content-type': 'application/json',
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'X-RapidAPI-Host': RAPIDAPI_HOST
            },
            data: submissionData
        };

        const judge0Response = await axios.request(options);
        console.log(judge0Response)
        const token = judge0Response;
        console.log(token)

        // Imediatamente envie o token de volta para o frontend
        res.status(200).json({ token });

    } catch (error: any) {
        console.error('Erro ao enviar submissão ao Judge0:', error.response?.data || error.message);
        res.status(500).json({ error: 'Erro ao processar a submissão', details: error.response?.data || error.message });
    }
})

// Endpoint para buscar o resultado da submissão
app.get('/submission-result/:token', async (req:Request, res:Response) => {
    const { token } = req.params;

    try {
        const options = {
            method: 'GET',
            url: `${JUDGE0_API_URL}/submissions/${token}`,
            params: { base64_encoded: 'false', fields: '*' },
            headers: {
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'X-RapidAPI-Host': RAPIDAPI_HOST
            }
        };

        const judge0Response = await axios.request(options);
        res.status(200).json(judge0Response.data);

    } catch (error: any) {
        console.error('Erro ao buscar resultado do Judge0:', error.response?.data || error.message);
        res.status(500).json({ error: 'Erro ao buscar o resultado da submissão', details: error.response?.data || error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Backend rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});