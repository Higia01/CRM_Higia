import { Navigate, useLocation } from 'react-router-dom'
import { usuarioAtual, podeAcessarAdmin } from '@/services/auth'
import SemPermissao from '@/pages/SemPermissao'

interface GuardProps {
  filhos: React.ReactNode
  exigeAdmin?: boolean
}

/* Guarda de rota: exige login e, quando marcada, papel admin ou gestor.
   A garantia real de permissão está nas regras das coleções (servidor);
   isto aqui é experiência de uso. */
const Guard = ({ filhos, exigeAdmin }: GuardProps) => {
  const location = useLocation()
  const usuario = usuarioAtual()

  if (!usuario) {
    return <Navigate to="/login" state={{ de: location.pathname }} replace />
  }
  if (exigeAdmin && !podeAcessarAdmin()) {
    return <SemPermissao />
  }
  return <>{filhos}</>
}

export default Guard
