import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, CheckCircle, XCircle, AlertTriangle, Clock,
  Users, ExternalLink,
} from 'lucide-react'
import PageShell from '../PageShell'

import { API } from '../../../config'

function authHeader() {
  return { Authorization: `Bearer ${localStorage.getItem('koinonia_token') ?? ''}` }
}

type InscricaoStatus = 'PENDENTE' | 'APROVADA' | 'REJEITADA'

interface Inscricao {
  id: string
  status: InscricaoStatus
  pagoEm: string | null
  comprovante: string | null
  createdAt: string
  usuario: {
    id: string
    nome: string
    sobrenome: string
    email: string
    foto: string | null
    tipo: string
  }
}

const STATUS_CONFIG = {
  APROVADA: { label: 'Aprovada', color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.25)' },
  PENDENTE: { label: 'Pendente', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.25)' },
  REJEITADA: { label: 'Rejeitada', color: '#ff6b6b', bg: 'rgba(255,107,107,0.1)', border: 'rgba(255,107,107,0.25)' },
}

type FilterTab = 'TODOS' | InscricaoStatus

export default function InscritosEvento() {
  const { id: eventoId } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [inscricoes, setInscricoes] = useState<Inscricao[]>([])
  const [eventoNome, setEventoNome] = useState('')
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterTab>('TODOS')
  const [processando, setProcessando] = useState<string | null>(null)
  const [toast, setToast] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null)
  const [semPermissao, setSemPermissao] = useState(false)

  const showToast = useCallback((type: 'ok' | 'err', msg: string) => {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 3500)
  }, [])

  useEffect(() => {
    if (!eventoId) return

    // Carrega nome do evento
    fetch(`${API}/eventos/${eventoId}`, { headers: authHeader() })
      .then(r => r.json())
      .then(ev => setEventoNome(ev.nome ?? ''))
      .catch(() => {})

    // Carrega inscritos
    fetch(`${API}/eventos/${eventoId}/inscritos`, { headers: authHeader() })
      .then(async r => {
        if (r.status === 403) { setSemPermissao(true); return [] }
        return r.json()
      })
      .then(data => Array.isArray(data) && setInscricoes(data))
      .catch(() => showToast('err', 'Erro ao carregar inscritos'))
      .finally(() => setLoading(false))
  }, [eventoId, showToast])

  async function acao(inscricaoId: string, tipo: 'aprovar' | 'rejeitar') {
    setProcessando(inscricaoId)
    try {
      const res = await fetch(`${API}/inscricoes/${inscricaoId}/${tipo}`, {
        method: 'PATCH',
        headers: authHeader(),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erro')
      setInscricoes(prev => prev.map(i =>
        i.id === inscricaoId ? { ...i, status: data.status } : i
      ))
      showToast('ok', tipo === 'aprovar' ? 'Inscrição aprovada!' : 'Inscrição rejeitada.')
    } catch (err: any) {
      showToast('err', err.message)
    } finally {
      setProcessando(null)
    }
  }

  const exibidos = filter === 'TODOS'
    ? inscricoes
    : inscricoes.filter(i => i.status === filter)

  const counts = {
    TODOS: inscricoes.length,
    PENDENTE: inscricoes.filter(i => i.status === 'PENDENTE').length,
    APROVADA: inscricoes.filter(i => i.status === 'APROVADA').length,
    REJEITADA: inscricoes.filter(i => i.status === 'REJEITADA').length,
  }

  return (
    <PageShell
      title="Inscritos"
      subtitle={eventoNome ? `Gerenciar inscrições — ${eventoNome}` : 'Gerenciar inscrições'}
    >
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
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)',
            }}
          >
            {toast.type === 'ok' ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voltar */}
      <button
        onClick={() => navigate('/dashboard/eventos/editar')}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '20px',
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'rgba(255,255,255,0.45)', fontFamily: 'Inter, sans-serif', fontSize: '13px', padding: 0,
        }}
      >
        <ArrowLeft size={14} /> Voltar para Eventos
      </button>

      {semPermissao ? (
        <div style={{
          padding: '40px', borderRadius: '20px', textAlign: 'center',
          background: 'rgba(255,107,107,0.06)', border: '1px solid rgba(255,107,107,0.2)',
        }}>
          <XCircle size={36} color="#ff6b6b" style={{ margin: '0 auto 12px' }} />
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#ff6b6b' }}>
            Você não tem permissão para gerenciar inscrições deste evento.
          </p>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginTop: '6px' }}>
            Apenas o criador do evento, o líder e co-líder do ministério responsável podem aprovar inscrições.
          </p>
        </div>
      ) : loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.25)', fontFamily: 'Inter, sans-serif', fontSize: '14px' }}>
          Carregando inscritos...
        </div>
      ) : (
        <>
          {/* Filtros */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {(['TODOS', 'PENDENTE', 'APROVADA', 'REJEITADA'] as FilterTab[]).map(tab => {
              const isActive = filter === tab
              const cfg = tab === 'TODOS'
                ? { color: '#fff', bg: 'rgba(255,255,255,0.08)', border: 'rgba(255,255,255,0.15)' }
                : STATUS_CONFIG[tab]
              return (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '7px 14px', borderRadius: '20px', fontSize: '12px',
                    fontFamily: 'Inter, sans-serif', fontWeight: 600, cursor: 'pointer',
                    background: isActive ? cfg.bg : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isActive ? cfg.border : 'rgba(255,255,255,0.06)'}`,
                    color: isActive ? cfg.color : 'rgba(255,255,255,0.35)',
                    transition: 'all 0.15s',
                  }}
                >
                  {tab === 'TODOS' ? 'Todos' : STATUS_CONFIG[tab].label}
                  <span style={{
                    background: isActive ? cfg.bg : 'rgba(255,255,255,0.06)',
                    color: isActive ? cfg.color : 'rgba(255,255,255,0.3)',
                    padding: '1px 6px', borderRadius: '10px', fontSize: '10px',
                  }}>
                    {counts[tab]}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Lista */}
          {exibidos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.2)', fontFamily: 'Inter, sans-serif' }}>
              <Users size={36} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
              <p style={{ fontSize: '14px' }}>Nenhuma inscrição nesta categoria.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {exibidos.map((ins, i) => {
                const cfg = STATUS_CONFIG[ins.status]
                const initials = `${ins.usuario.nome?.[0] ?? ''}${ins.usuario.sobrenome?.[0] ?? ''}`.toUpperCase()
                const isProcessing = processando === ins.id

                return (
                  <motion.div
                    key={ins.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.28 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '14px',
                      padding: '14px 18px', borderRadius: '16px',
                      background: 'rgba(255,255,255,0.025)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      flexWrap: 'wrap',
                    }}
                  >
                    {/* Avatar */}
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                      overflow: 'hidden',
                      background: ins.usuario.foto ? 'transparent' : 'linear-gradient(135deg, #d3b86a, #0a215b)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '14px', color: '#fff',
                    }}>
                      {ins.usuario.foto
                        ? <img src={`${API}${ins.usuario.foto}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : initials
                      }
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: '160px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '3px' }}>
                        <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '14px', color: '#fff' }}>
                          {ins.usuario.nome} {ins.usuario.sobrenome}
                        </span>
                        <span style={{
                          padding: '2px 8px', borderRadius: '20px', fontSize: '11px',
                          fontFamily: 'Inter, sans-serif', fontWeight: 600,
                          background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
                        }}>
                          {cfg.label}
                        </span>
                      </div>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>
                        {ins.usuario.email}
                      </span>
                      {ins.pagoEm && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px', fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
                          <Clock size={10} /> Pago em {new Date(ins.pagoEm).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </div>

                    {/* Comprovante */}
                    {ins.comprovante && (
                      <a
                        href={`${API}${ins.comprovante}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: 'flex', alignItems: 'center', gap: '5px',
                          padding: '6px 12px', borderRadius: '10px', fontSize: '12px',
                          fontFamily: 'Inter, sans-serif', fontWeight: 600,
                          background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.25)',
                          color: '#60a5fa', textDecoration: 'none',
                        }}
                      >
                        <ExternalLink size={11} /> Comprovante
                      </a>
                    )}

                    {/* Ações */}
                    {ins.status === 'PENDENTE' && (
                      <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          disabled={isProcessing}
                          onClick={() => acao(ins.id, 'aprovar')}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '5px',
                            padding: '7px 14px', borderRadius: '10px', fontSize: '12px',
                            fontFamily: 'Inter, sans-serif', fontWeight: 600,
                            background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.3)',
                            color: '#34d399', cursor: isProcessing ? 'not-allowed' : 'pointer',
                            opacity: isProcessing ? 0.5 : 1,
                          }}
                        >
                          <CheckCircle size={12} /> Aprovar
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          disabled={isProcessing}
                          onClick={() => acao(ins.id, 'rejeitar')}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '5px',
                            padding: '7px 14px', borderRadius: '10px', fontSize: '12px',
                            fontFamily: 'Inter, sans-serif', fontWeight: 600,
                            background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.25)',
                            color: '#ff6b6b', cursor: isProcessing ? 'not-allowed' : 'pointer',
                            opacity: isProcessing ? 0.5 : 1,
                          }}
                        >
                          <XCircle size={12} /> Rejeitar
                        </motion.button>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          )}
        </>
      )}
    </PageShell>
  )
}
