// Task ffe9ee34 (SPEC-1-001): tela de configuração do sistema — modo de teste, simulação,
// pausa geral, canais, limites e pendências (CA-1-05). Escrita só por admin; pausa geral também gestor.
// Correção do teste humano 14/10: modo de teste e simulação agora têm interruptor na tela
// (o servidor grava versão, autor e histórico por trás).

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Pause, Play } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { EstadoCarregando, EstadoErro, EstadoVazio } from '@/components/admin/Estados'
import { podeAcessarAdmin } from '@/services/auth'
import { listarConfiguracao, pausaGeral, salvarConfiguracao, mensagemErroAdmin, type ConfigItem } from '@/services/admin-configuracao'
import { formatarDataHora } from '@/lib/formatos'

const ROTULOS: Record<string, string> = {
  modo_teste: 'Modo de teste',
  simulacao: 'Simulação de provedores',
  pausa_geral: 'Pausa geral',
  canal_email_ativo: 'Canal de e-mail',
  canal_whatsapp_ativo: 'Canal de WhatsApp',
  amostra_minima: 'Amostra mínima do piloto',
  dominios_pessoais: 'Domínios pessoais bloqueados',
  feriados: 'Feriados',
  destinatarios_permitidos: 'Destinatários permitidos (modo de teste)',
}

const EXPLICACAO: Record<string, string> = {
  modo_teste: 'Com o modo de teste ligado, nenhum envio sai para fora da lista de destinatários permitidos.',
  simulacao: 'Com a simulação ligada, os serviços externos não são chamados; o sistema grava o que pediria.',
  pausa_geral: 'Pausar segura todos os envios e passos de cadência, em qualquer canal.',
  canal_email_ativo: 'O canal de e-mail só é ligado depois do e-mail de teste entregue (SPEC-1-004).',
  canal_whatsapp_ativo: 'O canal de WhatsApp só é ligado depois da mensagem de teste nos dois sentidos (SPEC-1-005).',
  amostra_minima: 'Número de leads trabalhados antes do veredito do público (SPEC-1-007).',
  dominios_pessoais: 'E-mails desses domínios não entram na cadência.',
  feriados: 'Dias sem envio ou passos de cadência.',
  destinatarios_permitidos: 'Com o modo de teste ligado, só quem está nesta lista recebe algo.',
}

const LIGADO_DESLIGADO = ['modo_teste', 'pausa_geral', 'canal_email_ativo', 'canal_whatsapp_ativo']

