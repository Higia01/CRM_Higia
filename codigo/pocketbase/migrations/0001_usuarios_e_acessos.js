// pocketbase/migrations/0001_usuarios_e_acessos.js
// Task ed14fa15 (SPEC-1-001): usuários com papel, cadastro público desligado e esqueleto das
// coleções de configuração com as regras da matriz de acesso.
// Migration aditiva — projeto novo, sem dados reais.
// adapta-divida: coleções de configuração como esqueleto (campos mínimos); campos completos
// quando a task ffe9ee34 (área de administração) for implementada.

migrate(
  (app) => {
    const leituraInterna = "@request.auth.id != '' && @request.auth.papel != 'licitacao'"
    const gestao = "@request.auth.papel = 'admin' || @request.auth.papel = 'gestor'"
    const soAdmin = "@request.auth.papel = 'admin'"

    const comTimestamps = (campos) =>
      campos.concat([
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ])

    // ---- users (auth): papel, ativo, teste; cadastro público desligado ----
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    if (!users.fields.getByName('papel')) {
      users.fields.add(
        new SelectField({
          name: 'papel',
          values: ['admin', 'gestor', 'sdr', 'licitacao'],
          maxSelect: 1,
          required: true,
        }),
      )
    }
    if (!users.fields.getByName('ativo')) {
      users.fields.add(new BoolField({ name: 'ativo' }))
    }
    if (!users.fields.getByName('teste')) {
      users.fields.add(new BoolField({ name: 'teste' }))
    }
    users.listRule =
      "@request.auth.id != '' && (@request.auth.papel = 'admin' || @request.auth.papel = 'gestor')"
    users.viewRule =
      "id = @request.auth.id || @request.auth.papel = 'admin' || @request.auth.papel = 'gestor'"
    users.createRule = soAdmin
    users.updateRule =
      "@request.auth.papel = 'admin' || (id = @request.auth.id && @request.body.papel:changed = false && @request.body.ativo:changed = false && @request.body.teste:changed = false)"
    users.deleteRule = soAdmin
    app.save(users)

    // ---- produtos ----
    app.save(
      new Collection({
        name: 'produtos',
        type: 'base',
        listRule: leituraInterna,
        viewRule: leituraInterna,
        createRule: gestao,
        updateRule: gestao,
        deleteRule: gestao,
        fields: comTimestamps([
          { name: 'nome', type: 'text', required: true },
          { name: 'descricao', type: 'text' },
          { name: 'ativo', type: 'bool' },
        ]),
      }),
    )

    // ---- icps (esqueleto) ----
    app.save(
      new Collection({
        name: 'icps',
        type: 'base',
        listRule: leituraInterna,
        viewRule: leituraInterna,
        createRule: gestao,
        updateRule: gestao,
        deleteRule: gestao,
        fields: comTimestamps([
          { name: 'nome', type: 'text', required: true },
          { name: 'versao', type: 'number', onlyInt: true },
          { name: 'ativo', type: 'bool' },
        ]),
      }),
    )

    // ---- pipelines (esqueleto) ----
    app.save(
      new Collection({
        name: 'pipelines',
        type: 'base',
        listRule: leituraInterna,
        viewRule: leituraInterna,
        createRule: gestao,
        updateRule: gestao,
        deleteRule: gestao,
        fields: comTimestamps([
          { name: 'nome', type: 'text', required: true },
          { name: 'tipo', type: 'select', values: ['privada', 'publica'], maxSelect: 1 },
        ]),
      }),
    )

    // ---- cadencias (esqueleto) ----
    app.save(
      new Collection({
        name: 'cadencias',
        type: 'base',
        listRule: leituraInterna,
        viewRule: leituraInterna,
        createRule: gestao,
        updateRule: gestao,
        deleteRule: gestao,
        fields: comTimestamps([
          { name: 'nome', type: 'text', required: true },
          { name: 'versao', type: 'number', onlyInt: true },
          { name: 'ativa', type: 'bool' },
          { name: 'teste', type: 'bool' },
        ]),
      }),
    )

    // ---- modelos_mensagem (esqueleto) ----
    app.save(
      new Collection({
        name: 'modelos_mensagem',
        type: 'base',
        listRule: leituraInterna,
        viewRule: leituraInterna,
        createRule: gestao,
        updateRule: gestao,
        deleteRule: gestao,
        fields: comTimestamps([
          { name: 'canal', type: 'select', values: ['email', 'whatsapp', 'linkedin'], maxSelect: 1 },
          { name: 'nome', type: 'text', required: true },
          { name: 'versao', type: 'number', onlyInt: true },
          { name: 'aprovado_por', type: 'text' },
          { name: 'ativo', type: 'bool' },
        ]),
      }),
    )

    // ---- configuracao ----
    app.save(
      new Collection({
        name: 'configuracao',
        type: 'base',
        listRule: leituraInterna,
        viewRule: leituraInterna,
        createRule: soAdmin,
        updateRule: soAdmin,
        deleteRule: soAdmin,
        fields: comTimestamps([
          { name: 'chave', type: 'text', required: true },
          { name: 'valor', type: 'json' },
          { name: 'versao', type: 'number', onlyInt: true },
          { name: 'autor', type: 'text' },
        ]),
        indexes: ["CREATE UNIQUE INDEX idx_configuracao_chave ON configuracao (chave)"],
      }),
    )

    // ---- questionario (só admin) ----
    app.save(
      new Collection({
        name: 'questionario',
        type: 'base',
        listRule: soAdmin,
        viewRule: soAdmin,
        createRule: soAdmin,
        updateRule: soAdmin,
        deleteRule: soAdmin,
        fields: comTimestamps([
          { name: 'pergunta_id', type: 'text', required: true },
          {
            name: 'origem',
            type: 'select',
            values: ['documento', 'pergunta', 'padrao'],
            maxSelect: 1,
          },
          { name: 'fonte', type: 'text' },
          { name: 'valor_proposto', type: 'text' },
          {
            name: 'status',
            type: 'select',
            values: ['pendente', 'proposto', 'aprovado'],
            maxSelect: 1,
          },
        ]),
      }),
    )

    // ---- importacoes (gravação só por hooks/superusuário) ----
    app.save(
      new Collection({
        name: 'importacoes',
        type: 'base',
        listRule: gestao,
        viewRule: gestao,
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields: comTimestamps([
          { name: 'fonte', type: 'text' },
          { name: 'estado', type: 'text' },
          { name: 'inseridos', type: 'number', onlyInt: true },
          { name: 'duplicados', type: 'number', onlyInt: true },
          { name: 'rejeitados', type: 'number', onlyInt: true },
        ]),
      }),
    )

    // ---- eventos_webhook (gravação só por hooks/superusuário) ----
    app.save(
      new Collection({
        name: 'eventos_webhook',
        type: 'base',
        listRule: soAdmin,
        viewRule: soAdmin,
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields: comTimestamps([
          { name: 'provedor', type: 'text' },
          { name: 'evento_id', type: 'text', required: true },
          { name: 'tipo', type: 'text' },
          { name: 'processado', type: 'bool' },
        ]),
        indexes: ["CREATE UNIQUE INDEX idx_eventos_webhook_evento ON eventos_webhook (evento_id)"],
      }),
    )

    // ---- alertas (leitura e resolução por admin/gestor; criação só por hooks) ----
    app.save(
      new Collection({
        name: 'alertas',
        type: 'base',
        listRule: gestao,
        viewRule: gestao,
        createRule: null,
        updateRule: gestao,
        deleteRule: null,
        fields: comTimestamps([
          {
            name: 'tipo',
            type: 'select',
            values: [
              'falha_fonte',
              'canal_pausado',
              'silencio_webhook',
              'pncp_pendente',
              'resposta_sem_dono',
              'exclusao_pedida',
            ],
            maxSelect: 1,
          },
          { name: 'mensagem', type: 'text' },
          { name: 'responsavel', type: 'text' },
          { name: 'status', type: 'select', values: ['aberto', 'resolvido'], maxSelect: 1 },
        ]),
      }),
    )

    // ---- organizacoes (esqueleto; escrita definida na SPEC-1-002) ----
    app.save(
      new Collection({
        name: 'organizacoes',
        type: 'base',
        listRule: leituraInterna,
        viewRule: leituraInterna,
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields: comTimestamps([
          { name: 'nome', type: 'text', required: true },
          { name: 'cnpj', type: 'text' },
          { name: 'uf', type: 'text' },
        ]),
      }),
    )
  },
  (app) => {
    // down: apaga as coleções criadas e restaura o users do template.
    const nomes = [
      'organizacoes',
      'alertas',
      'eventos_webhook',
      'importacoes',
      'questionario',
      'configuracao',
      'modelos_mensagem',
      'cadencias',
      'pipelines',
      'icps',
      'produtos',
    ]
    for (let i = 0; i < nomes.length; i++) {
      try {
        app.delete(app.findCollectionByNameOrId(nomes[i]))
      } catch (_) {}
    }
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    users.fields.removeByName('papel')
    users.fields.removeByName('ativo')
    users.fields.removeByName('teste')
    users.listRule = 'id = @request.auth.id'
    users.viewRule = 'id = @request.auth.id'
    users.createRule = ''
    users.updateRule = 'id = @request.auth.id'
    users.deleteRule = 'id = @request.auth.id'
    app.save(users)
  },
)
