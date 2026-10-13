/* Layout Component - A component that wraps the main content of the app
   - Use this file to add a header, footer, or other elements that should be present on every page
   - This component is used in the App.tsx file to wrap the main content of the app */

import { Outlet, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { usuarioAtual, sair } from '@/services/auth'

const nomePapel: Record<string, string> = {
  admin: 'Administrador',
  gestor: 'Gestor',
  sdr: 'SDR',
  licitacao: 'Licitações',
}

export default function Layout() {
  const navigate = useNavigate()
  const usuario = usuarioAtual()

  const handleSair = async () => {
    await sair()
    navigate('/login')
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-semibold">CRM Higia</span>
          {usuario ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {usuario.name}
              </span>
              <Badge variant="secondary">{nomePapel[usuario.papel] || usuario.papel}</Badge>
              <Button variant="outline" size="sm" onClick={handleSair}>
                Sair
              </Button>
            </div>
          ) : null}
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
