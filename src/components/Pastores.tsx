import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const pastores = [
  {
    id: 1,
    nome: 'Pr. Léo',
    cargo: 'Pastor Presidente',
    desc: 'Líder visionário da Igreja Koinônia, o Pr. Léo conduz a comunidade com autoridade espiritual, amor genuíno e um profundo chamado para a nação.',
    versiculo: '"O SENHOR é o meu pastor; nada me faltará." — Salmos 23:1',
    bg: 'linear-gradient(160deg, #0a1a3a 0%, #050810 55%, #0d2040 100%)',
    initials: 'PL',
    colorA: '#d3b86a',
    colorB: '#8a6020',
  },
  {
    id: 2,
    nome: 'Pra. Rosa',
    cargo: 'Pastora',
    desc: 'A Pra. Rosa é um pilar de fé e intercessão na Koinônia, ministério marcado pela presença de Deus e pelo cuidado com as pessoas.',
    versiculo: '"A graça do Senhor Jesus Cristo seja com o vosso espírito." — Fil 4:23',
    bg: 'linear-gradient(160deg, #1a0830 0%, #050810 55%, #250840 100%)',
    initials: 'PR',
    colorA: '#d3b86a',
    colorB: '#703090',
  },
  {
    id: 3,
    nome: 'Pr. Nelson',
    cargo: 'Pastor',
    desc: 'O Pr. Nelson serve com dedicação e fidelidade, edificando a Igreja através do ensino da Palavra e do pastoreio de vidas.',
    versiculo: '"Tudo posso naquele que me fortalece." — Filipenses 4:13',
    bg: 'linear-gradient(160deg, #0a215b 0%, #050810 55%, #142a70 100%)',
    initials: 'PN',
    colorA: '#6090e0',
    colorB: '#0a215b',
  },
  {
    id: 4,
    nome: 'Pra. Yara',
    cargo: 'Pastora',
    desc: 'A Pra. Yara ministra com sensibilidade ao Espírito Santo, levando cura e restauração onde quer que vá.',
    versiculo: '"O amor é paciente, é benigno." — 1 Coríntios 13:4',
    bg: 'linear-gradient(160deg, #1a1010 0%, #050810 55%, #301828 100%)',
    initials: 'PY',
    colorA: '#e0a0c0',
    colorB: '#803050',
  },
  {
    id: 5,
    nome: 'Pr. Edmar',
    cargo: 'Pastor',
    desc: 'O Pr. Edmar é um servo fiel, comprometido com a missão da Igreja e com o crescimento espiritual de cada membro da comunidade.',
    versiculo: '"Seja a luz de vocês assim brilhar." — Mateus 5:16',
    bg: 'linear-gradient(160deg, #102010 0%, #050810 55%, #1a3018 100%)',
    initials: 'PE',
    colorA: '#70c080',
    colorB: '#205030',
  },
  {
    id: 6,
    nome: 'Pra. Duci',
    cargo: 'Pastora',
    desc: 'A Pra. Duci serve com alegria e entrega total, sendo instrumento de bênção na vida das famílias e dos grupos de discipulado.',
    versiculo: '"Alegrai-vos sempre no Senhor." — Filipenses 4:4',
    bg: 'linear-gradient(160deg, #201008 0%, #050810 55%, #382010 100%)',
    initials: 'PD',
    colorA: '#e0a060',
    colorB: '#804010',
  },
  {
    id: 7,
    nome: 'Pr. Laélson',
    cargo: 'Pastor',
    desc: 'O Pr. Laélson ministra com unção e precisão profética, sendo usado por Deus para edificar a Igreja e alcançar os perdidos.',
    versiculo: '"Espera no SENHOR; tem bom ânimo." — Salmos 27:14',
    bg: 'linear-gradient(160deg, #0a215b 0%, #050810 55%, #0d1a50 100%)',
    initials: 'LA',
    colorA: '#90b0ff',
    colorB: '#2040a0',
  },
  {
    id: 8,
    nome: 'Pra. Miriam',
    cargo: 'Pastora',
    desc: 'A Pra. Miriam é um exemplo de fidelidade e consagração, ministrando profundidade da Palavra com amor e compaixão.',
    versiculo: '"A mulher virtuosa é a coroa do seu marido." — Prov 12:4',
    bg: 'linear-gradient(160deg, #180830 0%, #050810 55%, #200838 100%)',
    initials: 'PM',
    colorA: '#c0a0e0',
    colorB: '#6030a0',
  },
  {
    id: 9,
    nome: 'Pr. Daniel',
    cargo: 'Pastor',
    desc: 'O Pr. Daniel serve com integridade e paixão pelo mover de Deus, sendo referência de caráter e comprometimento na liderança.',
    versiculo: '"Daniel tinha um espírito excelente." — Daniel 6:3',
    bg: 'linear-gradient(160deg, #0a1030 0%, #050810 55%, #101838 100%)',
    initials: 'DN',
    colorA: '#80b0d0',
    colorB: '#203860',
  },
  {
    id: 10,
    nome: 'Pra. Sarah',
    cargo: 'Pastora',
    desc: 'A Pra. Sarah ministra com fé e ousadia, levando a mensagem do Evangelho com poder e demonstração do Espírito Santo.',
    versiculo: '"Pela fé, Sara recebeu força." — Hebreus 11:11',
    bg: 'linear-gradient(160deg, #200a10 0%, #050810 55%, #300a18 100%)',
    initials: 'SA',
    colorA: '#f0a0a0',
    colorB: '#802030',
  },
]

