import { motion } from 'framer-motion'
import { Users } from 'lucide-react'
import PageShell, { Card, btnPrimary } from '../PageShell'

const exemplos = [
  { id: 1, nome: 'Ministério de Louvor', lider: 'Pr. Daniel', dia: 'Quinta', horario: '19:30' },
  { id: 2, nome: 'Ministério de Intercessão', lider: 'Pra. Rosa', dia: 'Terça', horario: '19:00' },
  { id: 3, nome: 'Ministério Jovem', lider: 'Pr. Laélson', dia: 'Sábado', horario: '19:30' },
]

export default function EditarMinisterio() {
  return (
    <PageShell title="Editar Ministério" subtitle="Selecione o ministério que deseja editar">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '580px' }}>
        {exemplos.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <div style={{
                  width: '42px', height: '42px', borderRadius: '10px', flexShrink: 0,
                  background: 'rgba(144,192,128,0.1)', border: '1px solid rgba(144,192,128,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Users size={18} color="#90c080" />
                </div>
                <div style={{ flex: 1, minWidth: '140px' }}>
                  <p style={{ color: '#fff', fontSize: '14px', fontWeight: 600, fontFamily: 'Inter, sans-serif', marginBottom: '3px' }}>{m.nome}</p>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>
                    {m.lider} · {m.dia} {m.horario}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{ ...btnPrimary, fontSize: '12px', padding: '8px 18px' }}
                >
                  Editar
                </motion.button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </PageShell>
  )
}
