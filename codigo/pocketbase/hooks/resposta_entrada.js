// pocketbase/hooks/resposta_entrada.js
// Task b43ce6d9 (SPEC-1-003): entrada de resposta e marcação do tipo — RN-04, RN-05, RN-08
// e reativação (RN-07, gatilho SDR).
// Rotas (sdr/admin/gestor; gravação como servidor):
//   POST /backend/v1/atividade-entrada  {oportunidade, tipo, conteudo}
//     → RN-04: estado_contato=pausado; cancela envios agendado/enviando de todos os canais
//       (motivo resposta); cria tarefa resposta para a SDR (1×); atividade sistema.
//   POST /backend/v1/resposta/{atividadeId}/tipo  {tipo_resposta}
//     → RN-08: interesse/retorno_pedido → tarefa retorno (vencimento D+1);
//       recusa/optout → RN-05 (opt-out no canal do contato principal + HMAC em supressao,
//       FORÇA pausado e cancela pendentes — nunca retoma); exclusao → alerta exclusao_pedida
//       + opt-out + pausado; resposta_automatica → RN-07 (rodada+1, ativo, retomada_em=agora;
//       motor reagenda).
//   POST /backend/v1/oportunidade/{id}/reativar  {justificativa}
//     → RN-07 pela SDR: só se pausado sem recusa/optout/exclusao; rodada+1, ativo, retomada_em;
//       atividade nota com a justificativa.
// HMAC: $security.hs256(valor, $secrets.get('SUPRESSAO_CHAVE')) — padrão do importar.js.
// A lógica é inline em cada callback (VM separada do PocketBase).
// (Espelho de referência — conteúdo completo no projeto Skip 62151, versão 9e1d302.)
