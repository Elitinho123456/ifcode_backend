import express, { Response, Request } from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config()

interface Judge0SubmissionResponse {
    token: string;
    status?: {
        id: number;
        description: string;
    };
    stdout?: string | null;
    stderr?: string | null;
    compile_output?: string | null;
}

const app = express();
const PORT = process.env.PORT;

// Chaves
const JUDGE0_API_URL = process.env.JUDGE0_API_URL;
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST;
app.use(cors());
app.use(express.json());

// Endpoint, compilar e executar o código
app.post("/run-code", async (req: Request, res: Response) => {

    const { code } = req.body;


    try {


        const response = await axios.post<Judge0SubmissionResponse>(
            "https://judge0.p.rapidapi.com/submissions",
            {
                source_code: code,
                language_id: 63,
                stdin: '',
                expected_output: null,
                cpu_time_limit: 2,
                memory_limit: 128000,
                base64_encoded: true,
            },
            {
                params: {
                    base64_encoded: "true",
                    fields: "token",
                },
                headers: {
                    "content-type": "application/json",
                    "X-RapidAPI-Key": RAPIDAPI_KEY,
                    "X-RapidAPI-Host": RAPIDAPI_HOST,
                },
            }
        );;

        const token = response.data.token;
        
        res.status(200).json({ token });


    } catch (error: any) {

        console.error('Erro ao enviar submissão ao Judge0:', error.response?.data || error.message);

        res.status(500).json({
            error: 'Erro ao processar a submissão',
            details: error.response?.data || error.message
        });
    }
});

// Endpoint, buscar o resultado da submissão
app.get('/submission-result/:token', async (req: Request, res: Response) => {

    const { token } = req.params;
    console.log(token)

    try {

        const options = {

            method: 'GET',
            url: `${JUDGE0_API_URL}/submissions/${token}`,
            params: {
                base64_encoded: "true",
                fields: "*"
            },
            headers: {
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'X-RapidAPI-Host': RAPIDAPI_HOST,
            }

        };

        const judge0Response = await axios.request(options);
        res.status(200).json(judge0Response.data);
        console.log(judge0Response)

    } catch (error: any) {

        console.error('Erro ao buscar resultado do Judge0:', error.response?.data || error.message);
        res.status(500).json({ error: 'Erro ao buscar o resultado da submissão', details: error.response?.data || error.message });

    }

});

app.listen(PORT, () => {

    console.log(`Backend rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);

});