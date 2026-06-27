import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react'

const eventos = [
  {
    id: 1,
    tag: 'CULTO',
    title: 'Culto de Celebração',
    desc: 'Venha adorar a Deus conosco neste momento especial de louvor, palavra e oração.',
    date: 'Todo Domingo',
    time: '19:00 — 21:00',
    local: 'Templo Principal',
    color: '#d3b86a',
    featured: true,
  },
  {
    id: 2,
    tag: 'JOVENS',
    title: 'Encontro da Juventude',
    desc: 'Um espaço vibrante para jovens crescerem juntos na fé e na comunidade.',
    date: 'Toda Sexta',
    time: '20:00 — 22:00',
    local: 'Salão Jovem',
    color: '#0a215b',
    featured: false,
  },
  {
    id: 3,
    tag: 'FAMÍLIA',
    title: 'Culto da Família',
    desc: 'Um culto especial dedicado a fortalecer os laços familiares através da Palavra.',
    date: 'Toda Quarta',
    time: '19:30 — 21:00',
    local: 'Templo Principal',
    color: '#d3b86a',
    featured: false,
  },
  {
    id: 4,
    tag: 'ESPECIAL',
    title: 'Conferência Koinonia 2025',
    desc: 'Nosso maior evento do ano! Dias de imersão na presença de Deus com pregadores nacionais.',
    date: '15–17 Agosto',
    time: 'Noites 19:30',
    local: 'Auditório Central',
    color: '#1a3a7a',
    featured: true,
  },
]

export default function Eventos() {
  const titleRef = useRef(null)
  const inView = useInView(titleRef, { once: true, margin: '-80px' })

  return (
    <section
      id="eventos"
      style={{
        padding: 'clamp(80px, 12vw, 140px) 24px',
        background: '#08091a',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        right: '-150px',
        top: '20%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(10,33,91,0.12) 0%, transparent 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div ref={titleRef} style={{ marginBottom: 'clamp(48px, 8vw, 80px)' }}>
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            style={{ display: 'block', color: '#d3b86a', fontFamily: 'Cinzel, serif', letterSpacing: '3px', fontSize: '12px', fontWeight: 600, marginBottom: '16px' }}
          >
            AGENDA
          </motion.span>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 700, color: '#fff', lineHeight: 1.1 }}
            >
              Próximos
              <br />
              <span style={{ background: 'linear-gradient(135deg, #d3b86a, #0a215b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Eventos
              </span>
            </motion.h2>

            <motion.button
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 }}
              whileHover={{ x: 5 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'none',
                border: 'none',
                color: '#d3b86a',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '0.3px',
              }}
            >
              Ver todos <ArrowRight size={16} />
            </motion.button>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '20px' }}>
          {eventos.map((ev, i) => (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ x: 6, borderColor: `${ev.color}40` }}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                padding: 'clamp(20px, 3vw, 32px)',
                borderRadius: '20px',
                border: `1px solid ${ev.color}18`,
                background: ev.featured
                  ? `linear-gradient(135deg, rgba(211,184,106,0.07) 0%, rgba(10,33,91,0.1) 100%)`
                  : 'rgba(255,255,255,0.025)',
                boxShadow: ev.featured
                  ? `0 8px 32px rgba(10,33,91,0.5), 0 2px 8px rgba(211,184,106,0.08)`
                  : '0 4px 16px rgba(0,0,0,0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ display: 'flex', gap: 'clamp(16px, 3vw, 32px)', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                {/* Date block */}
                <div style={{
                  minWidth: '70px',
                  padding: '16px 12px',
                  borderRadius: '14px',
                  background: `${ev.color}12`,
                  border: `1px solid ${ev.color}30`,
                  textAlign: 'center',
                  flexShrink: 0,
                }}>
                  <Calendar size={18} color={ev.color} style={{ margin: '0 auto 6px' }} />
                  <div style={{ fontSize: '10px', color: ev.color, fontWeight: 700, letterSpacing: '1px', lineHeight: 1.4, fontFamily: 'Cinzel, serif' }}>
                    {ev.date.replace(' ', '\n')}
                  </div>
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      padding: '3px 12px',
                      borderRadius: '50px',
                      background: `${ev.color}15`,
                      border: `1px solid ${ev.color}40`,
                      color: ev.color,
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '1.5px',
                      fontFamily: 'Cinzel, serif',
                    }}>
                      {ev.tag}
                    </span>
                    {ev.featured && (
                      <span style={{
                        padding: '3px 12px',
                        borderRadius: '50px',
                        background: 'rgba(211,184,106,0.1)',
                        border: '1px solid rgba(211,184,106,0.3)',
                        color: '#d3b86a',
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '1px',
                      }}>
                        DESTAQUE
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(18px, 2.5vw, 24px)', fontWeight: 700, color: '#fff', marginBottom: '8px', lineHeight: 1.2 }}>
                    {ev.title}
                  </h3>

                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: 1.7, marginBottom: '16px', maxWidth: '600px' }}>
                    {ev.desc}
                  </p>

                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
                      <Clock size={13} /> {ev.time}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
                      <MapPin size={13} /> {ev.local}
                    </span>
                  </div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.1 }}
                  style={{
                    alignSelf: 'center',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: `1px solid ${ev.color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <ArrowRight size={16} color={ev.color} />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
