import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Home, Hammer, Users, Star } from 'lucide-react'
import logo3 from '../assets/logo-3.png'

export default function LIMPAZ() {
  const navigate = useNavigate()

  return (
    <div style={{ background: '#000', minHeight: '100vh', color: '#fff' }}>
      {/* Header */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 clamp(16px, 4vw, 40px)', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(211,184,106,0.12)',
      }}>
        <motion.button
          onClick={() => navigate('/')}
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.95 }}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)',
            fontSize: '14px', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          }}
        >
          <ArrowLeft size={18} />
          Voltar
        </motion.button>
        <div style={{ background: '#fff', borderRadius: '7px', padding: '4px 6px', height: '34px', width: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={logo3} alt="Koinonia" style={{ height: '24px', width: 'auto' }} />
        </div>
      </div>

      {/* Hero */}
      <div style={{
        padding: 'clamp(100px, 14vw, 140px) clamp(20px, 5vw, 60px) clamp(60px, 8vw, 100px)',
        maxWidth: '900px', margin: '0 auto', textAlign: 'center',
      }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '5px 18px', borderRadius: '50px',
            border: '1px solid rgba(211,184,106,0.35)',
            background: 'rgba(211,184,106,0.08)',
            fontSize: '11px', letterSpacing: '2.5px',
            color: '#d3b86a', fontWeight: 600, marginBottom: '24px',
            fontFamily: 'Cinzel, serif',
          }}>
            <Home size={13} />
            PROJETO SOCIAL
          </div>

          <h1 style={{
            fontFamily: 'Cinzel, serif',
            fontSize: 'clamp(40px, 8vw, 80px)',
            fontWeight: 700, lineHeight: 1.05, marginBottom: '16px',
            background: 'linear-gradient(135deg, #fff 0%, #d3b86a 60%, #fff 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            LIMPAZ
          </h1>

          <div style={{ width: '48px', height: '2px', background: 'linear-gradient(90deg, transparent, #d3b86a, transparent)', margin: '0 auto 20px' }} />

          <p style={{
            color: 'rgba(255,255,255,0.55)', fontSize: 'clamp(13px, 1.8vw, 16px)',
            letterSpacing: '1px', fontFamily: 'Cinzel, serif', marginBottom: '20px',
          }}>
            LARES IMPACTADOS, MORADIAS TRANSFORMADAS
          </p>

          <p style={{
            color: 'rgba(255,255,255,0.6)', fontSize: 'clamp(15px, 2vw, 18px)',
            lineHeight: 1.75, maxWidth: '620px', margin: '0 auto',
          }}>
            Restaurando dignidade através de reformas habitacionais para famílias
            em situação de vulnerabilidade em Blumenau e região.
          </p>
        </motion.div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 clamp(20px, 5vw, 60px) clamp(80px, 10vw, 120px)' }}>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            padding: 'clamp(28px, 4vw, 48px)', borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(10,33,91,0.2), rgba(211,184,106,0.06))',
            border: '1px solid rgba(211,184,106,0.15)', marginBottom: '32px',
          }}
        >
          <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
            O que é o LIMPAZ?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '15px', lineHeight: 1.8, marginBottom: '16px' }}>
            O LIMPAZ é um projeto da Igreja Koinonia voltado para reformas residenciais de famílias que vivem em condições precárias. Nossos times de voluntários realizam mutirões de limpeza profunda, pequenas obras e melhorias habitacionais, devolvendo dignidade e conforto a lares que precisam de cuidado.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '15px', lineHeight: 1.8 }}>
            Mais do que tijolo e tinta, o LIMPAZ leva o amor de Deus de forma concreta às famílias mais vulneráveis da cidade.
          </p>
        </motion.div>

        {/* Stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '1px', background: 'rgba(211,184,106,0.1)',
          borderRadius: '20px', overflow: 'hidden',
          border: '1px solid rgba(211,184,106,0.12)', marginBottom: '32px',
        }}>
          {[
            { num: '40+', label: 'Lares Reformados' },
            { num: '120+', label: 'Voluntários' },
            { num: '5', label: 'Anos Atuando' },
            { num: '15+', label: 'Mutirões' },
          ].map((s, i) => (
            <div key={i} style={{ padding: '28px 20px', background: '#06080f', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 700, color: '#d3b86a' }}>{s.num}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '6px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '36px' }}>
          {[
            { icon: Star, title: 'Identificação', desc: 'Famílias em situação de vulnerabilidade são indicadas pela comunidade ou pela própria Igreja.' },
            { icon: Hammer, title: 'Mutirão', desc: 'Times de voluntários realizam o trabalho de reforma em sábados e datas especiais.' },
            { icon: Users, title: 'Acompanhamento', desc: 'Após a reforma, a família é acolhida pela comunidade da Igreja para suporte contínuo.' },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              style={{
                padding: 'clamp(20px, 3vw, 28px)', borderRadius: '18px',
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: 'rgba(211,184,106,0.12)', border: '1px solid rgba(211,184,106,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px',
              }}>
                <item.icon size={20} color="#d3b86a" />
              </div>
              <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>{item.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', lineHeight: 1.65 }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            textAlign: 'center', padding: 'clamp(32px, 5vw, 52px)',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(211,184,106,0.1), rgba(10,33,91,0.15))',
            border: '1px solid rgba(211,184,106,0.2)',
          }}
        >
          <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
            Quero Ser Voluntário
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '15px', lineHeight: 1.7, maxWidth: '460px', margin: '0 auto 24px' }}>
            Você pode ajudar dedicando algumas horas, doando materiais de construção ou contribuindo financeiramente para o projeto.
          </p>
          <motion.a
            href="https://www.instagram.com/igrejakoinoniablumenau/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.06, boxShadow: '0 0 30px rgba(211,184,106,0.35)' }}
            whileTap={{ scale: 0.96 }}
            style={{
              display: 'inline-block', padding: '14px 36px', borderRadius: '50px',
              background: 'linear-gradient(135deg, #d3b86a, #a8903a)',
              color: '#000', fontWeight: 700, fontSize: '14px',
              border: 'none', cursor: 'pointer', fontFamily: 'Cinzel, serif',
              textDecoration: 'none',
            }}
          >
            Entrar em Contato
          </motion.a>
        </motion.div>
      </div>
    </div>
  )
}
