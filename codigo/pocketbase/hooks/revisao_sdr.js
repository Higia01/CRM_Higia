// pocketbase/hooks/revisao_sdr.js
// Task a1326b8f (SPEC-1-002) + 2da63fc2 (SPEC-1-003): ações da revisão da SDR — rota
// POST /backend/v1/clinicas/{id}/acao (papel sdr/admin/gestor) + ganchos de teste.
// Ações: aprovar (RN-12; AGORA CRIA A OPORTUNIDADE RN-01 — pipeline do ICP, etapa "Lista de
// Leads", responsável = SDR ativa, cadência ativa + versão, estado aguardando, rodada 1,
// idempotente, atividade sistema), corrigir_nota, descartar/reabrir, sinais,
// contato_principal (RN-11) e editar_dados (CNPJ com Receita na hora, equipamentos fonte SDR).
// (Espelho de referência — conteúdo completo no projeto Skip 62151, versão 879cb9d.)
