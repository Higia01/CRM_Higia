/* Main App Component - Handles routing (using react-router-dom), query client and other providers - use this file to add all routes */
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Index from './pages/Index'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import SemPermissao from './pages/SemPermissao'
import AdminLayout from './pages/admin/AdminLayout'
import AdminInicio from './pages/admin/AdminInicio'
import Produtos from './pages/admin/Produtos'
import Icps from './pages/admin/Icps'
import Pipelines from './pages/admin/Pipelines'
import Cadencias from './pages/admin/Cadencias'
import Modelos from './pages/admin/Modelos'
import Configuracao from './pages/admin/Configuracao'
import Usuarios from './pages/admin/Usuarios'
import Alertas from './pages/admin/Alertas'
import Execucoes from './pages/admin/Execucoes'
import Eventos from './pages/admin/Eventos'
import Questionario from './pages/admin/Questionario'
import Layout from './components/Layout'
import Guard from './components/Guard'

// ONLY IMPORT AND RENDER WORKING PAGES, NEVER ADD PLACEHOLDER COMPONENTS OR PAGES IN THIS FILE
// AVOID REMOVING ANY CONTEXT PROVIDERS FROM THIS FILE (e.g. TooltipProvider, Toaster, Sonner)

const App = () => (
  <BrowserRouter>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Guard filhos={<Index />} />} />
          <Route path="/admin" element={<Guard filhos={<AdminLayout />} exigeAdmin={true} />}>
            <Route index element={<AdminInicio />} />
            <Route path="produtos" element={<Produtos />} />
            <Route path="icps" element={<Icps />} />
            <Route path="pipelines" element={<Pipelines />} />
            <Route path="cadencias" element={<Cadencias />} />
            <Route path="modelos" element={<Modelos />} />
            <Route path="configuracao" element={<Configuracao />} />
            <Route path="usuarios" element={<Usuarios />} />
            <Route path="alertas" element={<Alertas />} />
            <Route path="execucoes" element={<Execucoes />} />
            <Route path="eventos" element={<Eventos />} />
            <Route path="questionario" element={<Questionario />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES MUST BE ADDED HERE */}
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </BrowserRouter>
)

export default App
