// Task ed14fa15 (SPEC-1-001): camada de autenticação e de usuários.
// Componentes não chamam o pb direto: tudo passa por aqui. Erros em PT-BR.

import pb from '@/lib/pocketbase/client'
import { getErrorMessage } from '@/lib/pocketbase/errors'

export type Papel = 'admin' | 'gestor' | 'sdr' | 'licitacao'

export interface Usuario {
  id: string
  name: string
  email: string
  papel: Papel
  ativo: boolean
  teste: boolean
}

export function usuarioAtual(): Usuario | null {
  const r = pb.authStore.record
  if (!r) return null
  return {
    id: r.id,
    name: (r.name as string) || '',
    email: (r.email as string) || '',
    papel: (r.papel as Papel) || 'sdr',
    ativo: (r.ativo as boolean) ?? true,
    teste: (r.teste as boolean) ?? false,
  }
}

export function papelAtual(): Papel | null {
  const u = usuarioAtual()
  return u ? u.papel : null
}

export function podeAcessarAdmin(): boolean {
  const p = papelAtual()
  return p === 'admin' || p === 'gestor'
}

export async function entrar(email: string, senha: string): Promise<Usuario> {
  try {
    await pb.collection('users').authWithPassword(email, senha)
    const u = usuarioAtual()
    if (!u) throw new Error('Não foi possível carregar o seu usuário após entrar.')
    return u
  } catch (error) {
    throw new Error(
      traduzErroLogin(error),
    )
  }
}

export async function sair(): Promise<void> {
  pb.authStore.clear()
}

function traduzErroLogin(error: unknown): string {
  if (error instanceof Error && /failed to authenticate/i.test(error.message)) {
    return 'E-mail ou senha incorretos. Tente novamente.'
  }
  return getErrorMessage(error) || 'Não foi possível entrar. Tente novamente.'
}

export function listarUsuarios(): Promise<Usuario[]> {
  return pb
    .collection('users')
    .getFullList<Usuario>({ sort: 'name' })
    .catch((error) => {
      throw new Error(traduzErroGeral(error))
    })
}

export async function criarUsuario(dados: {
  name: string
  email: string
  papel: Papel
  senha: string
}): Promise<Usuario> {
  try {
    return (await pb
      .collection('users')
      .create<Usuario>({ name: dados.name, email: dados.email, papel: dados.papel, password: dados.senha, passwordConfirm: dados.senha })) as Usuario
  } catch (error) {
    throw new Error(traduzErroGeral(error))
  }
}

export async function editarUsuario(
  id: string,
  dados: { name?: string; papel?: Papel; ativo?: boolean },
): Promise<void> {
  try {
    await pb.collection('users').update(id, dados)
  } catch (error) {
    throw new Error(traduzErroGeral(error))
  }
}

function traduzErroGeral(error: unknown): string {
  const msg = getErrorMessage(error)
  if (/403|permission|authorization/i.test(msg)) {
    return 'Você não tem permissão para esta ação.'
  }
  return msg || 'Algo deu errado. Tente novamente.'
}
