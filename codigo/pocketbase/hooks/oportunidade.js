// pocketbase/hooks/oportunidade.js
// Task 2da63fc2 (SPEC-1-003): fila de entrada (RN-02) + ganchos de teste.
// cron fila_entrada_diaria 0 10 * * 1-5 (07:00 Brasília, dias úteis; feriado pela lista
// configuracao.feriados): oportunidades aguardando viram ativo por ordem de nota da
// organização (desc), até limite_diario_entrada_cadencia (padrão 10 da Q-13 com alerta se
// ausente); atividade sistema registra a ativação (RN-10).
// Rotas de teste (admin + modo_teste): /backend/v1/teste/fila-entrada (rodar a fila) e
// /backend/v1/teste/semear/oportunidades/{n} (semeia N organizações acionáveis de teste com
// notas decrescentes para a prova T9).
// (Espelho de referência — conteúdo completo no projeto Skip 62151, versão 879cb9d.)
