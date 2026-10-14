// Task ffe9ee34 (SPEC-1-001): entidades de administração — produtos, ICPs, pipelines,
// cadências e modelos de mensagem. Componentes não chamam o pb direto: tudo por aqui.

import type { RecordModel } from 'pocketbase'
import pb from '@/lib/pocketbase/client'
import { mensagemDeErro } from '@/lib/mensagens-erro'

export interface Fator {
  chave: string
  parametro?: number
  peso: number
}

export interface Icp extends RecordModel {
  nome: string
  pipeline: string
  produto: string
  versao: number
  ativo: boolean
  filtros: Record<string, unknown>
  fatores: Fator[]
  bloqueios: string[]
  limiar_acionavel: number
  limiar_revisao: number
  aprovado_por: string
  aprovado_em: string
  teste: boolean
}

export interface Etapa {
  nome: string
  ordem: number
  tipo: 'aberta' | 'reuniao_agendada' | 'ganho' | 'perdido'
}

export interface Pipeline extends RecordModel {
  nome: string
  tipo: 'privada' | 'publica'
  etapas: Etapa[]
  motivos_perda: string[]
  teste: boolean
}

export interface Passo {
  ordem: number
  dia: number
  canal: 'email' | 'whatsapp' | 'ligacao' | 'linkedin'
  modelo: string
  tipo: 'auto' | 'tarefa'
}

export interface Cadencia extends RecordModel {
  pipeline: string
  nome: string
  versao: number
  ativa: boolean
  teste: boolean
  passos: Passo[]
  dias_uteis: string[]
  janela_inicio: string
  janela_fim: string
  regra_esgotamento: { tipo: 'toques' | 'dias_sem_resposta'; valor: number; motivo_perda?: string }
  aprovado_por: string
  aprovado_em: string
}

export interface ModeloMensagem extends RecordModel {
  canal: 'email' | 'whatsapp' | 'linkedin'
  nome: string
  assunto: string
  corpo: string
  meta_template: string
  versao: number
  aprovado_por: string
  aprovado_em: string
  ativo: boolean
  teste: boolean
}

export function mensagemErroAdmin(erro: unknown, acao: string): string {
  return mensagemDeErro(erro, acao)
}

// ---- produtos ----

export interface Produto extends RecordModel {
  nome: string
  descricao: string
  ativo: boolean
}

export const listarProdutos = () =>
  pb.collection<Produto>('produtos').getFullList({ sort: 'nome' })

export const criarProduto = (dados: { nome: string; descricao: string; ativo: boolean }) =>
  pb.collection<Produto>('produtos').create(dados)

export const atualizarProduto = (id: string, dados: Partial<Produto>) =>
  pb.collection<Produto>('produtos').update(id, dados)

export const excluirProduto = (id: string) => pb.collection('produtos').delete(id)

// ---- ICPs ----

export const listarIcps = () => pb.collection<Icp>('icps').getFullList({ sort: '-ativo, -versao' })

export const criarIcp = (dados: Partial<Icp>) => pb.collection<Icp>('icps').create(dados)

export const atualizarIcp = (id: string, dados: Partial<Icp>) => pb.collection<Icp>('icps').update(id, dados)

// ---- pipelines ----

export const listarPipelines = () => pb.collection<Pipeline>('pipelines').getFullList({ sort: 'nome' })

export const criarPipeline = (dados: Partial<Pipeline>) => pb.collection<Pipeline>('pipelines').create(dados)

export const atualizarPipeline = (id: string, dados: Partial<Pipeline>) =>
  pb.collection<Pipeline>('pipelines').update(id, dados)

export const excluirPipeline = (id: string) => pb.collection('pipelines').delete(id)

// ---- cadências ----

export const listarCadencias = () =>
  pb.collection<Cadencia>('cadencias').getFullList({ sort: '-ativa, -versao' })

export const criarCadencia = (dados: Partial<Cadencia>) => pb.collection<Cadencia>('cadencias').create(dados)

export const atualizarCadencia = (id: string, dados: Partial<Cadencia>) =>
  pb.collection<Cadencia>('cadencias').update(id, dados)

// ---- modelos ----

export const listarModelos = () =>
  pb.collection<ModeloMensagem>('modelos_mensagem').getFullList({ sort: '-ativo, -versao' })

export const criarModelo = (dados: Partial<ModeloMensagem>) =>
  pb.collection<ModeloMensagem>('modelos_mensagem').create(dados)

export const atualizarModelo = (id: string, dados: Partial<ModeloMensagem>) =>
  pb.collection<ModeloMensagem>('modelos_mensagem').update(id, dados)
