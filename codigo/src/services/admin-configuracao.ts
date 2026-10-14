// Task ffe9ee34 (SPEC-1-001): configuração, alertas, execuções, eventos, questionário e os
// ganchos de teste. Componentes não chamam o pb direto: tudo por aqui.

import type { RecordModel } from 'pocketbase'
import pb from '@/lib/pocketbase/client'
import { mensagemDeErro } from '@/lib/mensagens-erro'

export interface ConfigItem extends RecordModel {
  chave: string
  valor: unknown
  versao: number
  autor: string
  vigente_desde: string
  historico: Array<{ valor: unknown; autor: string; de: string }>
}

export interface Alerta extends RecordModel {
  tipo: string
  mensagem: string
  responsavel: string
  status: 'aberto' | 'resolvido'
}

export interface Execucao extends RecordModel {
  fonte: string
  estado: string
  inseridos: number
  duplicados: number
  rejeitados: number
  atualizados?: number
  autor: string
  teste?: boolean
}

export interface Evento extends RecordModel {
  provedor: string
  evento_id: string
  tipo: string
  processado: boolean
  resultado: string
  teste?: boolean
}

export interface ItemQuestionario extends RecordModel {
  pergunta_id: string
  origem: 'documento' | 'pergunta' | 'padrao'
  fonte: string
  valor_proposto: string
  status: 'pendente' | 'proposto' | 'aprovado'
}

export function mensagemErroAdmin(erro: unknown, acao: string): string {
  return mensagemDeErro(erro, acao)
}

// ---- configuração ----

export const listarConfiguracao = () =>
  pb.collection<ConfigItem>('configuracao').getFullList({ sort: 'chave' })

export const salvarConfiguracao = (id: string, dados: { valor: unknown; autor: string; versao: number; historico: ConfigItem['historico'] }) =>
  pb.collection<ConfigItem>('configuracao').update(id, dados)

/** Pausa geral pela rota própria da SPEC (admin ou gestor). */
export const pausaGeral = (ativa: boolean) =>
  pb.send<{ chave: string; valor: boolean; versao: number }>('/backend/v1/admin/pausa', {
    method: 'POST',
    body: { ativa },
  })

// ---- ganchos de teste ----

export const rodarTeste = (job: string) =>
  pb.send<{ job: string; resultado: string; execucao_id: string; nota?: string }>(
    `/backend/v1/teste/rodar/${job}`,
    { method: 'POST' },
  )

export const enviarEventoTeste = (provedor: string) =>
  pb.send<{ evento_id: string; resultado: string }>(`/backend/v1/teste/evento/${provedor}`, {
    method: 'POST',
    body: { tipo: 'teste' },
  })

export const limparTestes = () =>
  pb.send<{ apagados: Record<string, number>; usuarios_teste_desativados: number }>(
    '/backend/v1/teste/limpar',
    { method: 'POST' },
  )

// ---- alertas, execuções, eventos, questionário (leitura) ----

export const listarAlertas = () => pb.collection<Alerta>('alertas').getFullList({ sort: '-created' })

export const resolverAlerta = (id: string) => pb.collection<Alerta>('alertas').update(id, { status: 'resolvido' })

export const listarExecucoes = () => pb.collection<Execucao>('importacoes').getFullList({ sort: '-created' })

export const listarEventos = () => pb.collection<Evento>('eventos_webhook').getFullList({ sort: '-created' })

export const listarQuestionario = () =>
  pb.collection<ItemQuestionario>('questionario').getFullList({ sort: 'pergunta_id' })
