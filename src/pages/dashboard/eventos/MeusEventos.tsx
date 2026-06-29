import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Pencil, Trash2 } from 'lucide-react'
import PageShell from '../PageShell'
import { useNavigate } from 'react-router-dom'

const exemplos = [
  { id: 1, titulo: 'Culto de Celebração', data: '2026-07-06', hora: '19:00', local: 'Templo Principal', tipo: 'CULTO' },
  { id: 2, titulo: 'Encontro de Jovens', data: '2026-07-05', hora: '19:30', local: 'Salão Jovem', tipo: 'JOVENS' },
  { id: 3, titulo: 'Vigília de Oração', data: '2026-07-04', hora: '22:00', local: 'Templo Principal', tipo: 'VIGÍLIA' },
]

const tipoColor: Record<string, string> = {
  CULTO: '#d3b86a',
  JOVENS: '#6090e0',
  FAMÍLIA: '#c0a0e0',
  VIGÍLIA: '#80b0d0',
  ESPECIAL: '#e0a060',
  DISCIPULADO: '#70c080',
}

export default function MeusEventos() {
  const navigate = useNavigate()

  return (
    <PageShell title="Meus Eventos" subtitle="Eventos que você criou">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '720px' }}>
        {exemplos.map((ev, i) => (
          <motion.div
            key={ev.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '16px',
              padding: '18px 20px', borderRadius: '16px',
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.07)',
              flexWrap: 'wrap',
            }}
          >
            <div style={{
              width: '42px', height: '42px', borderRadius: '10px', flexShrink: 0,
              background: `${tipoColor[ev.tipo] ?? '#d3b86a'}15`,
              border: `1px solid ${tipoColor[ev.tipo] ?? '#d3b86a'}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Calendar size={18} color={tipoColor[ev.tipo] ?? '#d3b86a'} />
            </div>

            <div style={{ flex: 1, minWidth: '160px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                <span style={{
                  padding: '2px 8px', borderRadius: '50px', fontSize: '10px', fontWeight: 700,
                  fontFamily: 'Cinzel, serif', letterSpacing: '1px',
                  color: tipoColor[ev.tipo] ?? '#d3b86a',
                  background: `${tipoColor[ev.tipo] ?? '#d3b86a'}15`,
                  border: `1px solid ${tipoColor[ev.tipo] ?? '#d3b86a'}30`,
                }}>
                  {ev.tipo}
                </span>
              </div>
              <p style={{ color: '#fff', fontSize: '14px', fontWeight: 600, fontFamily: 'Inter, sans-serif', marginBottom: '4px' }}>
                {ev.titulo}
              </p>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={11} /> {new Date(ev.data + 'T00:00').toLocaleDateString('pt-BR')} às {ev.hora}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={11} /> {ev.local}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate('/dashboard/eventos/editar')}
                style={{
                  width: '34px', height: '34px', borderRadius: '8px',
                  background: 'rgba(211,184,106,0.08)', border: '1px solid rgba(211,184,106,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#d3b86a',
                }}
              >
                <Pencil size={14} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{
                  width: '34px', height: '34px', borderRadius: '8px',
                  background: 'rgba(255,107,107,0.06)', border: '1px solid rgba(255,107,107,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#ff6b6b',
                }}
              >
                <Trash2 size={14} />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </PageShell>
  )
}
