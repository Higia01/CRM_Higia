// Task ffe9ee34 (SPEC-1-001): formatos brasileiros usados pela administração.

import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

function data(iso: string) {
  const valor = iso ? parseISO(iso) : null
  return valor && isValid(valor) ? valor : null
}

export function formatarData(iso: string) {
  const valor = data(iso)
  return valor ? format(valor, 'dd/MM/yyyy', { locale: ptBR }) : '—'
}

export function formatarDataHora(iso: string) {
  const valor = data(iso)
  return valor ? format(valor, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }) : '—'
}

export function formatarRelativo(iso: string) {
  const valor = data(iso)
  return valor ? formatDistanceToNow(valor, { addSuffix: true, locale: ptBR }) : '—'
}
