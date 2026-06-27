import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Copy, Check, QrCode } from 'lucide-react'

const PIX_KEY = '12.345.678/0001-90'

export default function Ofertas() {
  const [copied, setCopied] = useState(false)
  const titleRef = useRef(null)
  const inView = useInView(titleRef, { once: true, margin: '-80px' })

  const copy = async () => {
    await navigator.clipboard.writeText(PIX_KEY)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  return (
    <section
      id="ofertas"
      style={{
        padding: 'clamp(80px, 12vw, 140px) 24px',
        background: '#08091a',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Glow */}
      <div style={{
        position: 'absolute', top: '10%', right: '-60px',
        width: '400px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(211,184,106,0.06) 0%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        {/* Title */}
        <div ref={titleRef} style={{ textAlign: 'center', marginBottom: 'clamp(40px, 7vw, 72px)' }}>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            style={{ display: 'block', color: '#d3b86a', fontFamily: 'Cinzel, serif', letterSpacing: '3px', fontSize: '11px', fontWeight: 600, marginBottom: '14px' }}
          >
            DÍZIMOS & OFERTAS
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(30px, 5vw, 52px)', fontWeight: 700, color: '#fff', lineHeight: 1.1, marginBottom: '16px' }}
          >
            Seja Parte da
            <br />
            <span style={{ background: 'linear-gradient(135deg, #d3b86a, #0a215b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Missão
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ color: 'rgba(255,255,255,0.45)', fontSize: 'clamp(14px, 1.8vw, 17px)', lineHeight: 1.75, fontStyle: 'italic' }}
          >
            "Cada um dê conforme determinou em seu coração, não com tristeza, nem por necessidade; porque Deus ama ao que dá com alegria."
            <span style={{ display: 'block', marginTop: '6px', fontSize: '12px', color: 'rgba(211,184,106,0.6)', fontStyle: 'normal', letterSpacing: '1px' }}>
              2 Coríntios 9:7
            </span>
          </motion.p>
        </div>

        {/* PIX Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            borderRadius: '28px',
            border: '1px solid rgba(211,184,106,0.2)',
            background: 'linear-gradient(135deg, rgba(211,184,106,0.07) 0%, rgba(10,33,91,0.08) 100%)',
            overflow: 'hidden',
          }}
        >
          {/* Card header */}
          <div style={{
            padding: 'clamp(24px, 3vw, 36px)',
            borderBottom: '1px solid rgba(211,184,106,0.1)',
            display: 'flex', alignItems: 'center', gap: '16px',
          }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '16px',
              background: 'rgba(211,184,106,0.12)',
              border: '1px solid rgba(211,184,106,0.28)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <QrCode size={24} color="#d3b86a" />
            </div>
            <div>
              <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(18px, 2.5vw, 22px)', fontWeight: 700, color: '#fff' }}>
                PIX
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', marginTop: '2px' }}>
                Rápido, seguro e sem taxas
              </p>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '0',
          }}>
            {/* Key copy */}
            <div style={{ padding: 'clamp(24px, 3vw, 36px)' }}>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', letterSpacing: '1px', marginBottom: '12px', fontFamily: 'Cinzel, serif' }}>
                CHAVE CNPJ
              </p>
              <div style={{
                padding: '14px 16px', borderRadius: '12px',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(211,184,106,0.15)',
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', gap: '12px', marginBottom: '20px',
              }}>
                <span style={{ fontFamily: 'monospace', fontSize: '15px', color: '#fff', fontWeight: 600, letterSpacing: '0.5px' }}>
                  {PIX_KEY}
                </span>
                <motion.button
                  onClick={copy}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    padding: '7px 14px', borderRadius: '8px',
                    background: copied ? 'rgba(74,222,128,0.12)' : 'rgba(211,184,106,0.1)',
                    border: `1px solid ${copied ? 'rgba(74,222,128,0.35)' : 'rgba(211,184,106,0.3)'}`,
                    color: copied ? '#4ade80' : '#d3b86a',
                    fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'all 0.25s ease', flexShrink: 0,
                  }}
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  {copied ? 'Copiado!' : 'Copiar'}
                </motion.button>
              </div>

              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', lineHeight: 1.6 }}>
                Faça sua oferta com segurança pelo aplicativo do seu banco. A transação é instantânea e sem custo.
              </p>
            </div>

            {/* QR Code area */}
            <div style={{
              padding: 'clamp(24px, 3vw, 36px)',
              borderLeft: '1px solid rgba(211,184,106,0.08)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: '12px',
            }}>
              {/* QR Code placeholder */}
              <div style={{
                width: 'clamp(120px, 18vw, 160px)',
                height: 'clamp(120px, 18vw, 160px)',
                borderRadius: '16px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px dashed rgba(211,184,106,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', gap: '8px',
              }}>
                <QrCode size={32} color="rgba(211,184,106,0.35)" />
                <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '10px', letterSpacing: '1.5px', fontFamily: 'Cinzel, serif', textAlign: 'center' }}>
                  QR CODE
                  <br />
                  EM BREVE
                </span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', textAlign: 'center', letterSpacing: '0.3px', maxWidth: '140px' }}>
                Aponte a câmera do celular para pagar
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
