import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertTriangle, Clock, Users, Calendar } from 'lucide-react'
import PageShell from '../PageShell'

import { API } from '../../../config'

function authHeader() {
  return { Authorization: `Bearer ${localStorage.getItem('koinonia_token') ?? ''}` }
}

type InscricaoStatus = 'PENDENTE' | 'APROVADA' | 'REJEITADA'

interface Inscricao {
  id: string
  status: InscricaoStatus
  createdAt: string
  usuario: { id: string; nome: string; sobrenome: string; email: string; foto: string | null }
  evento: { id: string; nome: string; foto: string | null; dataHora: string; valor: number }
}

const STATUS_CONFIG = {
  APROVADA: { label: 'Aprovada', color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.25)' },
  PENDENTE: { label: 'Pendente', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.25)' },
  REJEITADA: { label: 'Rejeitada', color: '#ff6b6b', bg: 'rgba(255,107,107,0.1)', border: 'rgba(255,107,107,0.25)' },
}

type FilterTab = 'TODOS' | InscricaoStatus

export default function GerenciarInscricoes() {
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterTab>('PENDENTE')
  const [processando, setProcessando] = useState<string | null>(null)
  const [toast, setToast] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null)

  const showToast = useCallback((type: 'ok' | 'err', msg: string) => {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 3500)
  }, [])

  const carregar = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API}/inscricoes/gerenciar`, { headers: authHeader() })
      setInscricoes(await res.json())
    } catch {
      showToast('err', 'Erro ao carregar inscrições')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => { carregar() }, [carregar])

  async function acao(inscricaoId: string, tipo: 'aprovar' | 'rejeitar') {
    setProcessando(inscricaoId)
    try {
      const res = await fetch(`${API}/inscricoes/${inscricaoId}/${tipo}`, {
        method: 'PATCH',
        headers: authHeader(),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erro')
      setInscricoes(prev => prev.map(i => i.id === inscricaoId ? { ...i, status: data.status } : i))
      showToast('ok', tipo === 'aprovar' ? 'Inscrição aprovada!' : 'Inscrição rejeitada.')
    } catch (err: any) {
      showToast('err', err.message)
    } finally {
      setProcessando(null)
    }
  }

  const exibidos = filter === 'TODOS' ? inscricoes : inscricoes.filter(i => i.status === filter)

  const counts = {
    TODOS: inscricoes.length,
    PENDENTE: inscricoes.filter(i => i.status === 'PENDENTE').length,
    APROVADA: inscricoes.filter(i => i.status === 'APROVADA').length,
    REJEITADA: inscricoes.filter(i => i.status === 'REJEITADA').length,
  }

  return (
    <PageShell title="Gerenciar Inscrições" subtitle="Aprove ou rejeite inscrições nos eventos que você gerencia">
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

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {(['PENDENTE', 'APROVADA', 'REJEITADA', 'TODOS'] as FilterTab[]).map(tab => {
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

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.25)', fontFamily: 'Inter, sans-serif', fontSize: '14px' }}>
          Carregando inscrições...
        </div>
      ) : exibidos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.2)', fontFamily: 'Inter, sans-serif' }}>
          <Users size={36} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
          <p style={{ fontSize: '14px' }}>Nenhuma inscrição nesta categoria.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px' }}>
          {exibidos.map((ins, i) => {
            const cfg = STATUS_CONFIG[ins.status]
            const initials = `${ins.usuario.nome?.[0] ?? ''}${ins.usuario.sobrenome?.[0] ?? ''}`.toUpperCase()
            const isProcessing = processando === ins.id

            return (
              <motion.div
                key={ins.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.28 }}
                style={{
                  padding: '18px', borderRadius: '18px',
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex', flexDirection: 'column', gap: '12px',
                }}
              >
                {/* Evento */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0, overflow: 'hidden',
                    background: ins.evento.foto ? 'transparent' : 'rgba(211,184,106,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {ins.evento.foto
                      ? <img src={`${API}${ins.evento.foto}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <Calendar size={16} color="rgba(211,184,106,0.5)" />
                    }
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '13px', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {ins.evento.nome}
                    </p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>
                      {new Date(ins.evento.dataHora).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>

                <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

                {/* Usuário */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0, overflow: 'hidden',
                    background: ins.usuario.foto ? 'transparent' : 'linear-gradient(135deg, #d3b86a, #0a215b)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '12px', color: '#fff',
                  }}>
                    {ins.usuario.foto
                      ? <img src={`${API}${ins.usuario.foto}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : initials
                    }
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '13px', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {ins.usuario.nome} {ins.usuario.sobrenome}
                    </p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {ins.usuario.email}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <span style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    padding: '4px 10px', borderRadius: '20px', fontSize: '11px',
                    fontFamily: 'Inter, sans-serif', fontWeight: 600,
                    background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
                  }}>
                    <Clock size={10} /> {cfg.label}
                  </span>

                  {ins.status === 'PENDENTE' && (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={isProcessing}
                        onClick={() => acao(ins.id, 'aprovar')}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '5px',
                          padding: '6px 12px', borderRadius: '10px', fontSize: '12px',
                          fontFamily: 'Inter, sans-serif', fontWeight: 600,
                          background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.3)',
                          color: '#34d399', cursor: isProcessing ? 'not-allowed' : 'pointer',
                          opacity: isProcessing ? 0.5 : 1,
                        }}
                      >
                        <CheckCircle size={12} /> Aceitar
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={isProcessing}
                        onClick={() => acao(ins.id, 'rejeitar')}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '5px',
                          padding: '6px 12px', borderRadius: '10px', fontSize: '12px',
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
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </PageShell>
  )
}
