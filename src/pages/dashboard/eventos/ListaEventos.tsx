import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar, Clock, MapPin, Users, CheckCircle, AlertTriangle,
  XCircle, Loader, Search, X,
} from 'lucide-react'
import PageShell from '../PageShell'

import { API } from '../../../config'

function authHeader() {
  return { Authorization: `Bearer ${localStorage.getItem('koinonia_token') ?? ''}` }
}

interface Evento {
  id: string
  foto: string | null
  nome: string
  descricao: string
  dataHora: string
  localizacao: string | null
  valor: number
  ministerio: { id: string; nome: string } | null
  criador: { id: string; nome: string; sobrenome: string }
  _count: { inscritos: number }
}

type InscricaoStatus = 'PENDENTE' | 'APROVADA' | 'REJEITADA'

interface Inscricao {
  id: string
  status: InscricaoStatus
  evento: { id: string }
}

const STATUS_CONFIG = {
  APROVADA: { label: 'Inscrito', color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.25)', icon: CheckCircle },
  PENDENTE: { label: 'Pendente', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.25)', icon: AlertTriangle },
  REJEITADA: { label: 'Rejeitada', color: '#ff6b6b', bg: 'rgba(255,107,107,0.1)', border: 'rgba(255,107,107,0.25)', icon: XCircle },
}

function fmtData(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}
function fmtHora(iso: string) {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}
function fmtValor(v: number) {
  return v === 0 ? 'Gratuito' : `R$ ${v.toFixed(2).replace('.', ',')}`
}

