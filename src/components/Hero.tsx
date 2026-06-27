import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown, Play } from 'lucide-react'

function CrossLight() {
  return (
    <div style={{
      position: 'absolute', inset: 0, display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', pointerEvents: 'none',
    }}>
      {/* Glow layers — behind cross */}
      <motion.div
        style={{
          position: 'absolute',
          width: 'clamp(340px, 50vw, 600px)',
          height: 'clamp(340px, 50vw, 600px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,248,220,0.55) 0%, rgba(211,184,106,0.45) 18%, rgba(10,33,91,0.3) 45%, transparent 72%)',
          filter: 'blur(18px)',
          zIndex: 1,
        }}
        animate={{ opacity: [0.75, 1, 0.75], scale: [0.97, 1.03, 0.97] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        style={{
          position: 'absolute',
          width: 'clamp(500px, 70vw, 900px)',
          height: 'clamp(500px, 70vw, 900px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(10,33,91,0.25) 0%, rgba(10,33,91,0.1) 40%, transparent 70%)',
          filter: 'blur(40px)',
          zIndex: 1,
        }}
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Light rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <motion.div
          key={angle}
          style={{
            position: 'absolute',
            width: '2px',
            height: 'clamp(180px, 25vw, 320px)',
            background: 'linear-gradient(180deg, rgba(255,248,200,0.5) 0%, transparent 100%)',
            transformOrigin: 'top center',
            transform: `rotate(${angle}deg) translateX(-50%)`,
            filter: 'blur(3px)',
            zIndex: 1,
          }}
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3 + angle * 0.01, repeat: Infinity, ease: 'easeInOut', delay: angle * 0.02 }}
        />
      ))}

      {/* Cross silhouette — on top of glow, below content */}
      <div style={{ position: 'absolute', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Vertical beam */}
        <div style={{
          position: 'absolute',
          width: 'clamp(28px, 4vw, 52px)',
          height: 'clamp(240px, 36vw, 480px)',
          background: 'linear-gradient(180deg, #020408 0%, #06080f 100%)',
          borderRadius: '3px',
          boxShadow: '0 0 30px rgba(0,0,0,0.8)',
        }} />
        {/* Horizontal beam */}
        <div style={{
          position: 'absolute',
          width: 'clamp(130px, 20vw, 260px)',
          height: 'clamp(28px, 4vw, 52px)',
          background: 'linear-gradient(90deg, #020408 0%, #06080f 100%)',
          borderRadius: '3px',
          top: 'clamp(-70px, -10vw, -120px)',
          boxShadow: '0 0 30px rgba(0,0,0,0.8)',
        }} />
      </div>
    </div>
  )
}

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '35%'])
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])

  return (
    <section
      id="hero"
      ref={ref}
      style={{
        position: 'relative', minHeight: '100svh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', background: '#000',
      }}
    >
      {/* Cross + glow background */}
      <CrossLight />

      {/* Subtle grid */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 3,
        backgroundImage: `
          linear-gradient(rgba(211,184,106,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(211,184,106,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '56px 56px',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <motion.div
        style={{
          position: 'relative', zIndex: 10, textAlign: 'center',
          padding: 'clamp(100px, 14vw, 140px) clamp(20px, 5vw, 60px) 60px',
          maxWidth: '860px', y, opacity,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '5px 18px', borderRadius: '50px',
            border: '1px solid rgba(211,184,106,0.35)',
            background: 'rgba(211,184,106,0.07)',
            fontSize: '11px', letterSpacing: '2.5px',
            color: '#d3b86a', fontWeight: 600,
            marginBottom: '28px', fontFamily: 'Cinzel, serif',
          }}
        >
          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#d3b86a', display: 'inline-block' }} />
          BLUMENAU — SC
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35 }}
          style={{
            fontFamily: 'Cinzel, serif',
            fontSize: 'clamp(36px, 7vw, 82px)',
            fontWeight: 700, lineHeight: 1.08,
            letterSpacing: '-0.5px', marginBottom: '20px',
            color: '#fff',
            textShadow: '0 0 60px rgba(211,184,106,0.3)',
          }}
        >
          "Quem serve
          <br />
          <span style={{
            background: 'linear-gradient(135deg, #d3b86a 0%, #fff 50%, #d3b86a 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            vê Deus"
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          style={{ marginBottom: '44px' }}
        >
          <div style={{ width: '48px', height: '2px', background: 'linear-gradient(90deg, transparent, #d3b86a, transparent)', margin: '0 auto 18px' }} />
          <p style={{
            fontSize: 'clamp(14px, 2vw, 17px)',
            color: 'rgba(255,255,255,0.55)',
            maxWidth: '480px', margin: '0 auto',
            lineHeight: 1.75, fontStyle: 'italic',
          }}>
            "E perseveravam na doutrina dos apóstolos, e na comunhão."
            <span style={{ display: 'block', marginTop: '6px', fontSize: '12px', color: 'rgba(211,184,106,0.7)', fontStyle: 'normal', letterSpacing: '1px' }}>
              Atos 2:42
            </span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <motion.button
            whileHover={{ scale: 1.06, boxShadow: '0 0 36px rgba(211,184,106,0.45)' }}
            whileTap={{ scale: 0.96 }}
            onClick={() => document.getElementById('sobre')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              padding: '15px 36px', borderRadius: '50px',
              background: 'linear-gradient(135deg, #d3b86a, #a8903a)',
              color: '#000', fontWeight: 700, fontSize: '14px',
              letterSpacing: '0.3px', border: 'none', cursor: 'pointer',
              fontFamily: 'Cinzel, serif',
            }}
          >
            Conheça-nos
          </motion.button>

          <motion.a
            href="https://www.youtube.com/@igrejakoinoniablumenau917"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.06, borderColor: 'rgba(211,184,106,0.7)' }}
            whileTap={{ scale: 0.96 }}
            style={{
              padding: '15px 28px', borderRadius: '50px',
              background: 'transparent', color: '#fff',
              fontWeight: 600, fontSize: '14px',
              border: '1px solid rgba(255,255,255,0.2)',
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              gap: '10px', fontFamily: 'Inter, sans-serif',
              transition: 'border-color 0.3s', textDecoration: 'none',
            }}
          >
            <div style={{
              width: '30px', height: '30px', borderRadius: '50%',
              background: 'rgba(211,184,106,0.12)',
              border: '1px solid rgba(211,184,106,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Play size={11} fill="#d3b86a" color="#d3b86a" />
            </div>
            Ver Pregações
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        style={{
          position: 'absolute', bottom: '28px', left: '50%',
          transform: 'translateX(-50%)', zIndex: 10,
        }}
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
          <ChevronDown size={22} color="rgba(211,184,106,0.55)" />
        </motion.div>
      </motion.div>
    </section>
  )
}
