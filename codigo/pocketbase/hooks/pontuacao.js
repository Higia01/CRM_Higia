// pocketbase/hooks/pontuacao.js
// Task 34655984 (SPEC-1-002): pontuação explicável pelo ICP ativo — rota
// POST /backend/v1/pontuacao/rodar (admin/gestor) e cron pontuacao_diaria (10:40 UTC).
// Fila por -created (teto 200/rodada — o teto corta antes de sort em memória); fatores com
// PESOS LIDOS DO ICP ATIVO (pesoDe(chave, padrao)); bloqueios cnpj_inativo/ja_cliente/
// unidade_publica (natureza jurídica 1xxx — esfera do CNES é campo sujo, DECISÃO DO CLIENTE
// 15/10); canal válido RN-10 (e-mail fora de dominios_pessoais + CNPJ ativo; WhatsApp celular);
// status RN-05/06/07; contato principal RN-11; relatório em importacoes.
// adapta-divida: repontua todas (RN-09 sem envios por ora); exceção das abordadas quando
// SPEC-1-003/004 criarem as coleções de envio.
// Correções provadas: fila com sort nativo -created (teto não repete os mesmos); pesos do ICP
// ativo (T5); marcador nunca-pontuada = fatores_pontuacao vazio.
// (Espelho de referência — conteúdo completo no projeto Skip 62151, versão 2769b5c.)
