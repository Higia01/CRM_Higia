// pocketbase/migrations/0006_regra_login_usuarios.js
// Task ffe9ee34 (correção do teste humano 14/10): usuário desativado (ativo=false) não pode
// autenticar — authRule da coleção users: 'ativo = true'. Em migrações JS as regras são
// propriedades diretas (collection.authRule = ...). (Espelho de referência.)

migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    users.authRule = 'ativo = true'
    app.save(users)
    console.log('authRule de users: ativo = true')
  },
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    users.authRule = ''
    app.save(users)
  },
)
