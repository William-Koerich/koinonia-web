import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MapPin, Clock, Phone, Navigation } from 'lucide-react'

const cultos = [
  { dia: 'Domingo', hora: '19:00', desc: 'Culto de Celebração' },
  { dia: 'Segunda', hora: '19:30', desc: 'Discipulados (células)' },
  { dia: 'Sexta (quinzenal)', hora: '22:00', desc: 'Vigília' },
  { dia: 'Sábado', hora: '19:30', desc: 'Culto de Jovens' },
]

export default function Localizacao() {
  const titleRef = useRef(null)
  const inView = useInView(titleRef, { once: true, margin: '-80px' })

  return (
    <section
      id="localizacao"
      style={{
        padding: 'clamp(80px, 12vw, 140px) 24px',
        background: 'linear-gradient(180deg, #08091a 0%, #060714 100%)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Title */}
        <div ref={titleRef} style={{ textAlign: 'center', marginBottom: 'clamp(40px, 7vw, 72px)' }}>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            style={{ display: 'block', color: '#d3b86a', fontFamily: 'Cinzel, serif', letterSpacing: '3px', fontSize: '11px', fontWeight: 600, marginBottom: '14px' }}
          >
            ONDE ESTAMOS
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(30px, 5vw, 52px)', fontWeight: 700, color: '#fff', lineHeight: 1.1 }}
          >
            Venha nos{' '}
            <span style={{ background: 'linear-gradient(135deg, #d3b86a, #0a215b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Visitar
            </span>
          </motion.h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '28px',
          alignItems: 'start',
        }}>
          {/* Info side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            {/* Address */}
            <div style={{
              padding: 'clamp(20px, 3vw, 32px)', borderRadius: '20px',
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(211,184,106,0.12)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <MapPin size={18} color="#d3b86a" />
                <span style={{ fontFamily: 'Cinzel, serif', fontSize: '13px', fontWeight: 700, color: '#d3b86a', letterSpacing: '1px' }}>
                  ENDEREÇO
                </span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', lineHeight: 1.7 }}>
                Igreja Koinonia<br />
                Blumenau — SC
              </p>
              <motion.a
                href="https://maps.google.com/?q=Igreja+Koinonia+Blumenau"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 4 }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  marginTop: '14px', color: '#d3b86a', fontSize: '13px',
                  fontWeight: 600, textDecoration: 'none',
                }}
              >
                <Navigation size={13} /> Como Chegar
              </motion.a>
            </div>

            {/* Schedule */}
            <div style={{
              padding: 'clamp(20px, 3vw, 32px)', borderRadius: '20px',
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(211,184,106,0.12)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                <Clock size={18} color="#d3b86a" />
                <span style={{ fontFamily: 'Cinzel, serif', fontSize: '13px', fontWeight: 700, color: '#d3b86a', letterSpacing: '1px' }}>
                  CULTOS
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {cultos.map((c) => (
                  <div key={c.dia} style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'flex-start', gap: '12px',
                    paddingBottom: '14px',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                  }}>
                    <div>
                      <div style={{ color: '#fff', fontSize: '14px', fontWeight: 600, marginBottom: '2px' }}>{c.dia}</div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>{c.desc}</div>
                    </div>
                    <span style={{
                      color: '#d3b86a', fontSize: '14px', fontWeight: 700,
                      fontFamily: 'Cinzel, serif', flexShrink: 0,
                    }}>
                      {c.hora}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div style={{
              padding: 'clamp(16px, 2vw, 24px)', borderRadius: '16px',
              background: 'rgba(211,184,106,0.06)',
              border: '1px solid rgba(211,184,106,0.15)',
              display: 'flex', alignItems: 'center', gap: '12px',
            }}>
              <Phone size={16} color="#d3b86a" />
              <div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', letterSpacing: '1px', fontFamily: 'Cinzel, serif' }}>CONTATO</div>
                <div style={{ color: '#fff', fontSize: '14px', fontWeight: 600, marginTop: '2px' }}>(47) 00000-0000</div>
              </div>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            style={{
              borderRadius: '24px', overflow: 'hidden',
              border: '1px solid rgba(211,184,106,0.15)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              aspectRatio: '4/3',
              minHeight: '320px',
            }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3558.4348140717057!2d-49.08824152456133!3d-26.88969227666089!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94df1ee0a1a5e0e1%3A0xe64eb620e15e784d!2sIgreja%20Koinonia!5e0!3m2!1spt-BR!2sbr!4v1782563725829!5m2!1spt-BR!2sbr"
              width="100%"
              height="100%"
              style={{ border: 0, display: 'block', filter: 'invert(0.9) hue-rotate(180deg) saturate(0.6) brightness(0.85)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Localização da Igreja Koinonia"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
