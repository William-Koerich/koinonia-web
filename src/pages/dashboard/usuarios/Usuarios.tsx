import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Edit2, Trash2, PowerOff, Power, Search, X, AlertTriangle, CheckCircle } from 'lucide-react'
import PageShell from '../PageShell'

import { API } from '../../../config'

function authHeader() {
  return { Authorization: `Bearer ${localStorage.getItem('koinonia_token') ?? ''}` }
}

type TipoUsuario = 'ADMIN' | 'MEMBRO' | 'LIDER' | 'CO_LIDER' | 'PASTOR' | 'TESOUREIRO' | 'CONTADOR'

interface Usuario {
  id: string
  nome: string
  sobrenome: string
  email: string
  foto: string | null
  tipo: TipoUsuario
  ativo: boolean
  createdAt: string
}

const TIPO_LABEL: Record<TipoUsuario, string> = {
  ADMIN: 'Admin',
  MEMBRO: 'Membro',
  LIDER: 'Líder',
  CO_LIDER: 'Co-Líder',
  PASTOR: 'Pastor',
  TESOUREIRO: 'Tesoureiro',
  CONTADOR: 'Contador',
}

const TIPO_COLOR: Record<TipoUsuario, { bg: string; text: string; border: string }> = {
  ADMIN: { bg: 'rgba(239,68,68,0.12)', text: '#f87171', border: 'rgba(239,68,68,0.3)' },
  MEMBRO: { bg: 'rgba(255,255,255,0.05)', text: 'rgba(255,255,255,0.5)', border: 'rgba(255,255,255,0.1)' },
  LIDER: { bg: 'rgba(59,130,246,0.12)', text: '#60a5fa', border: 'rgba(59,130,246,0.25)' },
  CO_LIDER: { bg: 'rgba(99,102,241,0.12)', text: '#a5b4fc', border: 'rgba(99,102,241,0.25)' },
  PASTOR: { bg: 'rgba(211,184,106,0.12)', text: '#d3b86a', border: 'rgba(211,184,106,0.25)' },
  TESOUREIRO: { bg: 'rgba(16,185,129,0.12)', text: '#34d399', border: 'rgba(16,185,129,0.25)' },
  CONTADOR: { bg: 'rgba(245,158,11,0.12)', text: '#fbbf24', border: 'rgba(245,158,11,0.25)' },
}

function TipoBadge({ tipo }: { tipo: TipoUsuario }) {
  const c = TIPO_COLOR[tipo]
  return (
    <span style={{
      padding: '3px 10px', borderRadius: '20px', fontSize: '11px',
      fontWeight: 600, fontFamily: 'Inter, sans-serif', letterSpacing: '0.3px',
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
    }}>
      {TIPO_LABEL[tipo]}
    </span>
  )
}

