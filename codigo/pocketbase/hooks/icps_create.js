// pocketbase/hooks/icps_create.js
// Task ffe9ee34 (SPEC-1-001): RN-01/RN-02 na criação de ICP.
// Ativar exige aprovado_por com papel admin/gestor; só um ICP ativo por pipeline;
// fatores e bloqueios validados contra o catálogo fixo da SPEC.
// (Espelho de referência — conteúdo completo e executável no projeto Skip 62151.)

onRecordCreateRequest((e) => {
  if (e.hasSuperuserAuth()) {
    return e.next()
  }

  const FATORES = [
    'tem_tomografo',
    'tem_ressonancia',
    'tem_raio_x',
    'tem_ultrassom',
    'ate_n_equipamentos',
    'uf_prioritaria',
    'municipio_prioritario',
    'porte_me',
    'porte_epp',
    'porte_demais',
    'cnae_imagem',
    'socio_identificado',
    'site_informado',
    'linkedin_decisor',
    'instagram_ativo',
  ]
  const BLOQUEIOS = ['cnpj_inativo', 'fora_das_ufs', 'ja_cliente', 'unidade_publica']

  const lerJson = (valor, padrao) => {
    if (valor === null || valor === undefined || valor === '') return padrao
    if (typeof valor === 'string') {
      try {
        return JSON.parse(valor)
      } catch (_) {
        return padrao
      }
    }
    if (typeof valor === 'number' || typeof valor === 'boolean') return padrao
    if (Array.isArray(valor) && valor.length > 0 && typeof valor[0] === 'number') {
      try {
        return JSON.parse(String.fromCharCode.apply(null, valor))
      } catch (_) {
        return padrao
      }
    }
    return valor
  }

  const record = e.record
  const ativo = record.getBool('ativo')
  const aprovadoPor = String(record.getString('aprovado_por') || '')

  const fatores = lerJson(record.get('fatores'), [])
  if (!Array.isArray(fatores)) {
    throw new BadRequestError('fatores: esperada uma lista de fatores.')
  }
  for (let i = 0; i < fatores.length; i++) {
    const fator = fatores[i] || {}
    const chave = String(fator.chave || '')
    if (FATORES.indexOf(chave) === -1) {
      throw new BadRequestError('fatores: chave desconhecida "' + chave + '".')
    }
    if (typeof fator.peso !== 'number' || !isFinite(fator.peso)) {
      throw new BadRequestError('fatores: peso numérico obrigatório em "' + chave + '".')
    }
  }

  const bloqueios = lerJson(record.get('bloqueios'), [])
  if (!Array.isArray(bloqueios)) {
    throw new BadRequestError('bloqueios: esperada uma lista de bloqueios.')
  }
  for (let j = 0; j < bloqueios.length; j++) {
    if (BLOQUEIOS.indexOf(String(bloqueios[j])) === -1) {
      throw new BadRequestError('bloqueios: chave desconhecida "' + bloqueios[j] + '".')
    }
  }

  if (ativo) {
    if (!aprovadoPor) {
      throw new BadRequestError('Ativar um ICP exige aprovação registrada (quem aprovou).')
    }
    const papel = e.auth ? String(e.auth.getString('papel') || '') : ''
    if (papel !== 'admin' && papel !== 'gestor') {
      throw new ForbiddenError('Aprovação exige papel admin ou gestor.')
    }
    record.set('aprovado_em', new DateTime().string())
    // Só um ICP ativo por pipeline: desativa os outros da mesma pipeline.
    const pipeline = String(record.getString('pipeline') || '')
    const outros = $app.findRecordsByFilter('icps', 'pipeline = {:p} && ativo = true', '', 500, 0, {
      p: pipeline,
    })
    for (let k = 0; k < outros.length; k++) {
      outros[k].set('ativo', false)
      $app.save(outros[k])
    }
  }

  return e.next()
}, 'icps')
