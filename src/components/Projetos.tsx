import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Globe, Home, Users2, ArrowUpRight } from 'lucide-react'

const projetos = [
  {
    icon: Globe,
    tag: 'MISSÕES',
    title: 'Missão Moçambique',
    desc: 'Levando o Evangelho ao coração da África — plantando igrejas, treinando líderes e assistindo comunidades carentes em Moçambique.',
    detail: 'Plantação de igrejas, capacitação de líderes e assistência social.',
    color: '#d3b86a',
    gradient: 'linear-gradient(135deg, rgba(211,184,106,0.12) 0%, rgba(211,184,106,0.02) 100%)',
    href: '/projetos/missao-mocambique',
    clickable: true,
  },
  {
    icon: Users2,
    tag: 'DISCIPULADO',
    title: 'Discipulados',
    desc: 'Todo segundo-feira a Igreja promove encontros de discipulado para crescimento espiritual, estudo bíblico e relacionamento genuíno.',
    detail: 'Toda Segunda-feira • Grupos em células',
    color: '#0a215b',
    gradient: 'linear-gradient(135deg, rgba(10,33,91,0.2) 0%, rgba(10,33,91,0.04) 100%)',
    href: null,
    clickable: false,
  },
  {
    icon: Home,
    tag: 'SOCIAL',
    title: 'LIMPAZ',
    desc: 'Lares Impactados, Moradias Transformadas. Reformas e melhorias habitacionais para famílias em vulnerabilidade social de Blumenau e região.',
    detail: 'Mutirões voluntários de reforma habitacional.',
    color: '#d3b86a',
    gradient: 'linear-gradient(135deg, rgba(211,184,106,0.1) 0%, rgba(10,33,91,0.08) 100%)',
    href: '/projetos/limpaz',
    clickable: true,
  },
]

export default function Projetos() {
  const navigate = useNavigate()
  const titleRef = useRef(null)
  const inView = useInView(titleRef, { once: true, margin: '-80px' })

  return (
    <section
      id="projetos"
      style={{
        padding: 'clamp(80px, 12vw, 140px) 24px',
        background: 'linear-gradient(180deg, #08091a 0%, #060714 50%, #08091a 100%)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Bg glow */}
      <motion.div
        style={{
          position: 'absolute', left: '-100px', top: '30%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(211,184,106,0.06) 0%, transparent 70%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Title */}
        <div ref={titleRef} style={{ textAlign: 'center', marginBottom: 'clamp(48px, 8vw, 80px)' }}>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            style={{ display: 'block', color: '#d3b86a', fontFamily: 'Cinzel, serif', letterSpacing: '3px', fontSize: '11px', fontWeight: 600, marginBottom: '14px' }}
          >
            IMPACTO SOCIAL
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(30px, 5vw, 52px)', fontWeight: 700, color: '#fff', lineHeight: 1.1 }}
          >
            Projetos que
            <br />
            <span style={{ background: 'linear-gradient(135deg, #d3b86a, #0a215b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Transformam Vidas
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ color: 'rgba(255,255,255,0.45)', fontSize: 'clamp(14px, 2vw, 17px)', maxWidth: '480px', margin: '20px auto 0', lineHeight: 1.75 }}
          >
            Fé em ação. Cada projeto é uma extensão do amor de Cristo para a nossa comunidade e para o mundo.
          </motion.p>
        </div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {projetos.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              whileHover={p.clickable ? { y: -8, boxShadow: `0 20px 60px ${p.color}18` } : { y: -4 }}
              onClick={() => p.clickable && p.href && navigate(p.href)}
              style={{
                padding: 'clamp(24px, 3vw, 36px)',
                borderRadius: '24px',
                background: p.gradient,
                border: `1px solid ${p.color}20`,
                cursor: p.clickable ? 'pointer' : 'default',
                transition: 'box-shadow 0.3s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{
                  width: '50px', height: '50px', borderRadius: '14px',
                  background: `${p.color}14`, border: `1px solid ${p.color}28`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <p.icon size={22} color={p.color} />
                </div>
                <div style={{
                  padding: '4px 12px', borderRadius: '50px',
                  background: `${p.color}10`, border: `1px solid ${p.color}28`,
                  color: p.color, fontSize: '10px', fontWeight: 700,
                  letterSpacing: '1.5px', fontFamily: 'Cinzel, serif',
                }}>
                  {p.tag}
                </div>
              </div>

              <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(18px, 2.5vw, 22px)', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>
                {p.title}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: 1.7, marginBottom: '20px' }}>
                {p.desc}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', fontStyle: 'italic' }}>
                  {p.detail}
                </span>
                {p.clickable && (
                  <motion.div
                    whileHover={{ rotate: 45, scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      border: `1px solid ${p.color}35`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <ArrowUpRight size={14} color={p.color} />
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
