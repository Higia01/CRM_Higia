// Task c02b4c1d (SPEC-1-002): rota /backend/v1/importar — recebe CSV, confere hash (mesmo
// arquivo não importa 2×), mapeia colunas (modelo padrão + RD Station/Apollo), aplica RN-01
// (duplicado atualiza vazios + fontes) e RN-02 (supressão entra com opt-out), grava relatório.
// Acesso admin/gestor. Correções provadas: hs256(msg, segredo); campo json lido com
// JSON.parse(getString()); limpeza cobre contatos/organizacoes. (Espelho de referência —
// conteúdo completo no projeto Skip 62151, versão 80aebce.)