function AtivoTag({ ativo }: { ativo: boolean }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: '3px 10px', borderRadius: '20px', fontSize: '11px',
      fontWeight: 600, fontFamily: 'Inter, sans-serif',
      background: ativo ? 'rgba(52,211,153,0.08)' : 'rgba(255,107,107,0.08)',
      color: ativo ? '#34d399' : '#ff6b6b',
      border: `1px solid ${ativo ? 'rgba(52,211,153,0.2)' : 'rgba(255,107,107,0.2)'}`,
    }}>
      <span style={{
        width: '5px', height: '5px', borderRadius: '50%',
        background: ativo ? '#34d399' : '#ff6b6b',
        display: 'inline-block',
      }} />
      {ativo ? 'Ativo' : 'Inativo'}
    </span>
  )
}

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel: string
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmDialog({ open, title, message, confirmLabel, danger = false, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px',
          }}
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ duration: 0.22 }}
            onClick={e => e.stopPropagation()}
            style={{
              background: '#0d0f1e',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '20px', padding: '28px',
              width: '100%', maxWidth: '400px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '20px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                background: danger ? 'rgba(255,107,107,0.12)' : 'rgba(211,184,106,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <AlertTriangle size={18} color={danger ? '#ff6b6b' : '#d3b86a'} />
              </div>
              <div>
                <h4 style={{ fontFamily: 'Cinzel, serif', fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
                  {title}
                </h4>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
                  {message}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={onCancel}
                style={{
                  padding: '9px 18px', borderRadius: '10px', fontSize: '13px',
                  fontFamily: 'Inter, sans-serif', fontWeight: 600,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
                }}
              >
                Cancelar
              </button>
              <button
                onClick={onConfirm}
                style={{
                  padding: '9px 18px', borderRadius: '10px', fontSize: '13px',
                  fontFamily: 'Inter, sans-serif', fontWeight: 600,
                  background: danger ? 'rgba(255,107,107,0.15)' : 'rgba(211,184,106,0.15)',
                  border: `1px solid ${danger ? 'rgba(255,107,107,0.3)' : 'rgba(211,184,106,0.3)'}`,
                  color: danger ? '#ff6b6b' : '#d3b86a', cursor: 'pointer',
                }}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function Usuarios() {
  const navigate = useNavigate()
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')
  const [toast, setToast] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null)
  const [confirm, setConfirm] = useState<{
    open: boolean
    tipo: 'deletar' | 'toggle'
    usuario: Usuario | null
  }>({ open: false, tipo: 'deletar', usuario: null })

  const showToast = useCallback((type: 'ok' | 'err', msg: string) => {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 3500)
  }, [])

  const carregarUsuarios = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API}/usuarios`, { headers: authHeader() })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setUsuarios(data)
    } catch {
      showToast('err', 'Erro ao carregar usuários')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => { carregarUsuarios() }, [carregarUsuarios])

  async function handleToggleAtivo() {
    const u = confirm.usuario!
    setConfirm(c => ({ ...c, open: false }))
    try {
      const res = await fetch(`${API}/usuarios/${u.id}/toggle-ativo`, {
        method: 'PATCH',
        headers: authHeader(),
      })
      if (!res.ok) throw new Error()
      const updated = await res.json()
      setUsuarios(prev => prev.map(x => x.id === u.id ? { ...x, ativo: updated.ativo } : x))
      showToast('ok', `Usuário ${updated.ativo ? 'ativado' : 'inativado'} com sucesso!`)
    } catch {
      showToast('err', 'Erro ao alterar status do usuário')
    }
  }

  async function handleDeletar() {
    const u = confirm.usuario!
    setConfirm(c => ({ ...c, open: false }))
    try {
      const res = await fetch(`${API}/usuarios/${u.id}`, {
        method: 'DELETE',
        headers: authHeader(),
      })
      if (!res.ok) throw new Error()
      setUsuarios(prev => prev.filter(x => x.id !== u.id))
      showToast('ok', 'Usuário excluído com sucesso!')
    } catch {
      showToast('err', 'Erro ao excluir usuário')
    }
  }

  const filtrados = usuarios.filter(u =>
    `${u.nome} ${u.sobrenome} ${u.email}`.toLowerCase().includes(busca.toLowerCase())
  )

  const initials = (u: Usuario) =>
    `${u.nome?.[0] ?? ''}${u.sobrenome?.[0] ?? ''}`.toUpperCase() || 'U'

  return (
    <PageShell title="Usuários" subtitle={`${usuarios.length} usuário${usuarios.length !== 1 ? 's' : ''} cadastrado${usuarios.length !== 1 ? 's' : ''}`}>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            style={{
              position: 'fixed', top: '24px', right: '24px', zIndex: 900,
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '12px 18px', borderRadius: '12px', fontSize: '13px',
              fontFamily: 'Inter, sans-serif',
              color: toast.type === 'ok' ? '#34d399' : '#ff6b6b',
              background: toast.type === 'ok' ? 'rgba(52,211,153,0.1)' : 'rgba(255,107,107,0.1)',
              border: `1px solid ${toast.type === 'ok' ? 'rgba(52,211,153,0.25)' : 'rgba(255,107,107,0.25)'}`,
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {toast.type === 'ok' ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm dialog */}
      <ConfirmDialog
        open={confirm.open}
        tipo={confirm.tipo}
        title={confirm.tipo === 'deletar' ? 'Excluir usuário' : confirm.usuario?.ativo ? 'Inativar usuário' : 'Ativar usuário'}
        message={
          confirm.tipo === 'deletar'
            ? `Tem certeza que deseja excluir ${confirm.usuario?.nome} ${confirm.usuario?.sobrenome}? Esta ação não pode ser desfeita.`
            : confirm.usuario?.ativo
              ? `Deseja inativar ${confirm.usuario?.nome} ${confirm.usuario?.sobrenome}? O usuário não poderá acessar o sistema.`
              : `Deseja ativar ${confirm.usuario?.nome} ${confirm.usuario?.sobrenome}?`
        }
        confirmLabel={confirm.tipo === 'deletar' ? 'Excluir' : confirm.usuario?.ativo ? 'Inativar' : 'Ativar'}
        danger={confirm.tipo === 'deletar'}
        onConfirm={confirm.tipo === 'deletar' ? handleDeletar : handleToggleAtivo}
        onCancel={() => setConfirm(c => ({ ...c, open: false }))}
      />

      {/* Barra de busca */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        marginBottom: '24px', flexWrap: 'wrap',
      }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px', maxWidth: '420px' }}>
          <Search size={15} style={{
            position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
            color: 'rgba(255,255,255,0.3)', pointerEvents: 'none',
          }} />
          <input
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Buscar por nome ou e-mail..."
            style={{
              width: '100%', background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px',
              padding: '11px 16px 11px 40px', color: '#fff', fontSize: '14px',
              fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box',
            }}
          />
          {busca && (
            <button
              onClick={() => setBusca('')}
              style={{
                position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)',
                display: 'flex', alignItems: 'center',
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Lista */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.25)', fontFamily: 'Inter, sans-serif', fontSize: '14px' }}>
          Carregando usuários...
        </div>
      ) : filtrados.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '60px 0',
          color: 'rgba(255,255,255,0.2)', fontFamily: 'Inter, sans-serif',
        }}>
          <Users size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
          <p style={{ fontSize: '14px' }}>{busca ? 'Nenhum usuário encontrado para a busca.' : 'Nenhum usuário cadastrado.'}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtrados.map((u, i) => (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '14px 18px', borderRadius: '16px',
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.06)',
                opacity: u.ativo ? 1 : 0.6,
                flexWrap: 'wrap',
              }}
            >
              {/* Avatar */}
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                overflow: 'hidden',
                background: u.foto ? 'transparent' : 'linear-gradient(135deg, #d3b86a, #0a215b)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '15px', color: '#fff',
              }}>
                {u.foto
                  ? <img src={`${API}${u.foto}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : initials(u)
                }
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: '160px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '14px', color: '#fff' }}>
                    {u.nome} {u.sobrenome}
                  </span>
                  <TipoBadge tipo={u.tipo} />
                  <AtivoTag ativo={u.ativo} />
                </div>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>
                  {u.email}
                </span>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                <ActionBtn
                  title="Editar usuário"
                  color="#60a5fa"
                  onClick={() => navigate(`/dashboard/usuarios/${u.id}/editar`)}
                >
                  <Edit2 size={14} />
                </ActionBtn>

                <ActionBtn
                  title={u.ativo ? 'Inativar usuário' : 'Ativar usuário'}
                  color={u.ativo ? '#fbbf24' : '#34d399'}
                  onClick={() => setConfirm({ open: true, tipo: 'toggle', usuario: u })}
                >
                  {u.ativo ? <PowerOff size={14} /> : <Power size={14} />}
                </ActionBtn>

                <ActionBtn
                  title="Excluir usuário"
                  color="#ff6b6b"
                  onClick={() => setConfirm({ open: true, tipo: 'deletar', usuario: u })}
                >
                  <Trash2 size={14} />
                </ActionBtn>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </PageShell>
  )
}

function ActionBtn({
  children, title, color, onClick,
}: {
  children: React.ReactNode
  title: string
  color: string
  onClick: () => void
}) {
  return (
    <motion.button
      title={title}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      style={{
        width: '34px', height: '34px', borderRadius: '10px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `${color}14`, border: `1px solid ${color}33`,
        color, cursor: 'pointer',
      }}
    >
      {children}
    </motion.button>
  )
}
