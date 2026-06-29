import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar, MapPin, Clock, Edit2, Trash2, Users,
  Search, X, AlertTriangle, CheckCircle, Plus,
} from 'lucide-react'
import PageShell from '../PageShell'
import { usePermissao } from '../../../hooks/usePermissao'

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

function fmtData(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}
function fmtHora(iso: string) {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}
function fmtValor(v: number) {
  return v === 0 ? 'Gratuito' : `R$ ${v.toFixed(2).replace('.', ',')}`
}

export default function EditarEvento() {
  const navigate = useNavigate()
  const { podeGerenciar } = usePermissao()
  const [eventos, setEventos] = useState<Evento[]>([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')
  const [deletando, setDeletando] = useState<Evento | null>(null)
  const [toast, setToast] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null)

  const showToast = useCallback((type: 'ok' | 'err', msg: string) => {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 3500)
  }, [])

  const carregar = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API}/eventos`, { headers: authHeader() })
      setEventos(await res.json())
    } catch {
      showToast('err', 'Erro ao carregar eventos')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => { carregar() }, [carregar])

  async function confirmarDelete() {
    if (!deletando) return
    try {
      const res = await fetch(`${API}/eventos/${deletando.id}`, {
        method: 'DELETE',
        headers: authHeader(),
      })
      if (!res.ok) throw new Error()
      setEventos(prev => prev.filter(e => e.id !== deletando.id))
      showToast('ok', 'Evento excluído!')
    } catch {
      showToast('err', 'Erro ao excluir evento')
    } finally {
      setDeletando(null)
    }
  }

  const filtrados = eventos.filter(e =>
    e.nome.toLowerCase().includes(busca.toLowerCase()) ||
    (e.ministerio?.nome ?? '').toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <PageShell title="Gerenciar Eventos" subtitle={`${eventos.length} evento${eventos.length !== 1 ? 's' : ''} cadastrado${eventos.length !== 1 ? 's' : ''}`}>

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

      {/* Confirm delete */}
      <AnimatePresence>
        {deletando && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeletando(null)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(4px)', zIndex: 1000,
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
            }}
          >
            <motion.div
              initial={{ scale: 0.92, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 16 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: '#0d0f1e', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '400px',
              }}
            >
              <div style={{ display: 'flex', gap: '14px', marginBottom: '20px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(255,107,107,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <AlertTriangle size={18} color="#ff6b6b" />
                </div>
                <div>
                  <h4 style={{ fontFamily: 'Cinzel, serif', fontSize: '15px', color: '#fff', marginBottom: '6px' }}>
                    Excluir evento
                  </h4>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
                    Tem certeza que deseja excluir <strong style={{ color: '#fff' }}>{deletando.nome}</strong>? Todas as inscrições serão perdidas.
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button onClick={() => setDeletando(null)} style={{
                  padding: '9px 18px', borderRadius: '10px', fontSize: '13px',
                  fontFamily: 'Inter, sans-serif', fontWeight: 600,
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
                }}>
                  Cancelar
                </button>
                <button onClick={confirmarDelete} style={{
                  padding: '9px 18px', borderRadius: '10px', fontSize: '13px',
                  fontFamily: 'Inter, sans-serif', fontWeight: 600,
                  background: 'rgba(255,107,107,0.15)', border: '1px solid rgba(255,107,107,0.3)',
                  color: '#ff6b6b', cursor: 'pointer',
                }}>
                  Excluir
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px', maxWidth: '380px' }}>
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
        {podeGerenciar && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/dashboard/eventos/criar')}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '11px 18px', borderRadius: '12px', fontSize: '13px',
              fontFamily: 'Inter, sans-serif', fontWeight: 600,
              background: 'linear-gradient(135deg, #d3b86a, #a8903a)',
              border: 'none', color: '#000', cursor: 'pointer',
            }}
          >
            <Plus size={14} />
            Novo Evento
          </motion.button>
        )}
      </div>

      {/* Lista */}
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtrados.map((ev, i) => (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              style={{
                display: 'flex', gap: '16px', alignItems: 'center',
                padding: '16px', borderRadius: '18px',
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.07)',
                flexWrap: 'wrap',
              }}
            >
              {/* Thumb */}
              <div style={{
                width: '70px', height: '70px', borderRadius: '12px', flexShrink: 0,
                overflow: 'hidden',
                background: ev.foto ? 'transparent' : 'rgba(211,184,106,0.08)',
                border: '1px solid rgba(211,184,106,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {ev.foto
                  ? <img src={`${API}${ev.foto}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <Calendar size={22} color="rgba(211,184,106,0.4)" />
                }
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: '180px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '5px' }}>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '15px', color: '#fff' }}>
                    {ev.nome}
                  </span>
                  {ev.ministerio && (
                    <span style={{
                      padding: '2px 8px', borderRadius: '20px', fontSize: '11px',
                      fontFamily: 'Inter, sans-serif', fontWeight: 600,
                      background: 'rgba(211,184,106,0.1)', color: '#d3b86a',
                      border: '1px solid rgba(211,184,106,0.2)',
                    }}>
                      {ev.ministerio.nome}
                    </span>
                  )}
                  <span style={{
                    padding: '2px 8px', borderRadius: '20px', fontSize: '11px',
                    fontFamily: 'Inter, sans-serif', fontWeight: 600,
                    background: ev.valor === 0 ? 'rgba(52,211,153,0.1)' : 'rgba(251,191,36,0.1)',
                    color: ev.valor === 0 ? '#34d399' : '#fbbf24',
                    border: `1px solid ${ev.valor === 0 ? 'rgba(52,211,153,0.2)' : 'rgba(251,191,36,0.2)'}`,
                  }}>
                    {fmtValor(ev.valor)}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <span style={{ color: 'rgba(255,255,255,0.38)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'Inter, sans-serif' }}>
                    <Clock size={11} /> {fmtData(ev.dataHora)} às {fmtHora(ev.dataHora)}
                  </span>
                  {ev.localizacao && (
                    <span style={{ color: 'rgba(255,255,255,0.38)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'Inter, sans-serif' }}>
                      <MapPin size={11} /> {ev.localizacao}
                    </span>
                  )}
                  <span style={{ color: 'rgba(255,255,255,0.38)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'Inter, sans-serif' }}>
                    <Users size={11} /> {ev._count.inscritos} inscrito{ev._count.inscritos !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Ações */}
              <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                <ActionBtn title="Ver inscritos" color="#a5b4fc" onClick={() => navigate(`/dashboard/eventos/${ev.id}/inscritos`)}>
                  <Users size={14} />
                </ActionBtn>
                {podeGerenciar && (
                  <>
                    <ActionBtn title="Editar evento" color="#60a5fa" onClick={() => navigate(`/dashboard/eventos/${ev.id}/editar`)}>
                      <Edit2 size={14} />
                    </ActionBtn>
                    <ActionBtn title="Excluir evento" color="#ff6b6b" onClick={() => setDeletando(ev)}>
                      <Trash2 size={14} />
                    </ActionBtn>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </PageShell>
  )
}

function ActionBtn({ children, title, color, onClick }: {
  children: React.ReactNode; title: string; color: string; onClick: () => void
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
