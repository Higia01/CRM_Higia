// pocketbase/hooks/captacao_cnpj.js
// Task c014826a (SPEC-1-002): consulta CNPJ na Receita (BrasilAPI) — rota
// POST /backend/v1/captacao/cnpj (admin/gestor) e cron captacao_cnpj_diaria (10:20 UTC).
// Fila: organizações com CNPJ sem razao_social (candidato/em_revisao); 1 consulta/segundo
// (timeout 15s, teto 30/rodada); completa razão social, nome fantasia, natureza, porte,
// situação, CNAE, telefone, e-mail e sócios (contatos papel desconhecido); fonte por campo.
// 404 → em_revisao (cnpj_nao_encontrado); 429/5xx → adia (fila própria); simulação
// simulacao.respostas.brasilapi = {"status": 429} injeta falha para o T9.
// A lógica inteira fica inline dentro de cada callback (VM separada do PocketBase).
// (Espelho de referência — conteúdo completo no projeto Skip 62151, versão eb2114f.)
