import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Menu, X, LogIn } from 'lucide-react'
import logo3 from '../assets/logo-3.png'

const navLinks = [
  { label: 'Sobre', href: '#sobre' },
  { label: 'Eventos', href: '#eventos' },
  { label: 'Projetos', href: '#projetos' },
  { label: 'Ofertas', href: '#ofertas' },
  { label: 'Pastores', href: '#pastores' },
]

export default function Header() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      const sections = navLinks.map(l => l.href.slice(1))
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(id)
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (href: string) => {
    setMenuOpen(false)
    document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          padding: '0 clamp(16px, 3vw, 40px)',
          height: scrolled ? '60px' : '76px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          transition: 'all 0.4s ease',
          background: scrolled ? 'rgba(8,9,26,0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(211,184,106,0.12)' : 'none',
        }}
      >
        {/* Logo */}
        <motion.a
          href="#"
          onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <div style={{
            background: '#fff',
            borderRadius: '8px',
            padding: '4px 6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '36px',
            width: '44px',
            flexShrink: 0,
            overflow: 'hidden',
          }}>
            <img src={logo3} alt="Koinonia" style={{ height: '28px', width: 'auto', objectFit: 'contain' }} />
          </div>
          <span style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '17px', letterSpacing: '2.5px', color: '#fff' }}>
            KOINONIA
          </span>
        </motion.a>

        {/* Desktop Nav */}
        <nav className="desktop-nav" style={{ display: 'none', alignItems: 'center', gap: '4px' }}>
          {navLinks.map(link => (
            <motion.button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              whileHover={{ y: -1 }}
              style={{
                background: 'none', border: 'none', padding: '8px 16px',
                fontSize: '13px', fontWeight: 500, letterSpacing: '0.5px',
                color: activeSection === link.href.slice(1) ? '#d3b86a' : 'rgba(255,255,255,0.75)',
                cursor: 'pointer', position: 'relative', fontFamily: 'Inter, sans-serif',
              }}
            >
              {link.label}
              {activeSection === link.href.slice(1) && (
                <motion.div layoutId="nav-underline" style={{
                  position: 'absolute', bottom: '3px', left: '50%',
                  transform: 'translateX(-50%)',
                  width: '18px', height: '2px',
                  background: '#d3b86a', borderRadius: '2px',
                }} />
              )}
            </motion.button>
          ))}
        </nav>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <motion.button
            onClick={() => navigate('/login')}
            whileHover={{ scale: 1.05, boxShadow: '0 0 22px rgba(211,184,106,0.45)' }}
            whileTap={{ scale: 0.96 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '9px 20px', borderRadius: '50px',
              background: 'linear-gradient(135deg, #d3b86a, #a8903a)',
              color: '#000', fontWeight: 700, fontSize: '13px',
              letterSpacing: '0.3px', border: 'none', cursor: 'pointer',
              fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap',
            }}
          >
            <LogIn size={14} />
            <span className="login-label">Entrar</span>
          </motion.button>

          <motion.button
            onClick={() => setMenuOpen(!menuOpen)}
            whileTap={{ scale: 0.9 }}
            className="hamburger-btn"
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px', width: '40px', height: '40px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
            }}
          >
            <AnimatePresence mode="wait">
              {menuOpen
                ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}><X size={20} /></motion.div>
                : <motion.div key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}><Menu size={20} /></motion.div>
              }
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed', top: '60px', left: 0, right: 0, zIndex: 999,
              background: 'rgba(0,0,0,0.97)', backdropFilter: 'blur(24px)',
              borderBottom: '1px solid rgba(211,184,106,0.18)',
              padding: '20px 24px 28px',
            }}
          >
            {navLinks.map((link, i) => (
              <motion.button
                key={link.href}
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => handleNavClick(link.href)}
                style={{
                  display: 'block', width: '100%', padding: '15px 0',
                  background: 'none', border: 'none',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  color: activeSection === link.href.slice(1) ? '#d3b86a' : 'rgba(255,255,255,0.8)',
                  fontSize: '17px', fontWeight: 600,
                  fontFamily: 'Cinzel, serif', letterSpacing: '1.5px',
                  cursor: 'pointer', textAlign: 'left',
                }}
              >
                {link.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .hamburger-btn { display: none !important; }
        }
        @media (max-width: 420px) {
          .login-label { display: none; }
        }
      `}</style>
    </>
  )
}
