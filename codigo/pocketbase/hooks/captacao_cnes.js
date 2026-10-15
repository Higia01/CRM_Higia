// pocketbase/hooks/captacao_cnes.js
// Task c014826a (SPEC-1-002): captação CNES — rota POST /backend/v1/captacao/rodar + cron
// captacao_diaria (10:00 UTC). Lote com cursor em importacoes; RN-01; bloqueios ja_cliente;
// esfera NÃO descarta (unidade_publica avaliado na pontuação pela natureza jurídica 1xxx).
// Correção 15/10 (Igor): município gravado como NOME (mapa código IBGE → nome da
// configuracao municipios_<uf>; o CNES só devolve o código). Correção aplicada na rota e no
// cron (lógica inline duplicada).
// (Espelho de referência — conteúdo completo no projeto Skip 62151, versão 3151f61.)
