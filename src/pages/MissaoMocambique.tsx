import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Globe, Heart, Users, MapPin, BookOpen } from 'lucide-react'
import logo3 from '../assets/logo-3.png'

export default function MissaoMocambique() {
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
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '5px 18px', borderRadius: '50px',
            border: '1px solid rgba(211,184,106,0.35)',
            background: 'rgba(211,184,106,0.08)',
            fontSize: '11px', letterSpacing: '2.5px',
            color: '#d3b86a', fontWeight: 600,
            marginBottom: '24px', fontFamily: 'Cinzel, serif',
          }}>
            <Globe size={13} />
            PROJETO MISSIONÁRIO
          </div>

          <h1 style={{
            fontFamily: 'Cinzel, serif',
            fontSize: 'clamp(32px, 6vw, 64px)',
            fontWeight: 700, lineHeight: 1.1, marginBottom: '24px',
            background: 'linear-gradient(135deg, #fff 0%, #d3b86a 60%, #fff 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Missão Moçambique
          </h1>

          <div style={{ width: '48px', height: '2px', background: 'linear-gradient(90deg, transparent, #d3b86a, transparent)', margin: '0 auto 24px' }} />

          <p style={{
            color: 'rgba(255,255,255,0.6)', fontSize: 'clamp(16px, 2.2vw, 20px)',
            lineHeight: 1.75, maxWidth: '640px', margin: '0 auto',
          }}>
            Levando o amor de Cristo ao coração da África — uma nação,
            uma tribo, uma família por vez.
          </p>
        </motion.div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 clamp(20px, 5vw, 60px) clamp(80px, 10vw, 120px)' }}>

        {/* About */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            padding: 'clamp(28px, 4vw, 48px)',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(10,33,91,0.2), rgba(211,184,106,0.06))',
            border: '1px solid rgba(211,184,106,0.15)',
            marginBottom: '32px',
          }}
        >
          <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
            Sobre o Projeto
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 'clamp(14px, 1.8vw, 16px)', lineHeight: 1.8, marginBottom: '16px' }}>
            A Igreja Koinonia tem um chamado especial para Moçambique. Desde o início do ministério, Deus tem apontado para esse país africano como um campo de colheita enorme e urgente.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 'clamp(14px, 1.8vw, 16px)', lineHeight: 1.8 }}>
            Por meio de parcerias com missionários locais, estamos plantando igrejas, treinando líderes, distribuindo Bíblias e atendendo às necessidades básicas de comunidades carentes nas regiões Norte e Centro do país.
          </p>
        </motion.div>

        {/* Pillars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          {[
            { icon: BookOpen, title: 'Evangelização', desc: 'Compartilhando o Evangelho de Cristo para tribos e comunidades isoladas.' },
            { icon: Users, title: 'Treinamento', desc: 'Capacitando líderes e pastores locais para multiplicar o Reino de Deus.' },
            { icon: Heart, title: 'Assistência Social', desc: 'Suprindo necessidades básicas: alimentação, educação e saúde.' },
            { icon: MapPin, title: 'Plantação de Igrejas', desc: 'Estabelecendo comunidades cristãs sólidas no coração da África.' },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              style={{
                padding: 'clamp(20px, 3vw, 28px)',
                borderRadius: '18px',
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: 'rgba(211,184,106,0.12)',
                border: '1px solid rgba(211,184,106,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '14px',
              }}>
                <item.icon size={20} color="#d3b86a" />
              </div>
              <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                {item.title}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', lineHeight: 1.65 }}>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Call to action */}
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
          <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
            Como Participar
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '15px', lineHeight: 1.7, marginBottom: '24px', maxWidth: '480px', margin: '0 auto 24px' }}>
            Você pode contribuir com o projeto Missão Moçambique através de ofertas especiais, oração e envio de missionários.
          </p>
          <motion.button
            onClick={() => { navigate('/'); setTimeout(() => document.getElementById('ofertas')?.scrollIntoView({ behavior: 'smooth' }), 300) }}
            whileHover={{ scale: 1.06, boxShadow: '0 0 30px rgba(211,184,106,0.35)' }}
            whileTap={{ scale: 0.96 }}
            style={{
              padding: '14px 36px', borderRadius: '50px',
              background: 'linear-gradient(135deg, #d3b86a, #a8903a)',
              color: '#000', fontWeight: 700, fontSize: '14px',
              border: 'none', cursor: 'pointer', fontFamily: 'Cinzel, serif',
            }}
          >
            Contribuir com a Missão
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
