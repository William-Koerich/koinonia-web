export type TipoUsuario = 'ADMIN' | 'PASTOR' | 'LIDER' | 'CO_LIDER' | 'MEMBRO' | 'TESOUREIRO' | 'CONTADOR'

const GESTORES: TipoUsuario[] = ['ADMIN', 'PASTOR', 'LIDER', 'CO_LIDER']

function getTipo(): TipoUsuario | null {
  try {
    const raw = localStorage.getItem('koinonia_usuario')
    if (!raw) return null
    const u = JSON.parse(raw)
    return u.tipo ?? null
  } catch {
    return null
  }
}

function getId(): string | null {
  try {
    const raw = localStorage.getItem('koinonia_usuario')
    if (!raw) return null
    const u = JSON.parse(raw)
    return u.id ?? null
  } catch {
    return null
  }
}

export function usePermissao() {
  const tipo = getTipo()
  const userId = getId()

  const podeGerenciar = tipo !== null && GESTORES.includes(tipo)

  function podeAprovarEvento(criadorId: string, ministerioLiderId?: string | null, ministerioCoLideresIds?: string[]): boolean {
    if (!tipo || !userId) return false
    if (tipo === 'ADMIN') return true
    if (userId === criadorId) return true
    if (ministerioLiderId && userId === ministerioLiderId) return true
    if (ministerioCoLideresIds?.includes(userId)) return true
    return false
  }

  return { tipo, userId, podeGerenciar, podeAprovarEvento }
}
