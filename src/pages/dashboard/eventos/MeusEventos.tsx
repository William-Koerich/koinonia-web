import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, MapPin, Upload, CheckCircle, AlertTriangle, XCircle, Loader } from 'lucide-react'
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
  evento: {
    id: string
    foto: string | null
    nome: string
    dataHora: string
    localizacao: string | null
    valor: number
    ministerio: { id: string; nome: string } | null
    criador: { id: string; nome: string; sobrenome: string }
    _count: { inscritos: number }
  }
}

const STATUS_CONFIG = {
  APROVADA: { label: 'Aprovada', color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.25)', icon: CheckCircle },
  PENDENTE: { label: 'Pendente', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.25)', icon: AlertTriangle },
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

export default function MeusEventos() {
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([])
  const [loading, setLoading] = useState(true)
  const [uploadingId, setUploadingId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null)
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const showToast = useCallback((type: 'ok' | 'err', msg: string) => {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 3500)
  }, [])

  useEffect(() => {
    fetch(`${API}/inscricoes/me`, { headers: authHeader() })
      .then(r => r.json())
      .then(setInscricoes)
      .catch(() => showToast('err', 'Erro ao carregar eventos'))
      .finally(() => setLoading(false))
  }, [showToast])

  async function handleUploadComprovante(inscricaoId: string, file: File) {
    setUploadingId(inscricaoId)
    try {
      const fd = new FormData()
      fd.append('comprovante', file)
      const res = await fetch(`${API}/inscricoes/${inscricaoId}/comprovante`, {
        method: 'POST',
        headers: authHeader(),
        body: fd,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erro ao enviar comprovante')
      setInscricoes(prev => prev.map(i =>
        i.id === inscricaoId
          ? { ...i, comprovante: data.comprovante, pagoEm: data.pagoEm }
          : i
      ))
      showToast('ok', 'Comprovante enviado! Aguardando aprovação.')
    } catch (err: any) {
      showToast('err', err.message)
    } finally {
      setUploadingId(null)
    }
  }

  return (
    <PageShell title="Meus Eventos" subtitle="Eventos nos quais você está inscrito">

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

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.25)', fontFamily: 'Inter, sans-serif', fontSize: '14px' }}>
          Carregando...
        </div>
      ) : inscricoes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.2)', fontFamily: 'Inter, sans-serif' }}>
          <Calendar size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
          <p style={{ fontSize: '14px' }}>Você não está inscrito em nenhum evento ainda.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '720px' }}>
          {inscricoes.map((ins, i) => {
            const cfg = STATUS_CONFIG[ins.status]
            const StatusIcon = cfg.icon
            const precisaComprovante = ins.status === 'PENDENTE' && ins.evento.valor > 0 && !ins.comprovante
            const enviouComprovante = ins.status === 'PENDENTE' && ins.evento.valor > 0 && !!ins.comprovante

            return (
              <motion.div
                key={ins.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.32 }}
                style={{
                  borderRadius: '20px', overflow: 'hidden',
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                {ins.evento.foto && (
                  <div style={{ height: '140px', overflow: 'hidden' }}>
                    <img
                      src={`${API}${ins.evento.foto}`}
                      alt={ins.evento.nome}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                )}

                <div style={{ padding: '18px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '10px', flexWrap: 'wrap' }}>
                    <div>
                      {ins.evento.ministerio && (
                        <span style={{
                          display: 'inline-block', marginBottom: '6px',
                          padding: '2px 8px', borderRadius: '20px', fontSize: '10px',
                          fontFamily: 'Inter, sans-serif', fontWeight: 600,
                          background: 'rgba(211,184,106,0.1)', color: '#d3b86a',
                          border: '1px solid rgba(211,184,106,0.2)',
                        }}>
                          {ins.evento.ministerio.nome}
                        </span>
                      )}
                      <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '16px', fontWeight: 700, color: '#fff' }}>
                        {ins.evento.nome}
                      </h3>
                    </div>

                    <span style={{
                      display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0,
                      padding: '5px 12px', borderRadius: '20px', fontSize: '12px',
                      fontFamily: 'Inter, sans-serif', fontWeight: 600,
                      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
                    }}>
                      <StatusIcon size={12} /> {cfg.label}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '12px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'Inter, sans-serif' }}>
                      <Clock size={11} /> {fmtData(ins.evento.dataHora)} às {fmtHora(ins.evento.dataHora)}
                    </span>
                    {ins.evento.localizacao && (
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'Inter, sans-serif' }}>
                        <MapPin size={11} /> {ins.evento.localizacao}
                      </span>
                    )}
                    <span style={{
                      fontSize: '12px', fontFamily: 'Inter, sans-serif', fontWeight: 600,
                      color: ins.evento.valor === 0 ? '#34d399' : '#fbbf24',
                    }}>
                      {fmtValor(ins.evento.valor)}
                    </span>
                  </div>

                  {precisaComprovante && (
                    <div style={{
                      padding: '14px', borderRadius: '12px', marginTop: '4px',
                      background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)',
                    }}>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#fbbf24', marginBottom: '10px' }}>
                        Inscrição pendente de pagamento. Envie o comprovante para ser aprovado.
                      </p>
                      <input
                        ref={el => { fileRefs.current[ins.id] = el }}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={e => {
                          const file = e.target.files?.[0]
                          if (file) handleUploadComprovante(ins.id, file)
                        }}
                      />
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => fileRefs.current[ins.id]?.click()}
                        disabled={uploadingId === ins.id}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '6px',
                          padding: '8px 16px', borderRadius: '10px', fontSize: '12px',
                          fontFamily: 'Inter, sans-serif', fontWeight: 600,
                          background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.3)',
                          color: '#fbbf24', cursor: uploadingId === ins.id ? 'not-allowed' : 'pointer',
                          opacity: uploadingId === ins.id ? 0.6 : 1,
                        }}
                      >
                        {uploadingId === ins.id ? (
                          <><motion.div animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}><Loader size={12} /></motion.div> Enviando...</>
                        ) : (
                          <><Upload size={12} /> Enviar comprovante</>
                        )}
                      </motion.button>
                    </div>
                  )}

                  {enviouComprovante && (
                    <div style={{
                      padding: '12px 14px', borderRadius: '12px', marginTop: '4px',
                      background: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.2)',
                      display: 'flex', alignItems: 'center', gap: '8px',
                    }}>
                      <CheckCircle size={13} color="#34d399" />
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#34d399' }}>
                        Comprovante enviado em {ins.pagoEm ? new Date(ins.pagoEm).toLocaleDateString('pt-BR') : '—'}. Aguardando aprovação.
                      </p>
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
