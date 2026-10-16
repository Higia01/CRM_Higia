// Task 34655984 (SPEC-1-002): fila de clínicas — lista com nota, status, filtros, busca,
// paginação e cards no celular. Acesso: admin/gestor/sdr (licitação não vê).
// Complementos 15/10 (Igor): botão Início; contêiner; UF como sigla; coluna Origem; seletor
// direto de página.
// Complementos 16/10 (Igor): filtros de CNPJ (com/sem), canal válido (com/sem, RN-10) e faixa
// de nota (≥60, 40–59, <40) + "Limpar filtros"; município como BUSCA DE TEXTO LIVRE server-side
// (municipio ~ termo, em toda a base — o seletor só mostrava os da página carregada),
// com debounce de 400ms; listarClinicas recebe buscaMunicipio.
// (Espelho de referência — conteúdo completo no projeto Skip 62151, versão 55aed02.)
