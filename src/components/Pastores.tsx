import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const pastores = [
  {
    id: 1,
    nome: 'Pr. Rafael Souza',
    cargo: 'Pastor Presidente',
    desc: 'Com mais de 20 anos de ministério, o Pr. Rafael lidera a Koinonia com visão profética e coração pastoral. Sua vida é marcada pela busca intensa de Deus e pelo amor genuíno às pessoas.',
    versiculo: '"O SENHOR é o meu pastor; nada me faltará." — Salmos 23:1',
    bg: 'linear-gradient(160deg, #0a1a3a 0%, #06080f 55%, #0d2040 100%)',
    initials: 'RS',
    colorA: '#d3b86a',
    colorB: '#a8903a',
  },
  {
    id: 2,
    nome: 'Pra. Carla Souza',
    cargo: 'Pastora de Mulheres',
    desc: 'Apaixonada por ver mulheres caminhando em propósito, a Pra. Carla lidera o ministério feminino com amor, sabedoria e unção. Acredita que cada mulher tem um destino glorioso em Deus.',
    versiculo: '"Mulher virtuosa, quem a achará? O seu valor muito excede o de rubins." — Prov 31:10',
    bg: 'linear-gradient(160deg, #180830 0%, #06080f 55%, #200840 100%)',
    initials: 'CS',
    colorA: '#c0a0f0',
    colorB: '#9060c0',
  },
  {
    id: 3,
    nome: 'Pr. Lucas Ferreira',
    cargo: 'Pastor de Jovens',
    desc: 'Apóstolo da nova geração, o Pr. Lucas conecta o coração dos jovens ao coração de Deus com autenticidade e fogo. Lidera o ministério jovem com uma paixão que é contagiante.',
    versiculo: '"Ninguém te despreze por seres jovem." — 1 Timóteo 4:12',
    bg: 'linear-gradient(160deg, #0a215b 0%, #06080f 55%, #142a6a 100%)',
    initials: 'LF',
    colorA: '#5080e0',
    colorB: '#0a215b',
  },
]

