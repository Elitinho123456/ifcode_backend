import { Router, Request, Response } from 'express';
import axios from 'axios';

const router = Router();

const JUDGE0_API_URL = process.env.JUDGE0_API_URL;
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST;

interface Judge0SubmissionResponse {
    token: string;
}

// Endpoint para compilar e executar o código
router.post("/run-code", async (req: Request, res: Response) => {

    const { code } = req.body;

    try {
        const response = await axios.post<Judge0SubmissionResponse>(
            `${JUDGE0_API_URL}/submissions`,
            {
                source_code: code,
                language_id: 63, // JavaScript
                stdin: '',
                expected_output: null,
                cpu_time_limit: 2,
                memory_limit: 128000
            },
            {
                headers: {
                    'X-RapidAPI-Key': RAPIDAPI_KEY,
                    'X-RapidAPI-Host': RAPIDAPI_HOST,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.status(200).json({ token: response.data.token });

    } catch (error: any) {
        console.error('Erro ao enviar submissão ao Judge0:', error.response?.data || error.message);
        res.status(500).json({
            error: 'Erro ao processar a submissão',
            details: error.response?.data || error.message
        });
    }
});

// Endpoint para buscar o resultado da submissão
router.get('/submission-result/:token', async (req: Request, res: Response) => {
    const { token } = req.params;

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

    } catch (error: any) {
        console.error('Erro ao buscar resultado do Judge0:', error.response?.data || error.message);
        res.status(500).json({
            error: 'Erro ao buscar o resultado da submissão',
            details: error.response?.data || error.message
        });
    }
});

export default router;