import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const SemPermissao = () => {
  const navigate = useNavigate()
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Você não tem acesso a esta área</CardTitle>
          <CardDescription>
            Se isso for um erro, fale com o Dario para revisar o seu acesso.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate('/')}>Voltar ao início</Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default SemPermissao
