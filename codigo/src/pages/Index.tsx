import { usuarioAtual } from '@/services/auth'

const Index = () => {
  const usuario = usuarioAtual()
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">
        {usuario ? `Bem-vindo, ${usuario.name}` : 'CRM Higia'}
      </h1>
      {usuario ? (
        <p className="text-muted-foreground">
          Você entrou com o papel de <strong>{usuario.papel}</strong>. As próximas áreas do sistema
          (administração, clínicas e pipelines) entram nas próximas tarefas da fase 1.
        </p>
      ) : (
        <p className="text-muted-foreground">
          Faça login para usar o CRM. Use o link “Entrar” no topo.
        </p>
      )}
    </div>
  )
}

export default Index
