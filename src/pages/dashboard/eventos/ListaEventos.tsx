import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Users, Search, X } from 'lucide-react'
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
  const navigate = useNavigate()
  const [eventos, setEventos] = useState<Evento[]>([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')

  const carregar = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API}/eventos`, { headers: authHeader() })
      setEventos(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { carregar() }, [carregar])

  const filtrados = eventos.filter(e =>
    e.nome.toLowerCase().includes(busca.toLowerCase()) ||
    (e.ministerio?.nome ?? '').toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <PageShell title="Eventos" subtitle="Veja os próximos eventos da Igreja">
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
          {filtrados.map((ev, i) => (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.32 }}
              whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.4)' }}
              onClick={() => navigate(`/dashboard/eventos/${ev.id}`)}
              style={{
                borderRadius: '20px', overflow: 'hidden',
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.07)',
                display: 'flex', flexDirection: 'column',
                cursor: 'pointer',
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
                {ev.ministerio && (
                  <span style={{
                    display: 'inline-block', marginBottom: '6px', alignSelf: 'flex-start',
                    padding: '2px 8px', borderRadius: '20px', fontSize: '10px',
                    fontFamily: 'Inter, sans-serif', fontWeight: 600,
                    background: 'rgba(211,184,106,0.1)', color: '#d3b86a',
                    border: '1px solid rgba(211,184,106,0.2)',
                  }}>
                    {ev.ministerio.nome}
                  </span>
                )}
                <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                  {ev.nome}
                </h3>

                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', lineHeight: 1.6, marginBottom: '12px', flex: 1 }}>
                  {ev.descricao}
                </p>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
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
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </PageShell>
  )
}
