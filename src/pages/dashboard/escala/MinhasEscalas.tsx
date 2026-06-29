import { motion } from 'framer-motion'
import { LayoutGrid, Users, Pencil, Trash2 } from 'lucide-react'
import PageShell from '../PageShell'

const exemplos = [
  { id: 1, servico: 'Culto Domingo', data: '2026-07-06', membros: ['João Silva — Louvor', 'Maria Costa — Projeção', 'Pedro Santos — Som'] },
  { id: 2, servico: 'Culto Sábado Jovens', data: '2026-07-05', membros: ['Ana Lima — Louvor', 'Carlos Nunes — Transmissão'] },
]

export default function MinhasEscalas() {
  return (
    <PageShell title="Minhas Escalas" subtitle="Escalas de serviço que você organizou">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '640px' }}>
        {exemplos.map((e, i) => (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            style={{
              padding: '20px', borderRadius: '16px',
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '10px',
                  background: 'rgba(96,144,224,0.1)', border: '1px solid rgba(96,144,224,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <LayoutGrid size={16} color="#6090e0" />
                </div>
                <div>
                  <p style={{ color: '#fff', fontSize: '14px', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>{e.servico}</p>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>
                    {new Date(e.data + 'T00:00').toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(211,184,106,0.08)', border: '1px solid rgba(211,184,106,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#d3b86a' }}>
                  <Pencil size={13} />
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,107,107,0.06)', border: '1px solid rgba(255,107,107,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#ff6b6b' }}>
                  <Trash2 size={13} />
                </motion.button>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', letterSpacing: '1px', fontFamily: 'Cinzel, serif', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
                <Users size={11} /> MEMBROS
              </p>
              {e.membros.map(m => (
                <p key={m} style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}>{m}</p>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </PageShell>
  )
}
