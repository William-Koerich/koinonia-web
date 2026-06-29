import PageShell, { Card, btnPrimary } from '../PageShell'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function EditarEvento() {
  const navigate = useNavigate()

  return (
    <PageShell title="Editar Evento" subtitle="Selecione um evento para editar">
      <Card style={{ maxWidth: '640px', textAlign: 'center', padding: '48px 32px' }}>
        <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '40px', marginBottom: '16px' }}>✏️</div>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', fontFamily: 'Inter, sans-serif', marginBottom: '24px', lineHeight: 1.6 }}>
          Acesse <strong style={{ color: '#d3b86a' }}>Meus Eventos</strong> e clique no ícone de edição ao lado do evento que deseja alterar.
        </p>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/dashboard/eventos/meus-eventos')}
          style={btnPrimary}
        >
          Ver Meus Eventos
        </motion.button>
      </Card>
    </PageShell>
  )
}
