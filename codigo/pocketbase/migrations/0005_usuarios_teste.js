// pocketbase/migrations/0005_usuarios_teste.js
// Task ffe9ee34 (SPEC-1-001): usuários de teste da SPEC (fixtures do TDD), com teste=true.
// Desativados/apagados pela rota /backend/v1/teste/limpar no fim das provas.

migrate(
  (app) => {
    const usuarios = [
      { email: 'admin@exemplo.invalid', name: 'Admin de Teste', papel: 'admin' },
      { email: 'gestor@exemplo.invalid', name: 'Gestor de Teste', papel: 'gestor' },
      { email: 'sdr@exemplo.invalid', name: 'SDR de Teste', papel: 'sdr' },
      { email: 'licitacao@exemplo.invalid', name: 'Licitação de Teste', papel: 'licitacao' },
    ]
    for (let i = 0; i < usuarios.length; i++) {
      const u = usuarios[i]
      try {
        app.findAuthRecordByEmail('_pb_users_auth_', u.email)
        continue
      } catch (_) {}
      const record = new Record(app.findCollectionByNameOrId('_pb_users_auth_'))
      record.setEmail(u.email)
      record.setPassword('Teste@2026')
      record.setVerified(true)
      record.set('name', u.name)
      record.set('papel', u.papel)
      record.set('ativo', true)
      record.set('teste', true)
      app.save(record)
      console.log('usuario de teste criado: ' + u.email)
    }
  },
  (app) => {
    const usuarios = ['admin@exemplo.invalid', 'gestor@exemplo.invalid', 'sdr@exemplo.invalid', 'licitacao@exemplo.invalid']
    for (let i = 0; i < usuarios.length; i++) {
      try {
        app.delete(app.findAuthRecordByEmail('_pb_users_auth_', usuarios[i]))
      } catch (_) {}
    }
  },
)