export default function Pastores() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const [expanded, setExpanded] = useState(false)
  const autoRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dragStartX = useRef(0)
  const isDragging = useRef(false)

  const goTo = (index: number, dir: number) => {
    setDirection(dir)
    setCurrent(index)
    setExpanded(false)
  }

  const next = () => goTo((current + 1) % pastores.length, 1)
  const prev = () => goTo((current - 1 + pastores.length) % pastores.length, -1)

  useEffect(() => {
    if (expanded) return
    autoRef.current = setTimeout(next, 5500)
    return () => { if (autoRef.current) clearTimeout(autoRef.current) }
  }, [current, expanded])

  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    isDragging.current = true
    dragStartX.current = 'touches' in e ? e.touches[0].clientX : e.clientX
  }

  const handleDragEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging.current) return
    isDragging.current = false
    const endX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX
    const diff = dragStartX.current - endX
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev()
  }

  const pastor = pastores[current]
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
      {/* Ring decoration */}
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

      {/* Carousel container */}
      <div style={{ position: 'relative', maxWidth: '420px', margin: '0 auto', padding: '0 24px' }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={pastor.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -80 }}
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
            /* Drag/swipe — mouse e touch */
            onMouseDown={handleDragStart}
            onMouseUp={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchEnd={handleDragEnd}
            style={{
              borderRadius: '24px',
              overflow: 'hidden',
              position: 'relative',
              background: pastor.bg,
              border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: `0 24px 64px rgba(0,0,0,0.65), 0 0 0 1px rgba(211,184,106,0.08)`,
              aspectRatio: '3/4',
              maxHeight: '520px',
              cursor: 'grab',
              userSelect: 'none',
            }}
          >
            {/* Avatar / photo placeholder */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: '10px',
              paddingBottom: expanded ? '65%' : '44%',
              transition: 'padding-bottom 0.45s ease',
              pointerEvents: 'none',
            }}>
              <div style={{
                width: 'clamp(72px, 16vw, 100px)',
                height: 'clamp(72px, 16vw, 100px)',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${pastor.colorA}, ${pastor.colorB})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Cinzel, serif', fontWeight: 700,
                fontSize: 'clamp(20px, 4vw, 30px)', color: '#fff',
                boxShadow: `0 0 36px ${pastor.colorA}35`,
                flexShrink: 0,
              }}>
                {pastor.initials}
              </div>
              <span style={{
                fontSize: '9px', color: 'rgba(255,255,255,0.28)',
                letterSpacing: '2px', fontFamily: 'Cinzel, serif',
              }}>
                FOTO EM BREVE
              </span>
            </div>

            {/* Instagram overlay */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: 'linear-gradient(0deg, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.85) 50%, transparent 100%)',
              padding: 'clamp(14px, 3vw, 22px)',
            }}>
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

              <h3 style={{
                fontFamily: 'Cinzel, serif',
                fontSize: 'clamp(15px, 3.5vw, 20px)',
                fontWeight: 700, color: '#fff', marginBottom: '8px', lineHeight: 1.2,
              }}>
                {pastor.nome}
              </h3>

              {/* Caption colapsada / expandida */}
              <AnimatePresence initial={false} mode="wait">
                {!expanded ? (
                  <motion.p
                    key="col"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ color: 'rgba(255,255,255,0.62)', fontSize: '13px', lineHeight: 1.55, margin: 0 }}
                  >
                    {firstSentence}{' '}
                    <button
                      onClick={e => { e.stopPropagation(); setExpanded(true) }}
                      style={{
                        background: 'none', border: 'none', padding: 0,
                        color: 'rgba(255,255,255,0.38)', fontSize: '13px',
                        cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      mais
                    </button>
                  </motion.p>
                ) : (
                  <motion.div
                    key="exp"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', lineHeight: 1.65, marginBottom: '10px' }}>
                      {pastor.desc}
                    </p>
                    <p style={{
                      color: 'rgba(255,255,255,0.42)', fontSize: '12px',
                      fontStyle: 'italic', lineHeight: 1.55, marginBottom: '8px',
                      borderLeft: `2px solid ${pastor.colorA}50`, paddingLeft: '10px',
                    }}>
                      {pastor.versiculo}
                    </p>
                    <button
                      onClick={e => { e.stopPropagation(); setExpanded(false) }}
                      style={{
                        background: 'none', border: 'none', padding: 0,
                        color: 'rgba(255,255,255,0.3)', fontSize: '12px',
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

        {/* Counter + dots compactos */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '18px' }}>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', fontFamily: 'Cinzel, serif', letterSpacing: '1px', minWidth: '40px', textAlign: 'right' }}>
            {String(current + 1).padStart(2, '0')}
          </span>

          {/* Mini dots — só aparece os 5 mais próximos */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {pastores.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > current ? 1 : -1)}
                style={{
                  width: i === current ? '24px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  background: i === current ? '#d3b86a' : 'rgba(255,255,255,0.15)',
                  border: 'none', cursor: 'pointer', padding: 0,
                  transition: 'width 0.3s ease, background 0.3s ease',
                  flexShrink: 0,
                }}
              />
            ))}
          </div>

          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', fontFamily: 'Cinzel, serif', letterSpacing: '1px', minWidth: '40px' }}>
            {String(pastores.length).padStart(2, '0')}
          </span>
        </div>

        {/* Swipe hint — só na primeira vez */}
        <motion.p
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 2.5, duration: 1 }}
          style={{
            textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '11px',
            letterSpacing: '1.5px', fontFamily: 'Cinzel, serif', marginTop: '8px',
            pointerEvents: 'none',
          }}
        >
          ← DESLIZE →
        </motion.p>
      </div>
    </section>
  )
}
