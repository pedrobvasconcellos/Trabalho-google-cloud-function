## Justificativa da arquitetura

A geração de relatórios e agregação de dados é uma tarefa pesada de leitura e processamento que consome muita CPU e memória. 
Se executada dentro da API principal, requisições simultâneas de relatórios poderiam causar lentidão ou queda no chat e no Kanban em tempo real. 

Isolando isso em uma Cloud Function, o processamento pesado roda em um ambiente Serverless que escala de forma independente e morre após a execução, garantindo a alta disponibilidade do sistema principal