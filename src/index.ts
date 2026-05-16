import { HttpFunction } from '@google-cloud/functions-framework';
import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

// URI de conexão (Você vai pegar a mesma que usa na sua flowly_api)
const uri = process.env.MONGO_URI || "mongodb://localhost:27017/Flowly";
const client = new MongoClient(uri);

export const gerarRelatorioTarefas: HttpFunction = async (req, res) => {
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
    const relatorio = stats.reduce((acc: any, curr: any) => {
      acc[curr._id] = curr.quantidade;
      return acc;
    }, {});

    res.status(200).json({
      titulo: "Resumo Geral de Tarefas - Flowly",
      data_geracao: new Date().toLocaleDateString('pt-BR'),
      relatorio
    });

  } catch (error: any) {
    console.error("Erro no MongoDB:", error);
    res.status(500).json({ error: "Erro ao conectar com o banco de dados" });
  } finally {
    // Importante: Em Cloud Functions, muitas vezes não fechamos a conexão global
    // se quisermos aproveitar o "warm start", mas para o seu teste, está ok.
    await client.close();
  }
};