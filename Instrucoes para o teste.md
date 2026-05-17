# Instruções para o teste da Function

No postman criar uma collection de nome qualquer e criar uma request.
A request deve ser do tipo POST e na URL deverá ser colcoado a seguinte URL: 
https://relatorio-flowly-930927876011.southamerica-east1.run.app/

Em body selecionar raw e selecionar o tipo como JSON, e por fim inserir um par de chaves vazia: 
{}

Clicar em send. Deverá retornar o título, a data da geração do relatório e 3 tarefas, 1 no status de concluida, 1 no status de em_andamento e 1 no status de pendente.

(As tarefas estão armazenadas no banco de dados mongoDB Atlas).