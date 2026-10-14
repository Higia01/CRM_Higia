// pocketbase/hooks/captacao_cnes.js
// Task c014826a (SPEC-1-002): captação CNES — rota POST /backend/v1/captacao/rodar (admin/gestor)
// e cron captacao_diaria (10:00 UTC / 07:00 Brasília). Lote com cursor em importacoes: pagina
// /cnes/estabelecimentos (tipos 39/36/22, limit 20, teto 10 páginas/rodada), RN-01 (duplicado
// atualiza vazios + fontes), bloqueios ja_cliente (configuracao.cnpjs_clientes) e unidade_publica
// (esfera), fonte por campo, equipamentos com competência retroativa (até 3 meses, teto 30
// buscas/rodada — adapta-divida marcada). Falha da fonte preserva o cursor (CA-1-11).
// Correções provadas: res.json para o corpo HTTP (res.body é bytes); campo nome obrigatório na
// criação; lógica inline nos callbacks (VM separada do PocketBase).
// (Espelho de referência — conteúdo completo no projeto Skip 62151, versão eb2114f.)
