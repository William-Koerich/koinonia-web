import { motion } from 'framer-motion'
import { Calendar, LayoutGrid, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const cards = [
  { icon: Calendar, label: 'Eventos', sub: 'Gerencie os eventos da Igreja', path: '/dashboard/eventos/criar', color: '#d3b86a' },
  { icon: LayoutGrid, label: 'Escala', sub: 'Organize as escalas de serviço', path: '/dashboard/escala/criar', color: '#6090e0' },
  { icon: Users, label: 'Ministérios', sub: 'Administre os ministérios', path: '/dashboard/ministerios/criar', color: '#90c080' },
]

export default function DashboardHome() {
  const navigate = useNavigate()
  const usuario = (() => {
    try { return JSON.parse(localStorage.getItem('koinonia_usuario') ?? '{}') } catch { return {} }
  })()

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', fontFamily: 'Inter, sans-serif', marginBottom: '6px' }}>
          Bem-vindo de volta,
        </p>
        <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, color: '#fff', marginBottom: '36px' }}>
          {usuario.nome ?? 'Usuário'}{' '}
          <span style={{ background: 'linear-gradient(135deg, #d3b86a, #0a215b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            {usuario.sobrenome}
          </span>
        </h1>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4, boxShadow: `0 12px 40px rgba(0,0,0,0.4)` }}
            onClick={() => navigate(card.path)}
            style={{
              padding: '28px 24px', borderRadius: '20px',
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.07)',
              cursor: 'pointer', transition: 'box-shadow 0.2s',
            }}
          >
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: `${card.color}15`,
              border: `1px solid ${card.color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '16px',
            }}>
              <card.icon size={20} color={card.color} />
            </div>
            <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '17px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
              {card.label}
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', fontFamily: 'Inter, sans-serif', lineHeight: 1.5 }}>
              {card.sub}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
