// pocketbase/migrations/0009_envios_tarefas.js
// Task 1cc6e53d (SPEC-1-003): coleções envios e tarefas.
// envios: oportunidade (rel pbc_384056131), passo, rodada, canal, modelo (rel pbc_4148349853),
// status (agendado/enviando/enviado/falhou/cancelado), agendado_para, chave_idempotencia
// (única), provedor_id, simulado (json), erro, tentativas, teste.
// tarefas: oportunidade (rel pbc_384056131), organizacao (rel pbc_3336351933), tipo
// (ligacao/linkedin/whatsapp_manual/revisao/duplicidade/retorno/resposta/erro), responsavel,
// vencimento, status (aberta/feita/cancelada), motivo_prioridade, mensagem_sugerida, passo, teste.
// Regras: SDR vê as suas (responsável/responsável da oportunidade), admin/gestor tudo,
// licitacao nada; escrita por hooks/admin (createRule/updateRule null).
// (Espelho de referência — conteúdo completo no projeto Skip 62151, versão ec3274b.)