export default function Configuracao() {
  const [itens, setItens] = useState<ConfigItem[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [confirmaPausa, setConfirmaPausa] = useState<null | boolean>(null)
  const [mudandoPausa, setMudandoPausa] = useState(false)
  const podeEditar = podeAcessarAdmin()

  const carregar = useCallback(async () => {
    setCarregando(true)
    try {
      setItens(await listarConfiguracao())
      setErro('')
    } catch (e) {
      setErro(mensagemErroAdmin(e, 'carregar a configuração'))
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    carregar()
  }, [carregar])

  const mudarPausa = async (valor: boolean) => {
    setMudandoPausa(true)
    try {
      await pausaGeral(valor)
      toast.success(valor ? 'Operação pausada.' : 'Operação retomada.')
      setConfirmaPausa(null)
      await carregar()
    } catch (e) {
      toast.error(mensagemErroAdmin(e, 'mudar a pausa geral'))
      setConfirmaPausa(null)
    } finally {
      setMudandoPausa(false)
    }
  }

  // Liga/desliga chaves simples (modo de teste, canais). A versão, o autor e o histórico
  // são gravados pelo servidor (hook configuracao_update) — aqui só envia o novo valor.
  const alternarChave = async (item: ConfigItem, novoValor: boolean) => {
    if (item.chave === 'pausa_geral') {
      setConfirmaPausa(novoValor)
      return
    }
    try {
      await salvarConfiguracao(item.id, { valor: novoValor })
      toast.success(novoValor ? 'Chave ligada.' : 'Chave desligada.')
      await carregar()
    } catch (e) {
      toast.error(mensagemErroAdmin(e, 'mudar a configuração'))
    }
  }

  // Liga/desliga a simulação (valor é um objeto {ativa, respostas}).
  const alternarSimulacao = async (item: ConfigItem, novaAtiva: boolean) => {
    try {
      const valorAtual = (item.valor as { ativa?: boolean; respostas?: Record<string, unknown> }) || {}
      await salvarConfiguracao(item.id, { valor: { ...valorAtual, ativa: novaAtiva } })
      toast.success(novaAtiva ? 'Simulação ligada.' : 'Simulação desligada.')
      await carregar()
    } catch (e) {
      toast.error(mensagemErroAdmin(e, 'mudar a simulação'))
    }
  }

  if (carregando) return <EstadoCarregando />
  if (erro) return <EstadoErro mensagem={erro} aoTentarDeNovo={carregar} />
  if (itens.length === 0) {
    return <EstadoVazio titulo="Nenhuma configuração registrada" descricao="A configuração inicial do sistema aparece aqui." />
  }

  const ordem = Object.keys(ROTULOS)
  const ordenados = [...itens].sort((a, b) => {
    const ia = ordem.indexOf(a.chave)
    const ib = ordem.indexOf(b.chave)
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib)
  })

  const simula = itens.find((c) => c.chave === 'simulacao')
  const simulacaoAtiva = !!(simula && (simula.valor as { ativa?: boolean })?.ativa)
  const destinatarios = itens.find((c) => c.chave === 'destinatarios_permitidos')
  const listaDestinatarios = Array.isArray(destinatarios?.valor) ? (destinatarios?.valor as string[]) : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Configuração</h1>
        <p className="text-sm text-muted-foreground">Chaves do sistema. Toda mudança fica registrada com versão, autor e histórico.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {ordenados.map((item) => {
          const ehLigado = LIGADO_DESLIGADO.includes(item.chave)
          const ehPausa = item.chave === 'pausa_geral'
          const valor = item.valor
          const ligado = valor === true
          return (
            <Card key={item.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{ROTULOS[item.chave] ?? item.chave}</CardTitle>
                <CardDescription>{EXPLICACAO[item.chave] ?? ''}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {ehLigado ? (
                  <div className="flex items-center gap-3">
                    <Badge variant={ligado ? 'default' : 'secondary'}>{ligado ? 'Ligado' : 'Desligado'}</Badge>
                    {podeEditar && ehPausa ? (
                      <Button variant="outline" size="sm" onClick={() => setConfirmaPausa(!ligado)} disabled={mudandoPausa}>
                        {ligado ? (<><Play className="h-4 w-4" aria-hidden="true" /> Retomar</>) : (<><Pause className="h-4 w-4" aria-hidden="true" /> Pausar</>)}
                      </Button>
                    ) : null}
                    {podeEditar && !ehPausa ? (
                      <Switch id={`switch-${item.chave}`} checked={ligado} onCheckedChange={(v) => alternarChave(item, v)} />
                    ) : null}
                  </div>
                ) : item.chave === 'simulacao' ? (
                  <div className="flex items-center gap-3">
                    <Badge variant={simulacaoAtiva ? 'default' : 'secondary'}>{simulacaoAtiva ? 'Ligada' : 'Desligada'}</Badge>
                    {podeEditar ? (
                      <Switch id="switch-simulacao" checked={simulacaoAtiva} onCheckedChange={(v) => alternarSimulacao(item, v)} />
                    ) : null}
                  </div>
                ) : item.chave === 'destinatarios_permitidos' ? (
                  listaDestinatarios.length > 0 ? (
                    <ul className="list-inside list-disc text-sm">
                      {listaDestinatarios.map((d) => (<li key={d}>{d}</li>))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">Lista vazia: com o modo de teste ligado, ninguém recebe envios de teste.</p>
                  )
                ) : item.chave === 'feriados' ? (
                  <p className="text-sm text-muted-foreground">{Array.isArray(valor) ? `${(valor as string[]).length} datas registradas (2026–2027)` : '—'}</p>
                ) : item.chave === 'dominios_pessoais' ? (
                  <p className="text-sm text-muted-foreground">{Array.isArray(valor) ? `${(valor as string[]).length} domínios na lista fechada` : '—'}</p>
                ) : (
                  <p className="text-sm font-medium">{JSON.stringify(valor)}</p>
                )}
                <p className="text-xs text-muted-foreground">Versão {item.versao} · {item.autor} · desde {formatarDataHora(item.vigente_desde)}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
      <AlertDialog open={confirmaPausa !== null} onOpenChange={(v) => !v && !mudandoPausa && setConfirmaPausa(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmaPausa ? 'Pausar toda a operação?' : 'Retomar a operação?'}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmaPausa ? 'Todos os envios e passos de cadência ficam parados até alguém retomar.' : 'Os envios e passos voltam a seguir a cadência normalmente.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={mudandoPausa}>Cancelar</AlertDialogCancel>
            <AlertDialogAction disabled={mudandoPausa} onClick={(e) => { e.preventDefault(); mudarPausa(confirmaPausa === true) }}>
              {mudandoPausa ? 'Aplicando…' : confirmaPausa ? 'Pausar' : 'Retomar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
