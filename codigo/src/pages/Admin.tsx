import { podeAcessarAdmin } from '@/services/auth'
import SemPermissao from '@/pages/SemPermissao'

/* Área de administração: nesta task existem o guarda de acesso e esta página.
   As telas de administração (produtos, ICP, pipelines, cadências, modelos e
   configuração) entram na task ffe9ee34, seguinte da fase. */
const Admin = () => {
  if (!podeAcessarAdmin()) {
    return <SemPermissao />
  }
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Administração</h1>
      <p className="text-muted-foreground">
        O seu acesso à área de administração está funcionando. As telas de produtos, ICP,
        pipelines, cadências, modelos de mensagem e configuração entram na próxima tarefa da
        fase 1.
      </p>
    </div>
  )
}

export default Admin
