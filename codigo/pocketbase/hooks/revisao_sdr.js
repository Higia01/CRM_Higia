// pocketbase/hooks/revisao_sdr.js
// Task a1326b8f (SPEC-1-002): ações da revisão da SDR — rota
// POST /backend/v1/clinicas/{id}/acao (papel sdr/admin/gestor) + gancho teste/semear/t7.
// Ações: aprovar (RN-12: CNPJ ativo + canal válido + justificativa; duplicidade pendente não
// aprova), corrigir_nota (CA-1-10: 0–100 + justificativa; motivo_status=correcao_sdr protege
// da repontuação), descartar/reabrir (RN-07 com motivo), sinais (linkedin_decisor,
// instagram_ativo), contato_principal (RN-11: só contato com canal válido).
// Toda ação grava em alteracoes (RN-14): colecao, registro, campo, antes, depois, autor,
// quando, motivo — gravação feita pelo servidor (a coleção mantém createRule só admin).
// (Espelho de referência — conteúdo completo no projeto Skip 62151, versão 0ae88a5.)
