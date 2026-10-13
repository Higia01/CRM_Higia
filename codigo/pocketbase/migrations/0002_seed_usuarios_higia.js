// pocketbase/migrations/0002_seed_usuarios_higia.js
// Task ed14fa15 (SPEC-1-001): usuários reais da Higia, conforme Q-01 validada pelo Igor.
// Idempotente: se o e-mail já existe, não faz nada (try/catch no finder que lança).
// Senha provisória forte, para troca no primeiro acesso (nada de credencial no chat).

migrate(
  (app) => {
    const usuarios = [
      { email: 'dariobcalcada@higiatec.com.br', name: 'Dario Brito Calçada', papel: 'admin' },
      { email: 'igor.alves@higiatec.com.br', name: 'Igor Alves Leandro', papel: 'admin' },
      { email: 'comercial@higiatec.com.br', name: 'Jesus Vasconcelos (SDR)', papel: 'sdr' },
    ]
    for (let i = 0; i < usuarios.length; i++) {
      const u = usuarios[i]
      try {
        app.findAuthRecordByEmail('_pb_users_auth_', u.email)
        continue // já existe
      } catch (_) {}
      const record = new Record(app.findCollectionByNameOrId('_pb_users_auth_'))
      record.setEmail(u.email)
      record.setPassword('Higia@2026')
      record.setVerified(true)
      record.set('name', u.name)
      record.set('papel', u.papel)
      record.set('ativo', true)
      record.set('teste', false)
      app.save(record)
      console.log('usuario criado: ' + u.email + ' papel ' + u.papel)
    }
  },
  (app) => {
    const usuarios = [
      'dariobcalcada@higiatec.com.br',
      'igor.alves@higiatec.com.br',
      'comercial@higiatec.com.br',
    ]
    for (let i = 0; i < usuarios.length; i++) {
      try {
        app.delete(app.findAuthRecordByEmail('_pb_users_auth_', usuarios[i]))
      } catch (_) {}
    }
  },
)