export default function ListaEventos() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')
  const [acaoId, setAcaoId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null)

  const showToast = useCallback((type: 'ok' | 'err', msg: string) => {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 3500)
  }, [])

  const carregar = useCallback(async () => {
    try {
      setLoading(true)
      const [evRes, insRes] = await Promise.all([
        fetch(`${API}/eventos`, { headers: authHeader() }),
        fetch(`${API}/inscricoes/me`, { headers: authHeader() }),
      ])
      setEventos(await evRes.json())
      setInscricoes(await insRes.json())
    } catch {
      showToast('err', 'Erro ao carregar eventos')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => { carregar() }, [carregar])

  async function inscrever(eventoId: string) {
    setAcaoId(eventoId)
    try {
      const res = await fetch(`${API}/inscricoes`, {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventoId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erro ao se inscrever')
      setInscricoes(prev => [...prev, { id: data.id, status: data.status, evento: { id: eventoId } }])
      showToast('ok', data.status === 'PENDENTE' ? 'Inscrição realizada! Pendente de pagamento.' : 'Inscrição confirmada!')
    } catch (err: any) {
      showToast('err', err.message)
    } finally {
      setAcaoId(null)
    }
  }

  async function cancelar(inscricaoId: string) {
    setAcaoId(inscricaoId)
    try {
      const res = await fetch(`${API}/inscricoes/${inscricaoId}`, {
        method: 'DELETE',
        headers: authHeader(),
      })
      if (!res.ok) throw new Error('Erro ao cancelar inscrição')
      setInscricoes(prev => prev.filter(i => i.id !== inscricaoId))
      showToast('ok', 'Inscrição cancelada.')
    } catch (err: any) {
      showToast('err', err.message)
    } finally {
      setAcaoId(null)
    }
  }

  const filtrados = eventos.filter(e =>
    e.nome.toLowerCase().includes(busca.toLowerCase()) ||
    (e.ministerio?.nome ?? '').toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <PageShell title="Eventos" subtitle="Inscreva-se nos próximos eventos da Igreja">

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

      <div style={{ position: 'relative', maxWidth: '380px', marginBottom: '24px' }}>
        <Search size={15} style={{
          position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
          color: 'rgba(255,255,255,0.3)', pointerEvents: 'none',
        }} />
        <input
          value={busca}
          onChange={e => setBusca(e.target.value)}
          placeholder="Buscar eventos..."
          style={{
            width: '100%', background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px',
            padding: '11px 16px 11px 40px', color: '#fff', fontSize: '14px',
            fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box',
          }}
        />
        {busca && (
          <button onClick={() => setBusca('')} style={{
            position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)',
            display: 'flex', alignItems: 'center',
          }}>
            <X size={14} />
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.25)', fontFamily: 'Inter, sans-serif' }}>
          Carregando eventos...
        </div>
      ) : filtrados.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.2)', fontFamily: 'Inter, sans-serif' }}>
          <Calendar size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
          <p style={{ fontSize: '14px' }}>{busca ? 'Nenhum evento encontrado.' : 'Nenhum evento cadastrado ainda.'}</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {filtrados.map((ev, i) => {
            const inscricao = inscricoes.find(ins => ins.evento.id === ev.id)
            const cfg = inscricao ? STATUS_CONFIG[inscricao.status] : null
            const StatusIcon = cfg?.icon

            return (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.32 }}
                style={{
                  borderRadius: '20px', overflow: 'hidden',
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  display: 'flex', flexDirection: 'column',
                }}
              >
                <div style={{
                  height: '140px', overflow: 'hidden', flexShrink: 0,
                  background: ev.foto ? 'transparent' : 'rgba(211,184,106,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {ev.foto
                    ? <img src={`${API}${ev.foto}`} alt={ev.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <Calendar size={32} color="rgba(211,184,106,0.4)" />
                  }
                </div>

                <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
                    <div>
                      {ev.ministerio && (
                        <span style={{
                          display: 'inline-block', marginBottom: '6px',
                          padding: '2px 8px', borderRadius: '20px', fontSize: '10px',
                          fontFamily: 'Inter, sans-serif', fontWeight: 600,
                          background: 'rgba(211,184,106,0.1)', color: '#d3b86a',
                          border: '1px solid rgba(211,184,106,0.2)',
                        }}>
                          {ev.ministerio.nome}
                        </span>
                      )}
                      <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '16px', fontWeight: 700, color: '#fff' }}>
                        {ev.nome}
                      </h3>
                    </div>
                  </div>

                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', lineHeight: 1.6, marginBottom: '12px', flex: 1 }}>
                    {ev.descricao}
                  </p>

                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '14px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'Inter, sans-serif' }}>
                      <Clock size={11} /> {fmtData(ev.dataHora)} às {fmtHora(ev.dataHora)}
                    </span>
                    {ev.localizacao && (
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'Inter, sans-serif' }}>
                        <MapPin size={11} /> {ev.localizacao}
                      </span>
                    )}
                    <span style={{
                      fontSize: '12px', fontFamily: 'Inter, sans-serif', fontWeight: 600,
                      color: ev.valor === 0 ? '#34d399' : '#fbbf24',
                    }}>
                      {fmtValor(ev.valor)}
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'Inter, sans-serif' }}>
                      <Users size={11} /> {ev._count.inscritos} inscrito{ev._count.inscritos !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {inscricao ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <span style={{
                        display: 'flex', alignItems: 'center', gap: '5px',
                        padding: '6px 12px', borderRadius: '20px', fontSize: '12px',
                        fontFamily: 'Inter, sans-serif', fontWeight: 600,
                        background: cfg!.bg, color: cfg!.color, border: `1px solid ${cfg!.border}`,
                      }}>
                        {StatusIcon && <StatusIcon size={12} />} {cfg!.label}
                      </span>
                      {inscricao.status !== 'REJEITADA' && (
                        <button
                          onClick={() => cancelar(inscricao.id)}
                          disabled={acaoId === inscricao.id}
                          style={{
                            padding: '7px 14px', borderRadius: '10px', fontSize: '12px',
                            fontFamily: 'Inter, sans-serif', fontWeight: 600,
                            background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.25)',
                            color: '#ff6b6b', cursor: acaoId === inscricao.id ? 'not-allowed' : 'pointer',
                            opacity: acaoId === inscricao.id ? 0.6 : 1,
                          }}
                        >
                          Cancelar
                        </button>
                      )}
                    </div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => inscrever(ev.id)}
                      disabled={acaoId === ev.id}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        padding: '10px 18px', borderRadius: '12px', fontSize: '13px',
                        fontFamily: 'Inter, sans-serif', fontWeight: 600,
                        background: 'linear-gradient(135deg, #d3b86a, #a8903a)',
                        border: 'none', color: '#000',
                        cursor: acaoId === ev.id ? 'not-allowed' : 'pointer',
                        opacity: acaoId === ev.id ? 0.6 : 1,
                      }}
                    >
                      {acaoId === ev.id
                        ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}><Loader size={14} /></motion.div>
                        : 'Inscrever-se'}
                    </motion.button>
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
