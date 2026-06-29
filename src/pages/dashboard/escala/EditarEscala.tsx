import PageShell, { Card, btnPrimary } from '../PageShell'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function EditarEscala() {
  const navigate = useNavigate()
  return (
    <PageShell title="Editar Escala" subtitle="Selecione uma escala para editar">
      <Card style={{ maxWidth: '560px', textAlign: 'center', padding: '48px 32px' }}>
        <div style={{ fontSize: '40px', marginBottom: '16px' }}>📋</div>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', fontFamily: 'Inter, sans-serif', marginBottom: '24px', lineHeight: 1.6 }}>
          Acesse <strong style={{ color: '#d3b86a' }}>Minhas Escalas</strong> e selecione a escala que deseja editar.
        </p>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/dashboard/escala/minhas-escalas')} style={btnPrimary}>
          Ver Minhas Escalas
        </motion.button>
      </Card>
    </PageShell>
  )
}
