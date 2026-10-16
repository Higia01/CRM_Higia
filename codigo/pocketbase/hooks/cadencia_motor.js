// pocketbase/hooks/cadencia_motor.js
// Task 1cc6e53d (SPEC-1-003): motor da cadência — RN-03 (agendamento dos passos), RN-06
// (esgotamento) e a parte de CA-1-17 desta task (nada vencido sai em lote; pausa geral segura).
// Cron motor_cadencia_15min (*/15 * * * * UTC): para cada oportunidade `ativo`, agenda os passos
// da cadência ativa que ainda não têm registro (chave de idempotência
// oportunidade:passo:canal:rodada — índice único em envios.chave_idempotencia).
// Passo `auto` → envios (status agendado, agendado_para às janela_inicio local);
// passo `tarefa` → tarefas (status aberta, vencimento na data, mensagem_sugerida do modelo).
// Datas: D1 no próprio dia se ainda dentro da janela (America/Sao_Paulo), senão próximo dia
// útil; Dn = n-ésimo dia útil a partir de D1, pulando sábado/domingo e a lista `feriados`.
// RN-06: regra de esgotamento (dias_sem_resposta) vencida → esgotado, etapa perdido com
// motivo_perda, envios agendados cancelados e tarefas abertas canceladas, atividade sistema.
// pausa_geral=true: não agenda nada novo (o que já está agendado fica; retomada é RN-07).
// Rota de teste POST /backend/v1/teste/rodar/cadencia (admin + modo_teste) com data_base e
// cadencia_id opcionais.
// A lógica é inline em cada callback (VM separada do PocketBase): o corpo do agendamento
// está duplicado no cron e na rota de teste.
// (Espelho de referência — conteúdo completo no projeto Skip 62151, versão ec3274b.)
