# Funcionalidade escolhida

Foi escolhida a criação de um relatório que retorna as tarefas e seus status 
ao selecionar o admin responsável pela criação das tarefas

## Justificativa da arquitetura

A geração de relatórios e agregação de dados é uma tarefa pesada de leitura e processamento que consome muita CPU e memória. 
Se executada dentro da API principal, requisições simultâneas de relatórios poderiam causar lentidão ou queda na aplicação.

Isolando isso em uma Cloud Function, o processamento pesado roda em um ambiente Serverless que escala de forma independente e morre após a execução, garantindo a alta disponibilidade do sistema principal
