import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Calendar, Clock, MapPin, Users, CheckCircle,
  AlertTriangle, XCircle, Loader,
} from 'lucide-react'
import { Card } from '../PageShell'

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
  PENDENTE: { label: 'Pendente de aprovação', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.25)', icon: AlertTriangle },
  REJEITADA: { label: 'Rejeitada', color: '#ff6b6b', bg: 'rgba(255,107,107,0.1)', border: 'rgba(255,107,107,0.25)', icon: XCircle },
}

function fmtData(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}
function fmtHora(iso: string) {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}
function fmtValor(v: number) {
  return v === 0 ? 'Gratuito' : `R$ ${v.toFixed(2).replace('.', ',')}`
}

export default function DetalheEvento() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [evento, setEvento] = useState<Evento | null>(null)
  const [inscricao, setInscricao] = useState<Inscricao | null>(null)
  const [loading, setLoading] = useState(true)
  const [acao, setAcao] = useState(false)
  const [toast, setToast] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null)

  const showToast = useCallback((type: 'ok' | 'err', msg: string) => {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 3500)
  }, [])

  const carregar = useCallback(async () => {
    if (!id) return
    try {
      setLoading(true)
      const [evRes, insRes] = await Promise.all([
        fetch(`${API}/eventos/${id}`, { headers: authHeader() }),
        fetch(`${API}/inscricoes/me`, { headers: authHeader() }),
      ])
      if (!evRes.ok) { setEvento(null); return }
      setEvento(await evRes.json())
      const minhas: Inscricao[] = await insRes.json()
      setInscricao(minhas.find(i => i.evento.id === id) ?? null)
    } catch {
      showToast('err', 'Erro ao carregar evento')
    } finally {
      setLoading(false)
    }
  }, [id, showToast])

  useEffect(() => { carregar() }, [carregar])

  async function inscrever() {
    if (!id) return
    setAcao(true)
    try {
      const res = await fetch(`${API}/inscricoes`, {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventoId: id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erro ao se inscrever')
      setInscricao({ id: data.id, status: data.status, evento: { id } })
      showToast('ok', data.status === 'PENDENTE' ? 'Inscrição realizada! Pendente de pagamento.' : 'Inscrição confirmada!')
    } catch (err: any) {
      showToast('err', err.message)
    } finally {
      setAcao(false)
    }
  }

  async function cancelar() {
    if (!inscricao) return
    setAcao(true)
    try {
      const res = await fetch(`${API}/inscricoes/${inscricao.id}`, {
        method: 'DELETE',
        headers: authHeader(),
      })
      if (!res.ok) throw new Error('Erro ao cancelar inscrição')
      setInscricao(null)
      showToast('ok', 'Inscrição cancelada.')
    } catch (err: any) {
      showToast('err', err.message)
    } finally {
      setAcao(false)
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.25)', fontFamily: 'Inter, sans-serif' }}>
        Carregando evento...
      </div>
    )
  }

  if (!evento) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.2)', fontFamily: 'Inter, sans-serif' }}>
        <Calendar size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
        <p style={{ fontSize: '14px' }}>Evento não encontrado.</p>
      </div>
    )
  }

  const cfg = inscricao ? STATUS_CONFIG[inscricao.status] : null
  const StatusIcon = cfg?.icon

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
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

      <button
        onClick={() => navigate('/dashboard/eventos')}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '20px',
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'rgba(255,255,255,0.45)', fontFamily: 'Inter, sans-serif', fontSize: '13px', padding: 0,
        }}
      >
        <ArrowLeft size={14} /> Voltar para Eventos
      </button>

      <Card style={{ padding: 0, overflow: 'hidden', maxWidth: '720px' }}>
        <div style={{
          height: '260px', overflow: 'hidden', flexShrink: 0,
          background: evento.foto ? 'transparent' : 'rgba(211,184,106,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {evento.foto
            ? <img src={`${API}${evento.foto}`} alt={evento.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <Calendar size={56} color="rgba(211,184,106,0.4)" />
          }
        </div>

        <div style={{ padding: 'clamp(20px, 3vw, 32px)' }}>
          {evento.ministerio && (
            <span style={{
              display: 'inline-block', marginBottom: '10px',
              padding: '3px 10px', borderRadius: '20px', fontSize: '11px',
              fontFamily: 'Inter, sans-serif', fontWeight: 600,
              background: 'rgba(211,184,106,0.1)', color: '#d3b86a',
              border: '1px solid rgba(211,184,106,0.2)',
            }}>
              {evento.ministerio.nome}
            </span>
          )}

          <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(20px, 2.5vw, 28px)', fontWeight: 700, color: '#fff', marginBottom: '14px' }}>
            {evento.nome}
          </h2>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'Inter, sans-serif' }}>
              <Clock size={13} /> {fmtData(evento.dataHora)} às {fmtHora(evento.dataHora)}
            </span>
            {evento.localizacao && (
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'Inter, sans-serif' }}>
                <MapPin size={13} /> {evento.localizacao}
              </span>
            )}
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'Inter, sans-serif' }}>
              <Users size={13} /> {evento._count.inscritos} inscrito{evento._count.inscritos !== 1 ? 's' : ''}
            </span>
          </div>

          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', lineHeight: 1.8, marginBottom: '24px', whiteSpace: 'pre-wrap' }}>
            {evento.descricao}
          </p>

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
            flexWrap: 'wrap', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.07)',
          }}>
            <span style={{
              fontSize: '20px', fontFamily: 'Cinzel, serif', fontWeight: 700,
              color: evento.valor === 0 ? '#34d399' : '#fbbf24',
            }}>
              {fmtValor(evento.valor)}
            </span>

            {inscricao ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 16px', borderRadius: '20px', fontSize: '13px',
                  fontFamily: 'Inter, sans-serif', fontWeight: 600,
                  background: cfg!.bg, color: cfg!.color, border: `1px solid ${cfg!.border}`,
                }}>
                  {StatusIcon && <StatusIcon size={13} />} {cfg!.label}
                </span>
                {inscricao.status !== 'REJEITADA' && (
                  <button
                    onClick={cancelar}
                    disabled={acao}
                    style={{
                      padding: '10px 18px', borderRadius: '12px', fontSize: '13px',
                      fontFamily: 'Inter, sans-serif', fontWeight: 600,
                      background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.25)',
                      color: '#ff6b6b', cursor: acao ? 'not-allowed' : 'pointer',
                      opacity: acao ? 0.6 : 1,
                    }}
                  >
                    Cancelar inscrição
                  </button>
                )}
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={inscrever}
                disabled={acao}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  padding: '13px 28px', borderRadius: '12px', fontSize: '14px',
                  fontFamily: 'Inter, sans-serif', fontWeight: 700,
                  background: 'linear-gradient(135deg, #d3b86a, #a8903a)',
                  border: 'none', color: '#000',
                  cursor: acao ? 'not-allowed' : 'pointer',
                  opacity: acao ? 0.6 : 1,
                }}
              >
                {acao
                  ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}><Loader size={15} /></motion.div>
                  : 'Inscrever-se'}
              </motion.button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
