import { motion } from 'framer-motion'

interface Props {
  title: string
  subtitle?: string
  children: React.ReactNode
}

export default function PageShell({ title, subtitle, children }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(20px, 2.5vw, 28px)', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
          {title}
        </h2>
        {subtitle && (
          <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </motion.div>
  )
}

export function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '20px', padding: 'clamp(20px, 3vw, 32px)',
      ...style,
    }}>
      {children}
    </div>
  )
}

export const inputStyle: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
  padding: '12px 16px', color: '#fff', fontSize: '14px',
  fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box',
}

export const labelStyle: React.CSSProperties = {
  display: 'block', color: 'rgba(255,255,255,0.5)',
  fontSize: '12px', fontWeight: 600, letterSpacing: '0.5px',
  fontFamily: 'Inter, sans-serif', marginBottom: '6px',
}

export const btnPrimary: React.CSSProperties = {
  padding: '12px 28px', borderRadius: '10px',
  background: 'linear-gradient(135deg, #d3b86a, #a8903a)',
  color: '#000', fontWeight: 700, fontSize: '14px',
  fontFamily: 'Cinzel, serif', border: 'none', cursor: 'pointer',
}
