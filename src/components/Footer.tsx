import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Heart, Video, Share2 } from 'lucide-react'
import logo3 from '../assets/logo-3.png'

const navLinks = [
  { label: 'Sobre', href: '#sobre' },
  { label: 'Eventos', href: '#eventos' },
  { label: 'Projetos', href: '#projetos' },
  { label: 'Ofertas', href: '#ofertas' },
  { label: 'Pastores', href: '#pastores' },
  { label: 'Localização', href: '#localizacao' },
]

const socials = [
  {
    icon: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
      </svg>
    ),
    href: 'https://www.instagram.com/igrejakoinoniablumenau/',
    label: 'Instagram',
  },
  {
    icon: Video,
    href: 'https://www.youtube.com/@igrejakoinoniablumenau917',
    label: 'YouTube',
  },
  {
    icon: Share2,
    href: '#',
    label: 'Compartilhar',
  },
]

export default function Footer() {
  const scrollTo = (href: string) => {
    const id = href.slice(1)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer style={{
      background: '#08091a',
      borderTop: '1px solid rgba(211,184,106,0.1)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, #d3b86a, transparent)',
      }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(56px, 8vw, 96px) clamp(20px, 4vw, 40px) clamp(28px, 4vw, 44px)' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'clamp(36px, 5vw, 60px)',
          marginBottom: 'clamp(44px, 6vw, 64px)',
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
              <div style={{
                background: '#fff', borderRadius: '8px',
                padding: '4px 6px', height: '36px', width: '44px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <img src={logo3} alt="Koinonia" style={{ height: '26px', width: 'auto' }} />
              </div>
              <span style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '15px', letterSpacing: '2px', color: '#fff' }}>
                KOINONIA
              </span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '13px', lineHeight: 1.7, maxWidth: '240px', marginBottom: '20px' }}>
              Uma comunidade unida pelo amor de Cristo, comprometida com a Palavra e com o próximo.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              {socials.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.label}
                  whileHover={{ scale: 1.1, background: 'rgba(211,184,106,0.15)', borderColor: 'rgba(211,184,106,0.4)' }}
                  style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'rgba(255,255,255,0.45)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <s.icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Nav */}
          <div>
            <h4 style={{ fontFamily: 'Cinzel, serif', fontSize: '13px', fontWeight: 700, color: '#fff', letterSpacing: '1.5px', marginBottom: '20px' }}>
              NAVEGAÇÃO
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {navLinks.map(link => (
                <li key={link.href}>
                  <motion.button
                    onClick={() => scrollTo(link.href)}
                    whileHover={{ x: 5, color: '#d3b86a' }}
                    style={{
                      background: 'none', border: 'none',
                      color: 'rgba(255,255,255,0.4)', fontSize: '14px',
                      cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                      padding: 0, transition: 'color 0.2s',
                    }}
                  >
                    {link.label}
                  </motion.button>
                </li>
              ))}
            </ul>
          </div>

          {/* Cultos */}
          <div>
            <h4 style={{ fontFamily: 'Cinzel, serif', fontSize: '13px', fontWeight: 700, color: '#fff', letterSpacing: '1.5px', marginBottom: '20px' }}>
              CULTOS
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { dia: 'Domingo', hora: '19:00', desc: 'Culto de Celebração' },
                { dia: 'Sábado', hora: '19:30', desc: 'Culto de Jovens' },
                { dia: 'Sexta (quinzenal)', hora: '22:00', desc: 'Vigília' },
              ].map(item => (
                <li key={item.dia}>
                  <span style={{ color: '#d3b86a', fontSize: '11px', fontWeight: 700, fontFamily: 'Cinzel, serif', letterSpacing: '0.5px', display: 'block' }}>
                    {item.dia} — {item.hora}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px' }}>{item.desc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontFamily: 'Cinzel, serif', fontSize: '13px', fontWeight: 700, color: '#fff', letterSpacing: '1.5px', marginBottom: '20px' }}>
              CONTATO
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { icon: MapPin, text: 'Blumenau — SC' },
                { icon: Phone, text: '(47) 00000-0000' },
                { icon: Mail, text: 'contato@koinonia.com.br' },
              ].map(({ icon: Icon, text }) => (
                <li key={text} style={{ display: 'flex', gap: '9px', alignItems: 'flex-start' }}>
                  <Icon size={14} color="#d3b86a" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', lineHeight: 1.5 }}>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', marginBottom: '22px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px' }}>
            © {new Date().getFullYear()} Igreja Koinonia Blumenau. Todos os direitos reservados.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            Feito com <Heart size={11} fill="rgba(211,184,106,0.5)" color="rgba(211,184,106,0.5)" /> para a glória de Deus
          </p>
        </div>
      </div>
    </footer>
  )
}
