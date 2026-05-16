"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.gerarRelatorioTarefas = void 0;
const mongodb_1 = require("mongodb");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
// URI de conexão (Você vai pegar a mesma que usa na sua flowly_api)
const uri = process.env.MONGO_URI || "mongodb://localhost:27017/Flowly";
const client = new mongodb_1.MongoClient(uri);
const gerarRelatorioTarefas = async (req, res) => {
    // Configuração básica de CORS
    res.set('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.status(204).send('');
        return;
    }
    if (req.method !== 'POST') {
        res.status(405).send({ error: 'Use POST' });
        return;
    }
    try {
        await client.connect();
        const database = client.db('Flowly'); // Nome do seu banco de dados
        const tarefasCol = database.collection('tarefas'); // Nome da sua coleção
        // Pegamos o ID do administrador ou colaborador que enviou a requisição
        const { admin_id } = req.body;
        // Query de Agregação do MongoDB (PONTO EXTRA: Conexão com DB)
        const stats = await tarefasCol.aggregate([
            // Se quiser filtrar apenas as tarefas de um admin específico, descomente a linha abaixo:
            // { $match: { criado_por: admin_id } }, 
            {
                $group: {
                    _id: "$status",
                    quantidade: { $sum: 1 }
                }
            }
        ]).toArray();
        // Formatando o resultado para ficar amigável
        const relatorio = stats.reduce((acc, curr) => {
            acc[curr._id] = curr.quantidade;
            return acc;
        }, {});
        res.status(200).json({
            titulo: "Resumo Geral de Tarefas - Flowly",
            data_geracao: new Date().toLocaleDateString('pt-BR'),
            relatorio
        });
    }
    catch (error) {
        console.error("Erro no MongoDB:", error);
        res.status(500).json({ error: "Erro ao conectar com o banco de dados" });
    }
    finally {
        // Importante: Em Cloud Functions, muitas vezes não fechamos a conexão global
        // se quisermos aproveitar o "warm start", mas para o seu teste, está ok.
        await client.close();
    }
};
exports.gerarRelatorioTarefas = gerarRelatorioTarefas;