export default function Pastores() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const [expanded, setExpanded] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const autoRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const goTo = (index: number, dir: number) => {
    setDirection(dir)
    setCurrent(index)
    setExpanded(false)
  }

  const next = () => goTo((current + 1) % pastores.length, 1)
  const prev = () => goTo((current - 1 + pastores.length) % pastores.length, -1)

  useEffect(() => {
    if (expanded) return
    autoRef.current = setTimeout(next, 6000)
    return () => { if (autoRef.current) clearTimeout(autoRef.current) }
  }, [current, expanded])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 45) diff > 0 ? next() : prev()
    touchStartX.current = null
  }

  const pastor = pastores[current]
  // First sentence only
  const firstSentence = pastor.desc.split('.')[0] + '.'

  return (
    <section
      id="pastores"
      style={{
        padding: 'clamp(80px, 12vw, 140px) 0',
        background: 'linear-gradient(180deg, #08091a 0%, #060714 100%)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Rotating rings decoration */}
      <motion.div
        style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '700px', height: '700px', borderRadius: '50%',
          border: '1px solid rgba(211,184,106,0.04)',
          pointerEvents: 'none',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}
      />

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ textAlign: 'center', marginBottom: 'clamp(36px, 5vw, 56px)', padding: '0 24px' }}
      >
        <span style={{
          display: 'block', color: '#d3b86a', fontFamily: 'Cinzel, serif',
          letterSpacing: '3px', fontSize: '11px', fontWeight: 600, marginBottom: '14px',
        }}>
          LIDERANÇA
        </span>
        <h2 style={{
          fontFamily: 'Cinzel, serif', fontSize: 'clamp(28px, 5vw, 50px)',
          fontWeight: 700, color: '#fff', lineHeight: 1.1,
        }}>
          Nossos{' '}
          <span style={{
            background: 'linear-gradient(135deg, #d3b86a, #1a3a7a)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Pastores
          </span>
        </h2>
      </motion.div>

      {/* Carousel */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ position: 'relative', maxWidth: '420px', margin: '0 auto', padding: '0 24px', userSelect: 'none' }}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={pastor.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -60 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            style={{
              borderRadius: '24px',
              overflow: 'hidden',
              position: 'relative',
              background: pastor.bg,
              border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: `0 24px 64px rgba(0,0,0,0.65), 0 0 0 1px rgba(211,184,106,0.08)`,
              aspectRatio: '3/4',
              maxHeight: '540px',
            }}
          >
            {/* Avatar / photo placeholder */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: '10px',
              paddingBottom: expanded ? '60%' : '42%',
              transition: 'padding-bottom 0.4s ease',
            }}>
              <motion.div
                whileHover={{ scale: 1.06 }}
                style={{
                  width: 'clamp(80px, 18vw, 110px)',
                  height: 'clamp(80px, 18vw, 110px)',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${pastor.colorA}, ${pastor.colorB})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Cinzel, serif', fontWeight: 700,
                  fontSize: 'clamp(24px, 5vw, 36px)', color: '#fff',
                  boxShadow: `0 0 40px ${pastor.colorA}40`,
                  flexShrink: 0,
                }}
              >
                {pastor.initials}
              </motion.div>
              <span style={{
                fontSize: '10px', color: 'rgba(255,255,255,0.3)',
                letterSpacing: '2px', fontFamily: 'Cinzel, serif',
              }}>
                FOTO EM BREVE
              </span>
            </div>

            {/* Instagram-style bottom overlay */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: 'linear-gradient(0deg, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.82) 55%, transparent 100%)',
              padding: 'clamp(16px, 3vw, 24px)',
            }}>
              {/* Role badge */}
              <span style={{
                display: 'inline-block', padding: '3px 10px',
                borderRadius: '50px',
                background: `${pastor.colorA}18`,
                border: `1px solid ${pastor.colorA}40`,
                color: pastor.colorA, fontSize: '10px', fontWeight: 700,
                letterSpacing: '1.5px', fontFamily: 'Cinzel, serif', marginBottom: '8px',
              }}>
                {pastor.cargo}
              </span>

              {/* Name */}
              <h3 style={{
                fontFamily: 'Cinzel, serif',
                fontSize: 'clamp(16px, 3.5vw, 21px)',
                fontWeight: 700, color: '#fff', marginBottom: '8px', lineHeight: 1.2,
              }}>
                {pastor.nome}
              </h3>

              {/* Caption — collapsed: first sentence + "ler mais" */}
              <AnimatePresence initial={false} mode="wait">
                {!expanded ? (
                  <motion.p
                    key="collapsed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13px', lineHeight: 1.55 }}
                  >
                    {firstSentence}{' '}
                    <button
                      onClick={() => setExpanded(true)}
                      style={{
                        background: 'none', border: 'none', padding: 0,
                        color: 'rgba(255,255,255,0.4)', fontSize: '13px',
                        cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      mais
                    </button>
                  </motion.p>
                ) : (
                  <motion.div
                    key="expanded"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '13px', lineHeight: 1.65, marginBottom: '10px' }}>
                      {pastor.desc}
                    </p>
                    <p style={{
                      color: 'rgba(255,255,255,0.45)', fontSize: '12px',
                      fontStyle: 'italic', lineHeight: 1.55, marginBottom: '8px',
                      borderLeft: `2px solid ${pastor.colorA}50`, paddingLeft: '10px',
                    }}>
                      {pastor.versiculo}
                    </p>
                    <button
                      onClick={() => setExpanded(false)}
                      style={{
                        background: 'none', border: 'none', padding: 0,
                        color: 'rgba(255,255,255,0.35)', fontSize: '12px',
                        cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      ocultar
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dots — clickable, also act as prev/next */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '18px' }}>
          {pastores.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => goTo(i, i > current ? 1 : -1)}
              whileHover={{ scale: 1.4 }}
              whileTap={{ scale: 0.9 }}
              style={{
                width: i === current ? '28px' : '8px',
                height: '8px', borderRadius: '4px',
                background: i === current ? '#d3b86a' : 'rgba(255,255,255,0.18)',
                border: 'none', cursor: 'pointer',
                padding: 0,
                transition: 'width 0.3s ease, background 0.3s ease',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
