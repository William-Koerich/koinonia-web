import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Heart, BookOpen, Users, Globe } from 'lucide-react'

const values = [
  { icon: Heart, title: 'Amor', desc: 'Amamos uns aos outros como Cristo nos amou, servindo com alegria.' },
  { icon: BookOpen, title: 'Palavra', desc: 'Fundamentados na Bíblia Sagrada como verdade absoluta para nossa vida.' },
  { icon: Users, title: 'Comunidade', desc: 'Uma família unida pela fé, crescendo juntos em graça e conhecimento.' },
  { icon: Globe, title: 'Missão', desc: 'Levando o evangelho de Cristo para cada cidade, nação e geração.' },
]

function Card3D({ children, delay }: { children: React.ReactNode; delay: number }) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `perspective(1000px) rotateY(${x * 15}deg) rotateX(${-y * 15}deg) translateZ(10px)`
  }

  const handleMouseLeave = () => {
    const el = ref.current
    if (el) el.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0px)'
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transition: 'transform 0.15s ease',
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </motion.div>
  )
}

export default function Sobre() {
  const titleRef = useRef(null)
  const inView = useInView(titleRef, { once: true, margin: '-80px' })

  return (
    <section
      id="sobre"
      style={{
        padding: 'clamp(80px, 12vw, 140px) 24px',
        background: 'linear-gradient(180deg, #08091a 0%, #060714 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decoration line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '1px',
        height: '80px',
        background: 'linear-gradient(180deg, transparent, #d3b86a)',
      }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Title */}
        <div ref={titleRef} style={{ textAlign: 'center', marginBottom: 'clamp(48px, 8vw, 80px)' }}>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            style={{ display: 'block', color: '#d3b86a', fontFamily: 'Cinzel, serif', letterSpacing: '3px', fontSize: '12px', fontWeight: 600, marginBottom: '16px' }}
          >
            QUEM SOMOS
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 'clamp(32px, 5vw, 60px)',
              fontWeight: 700,
              color: '#fff',
              marginBottom: '24px',
              lineHeight: 1.1,
            }}
          >
            Mais do que uma Igreja,
            <br />
            <span style={{ background: 'linear-gradient(135deg, #d3b86a, #0a215b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              uma Família
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ color: 'rgba(255,255,255,0.55)', fontSize: 'clamp(15px, 2vw, 18px)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.8 }}
          >
            A Igreja Koinonia nasceu do desejo de construir uma comunidade genuína,
            onde cada pessoa encontra propósito, amor e transformação através de Jesus Cristo.
          </motion.p>
        </div>

        {/* Big quote */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8 }}
          style={{
            margin: '0 auto clamp(64px, 10vw, 100px)',
            padding: 'clamp(32px, 5vw, 56px)',
            maxWidth: '800px',
            borderRadius: '24px',
            border: '1px solid rgba(211,184,106,0.2)',
            background: 'linear-gradient(135deg, rgba(211,184,106,0.06) 0%, rgba(10,33,91,0.08) 100%)',
            position: 'relative',
            overflow: 'hidden',
            textAlign: 'center',
          }}
        >
          <div style={{
            position: 'absolute',
            top: '-20px',
            left: '-10px',
            fontSize: '160px',
            color: 'rgba(211,184,106,0.06)',
            fontFamily: 'Georgia, serif',
            lineHeight: 1,
            pointerEvents: 'none',
            userSelect: 'none',
          }}>
            "
          </div>
          <p style={{ fontSize: 'clamp(18px, 2.5vw, 24px)', fontStyle: 'italic', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, position: 'relative' }}>
            Koinonia significa comunhão, parceria, participação. É exatamente o que somos:
            pessoas que caminham juntas na fé, partilhando a vida em Cristo.
          </p>
          <div style={{ marginTop: '20px', width: '40px', height: '2px', background: '#d3b86a', margin: '20px auto 0' }} />
          <p style={{ marginTop: '16px', color: '#d3b86a', fontFamily: 'Cinzel, serif', fontSize: '13px', letterSpacing: '2px' }}>
            NOSSA HISTÓRIA
          </p>
        </motion.div>

        {/* Values grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '24px',
        }}>
          {values.map((v, i) => (
            <Card3D key={v.title} delay={i * 0.1}>
              <div style={{
                padding: '36px 28px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, rgba(211,184,106,0.05) 0%, rgba(10,33,91,0.08) 100%)',
                border: '1px solid rgba(211,184,106,0.12)',
                boxShadow: '0 8px 32px rgba(10,33,91,0.4), 0 2px 8px rgba(211,184,106,0.06)',
                height: '100%',
                cursor: 'default',
              }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(211,184,106,0.15), rgba(10,33,91,0.15))',
                  border: '1px solid rgba(211,184,106,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                }}>
                  <v.icon size={22} color="#d3b86a" />
                </div>
                <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>
                  {v.title}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: 1.7 }}>
                  {v.desc}
                </p>
              </div>
            </Card3D>
          ))}
        </div>
      </div>
    </section>
  )
}
