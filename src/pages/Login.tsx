import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, LogIn, ArrowLeft } from 'lucide-react'
import logo3 from '../assets/logo-3.png'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setLoading(true)
    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erro ao entrar')
      localStorage.setItem('koinonia_token', data.token)
      localStorage.setItem('koinonia_usuario', JSON.stringify(data.usuario))
      navigate('/dashboard')
    } catch (err: any) {
      setErro(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Glow background */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(10,33,91,0.35) 0%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '300px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(211,184,106,0.08) 0%, transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />

      {/* Back button */}
      <motion.button
        onClick={() => navigate('/')}
        whileHover={{ x: -3 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'absolute', top: '24px', left: '24px',
          display: 'flex', alignItems: 'center', gap: '7px',
          background: 'none', border: 'none',
          color: 'rgba(255,255,255,0.5)', fontSize: '14px',
          cursor: 'pointer', fontFamily: 'Inter, sans-serif',
        }}
      >
        <ArrowLeft size={16} />
        Voltar
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: '100%', maxWidth: '420px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '28px',
          padding: 'clamp(32px, 5vw, 48px)',
          backdropFilter: 'blur(20px)',
          position: 'relative',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            background: '#fff', borderRadius: '12px',
            padding: '8px 10px', marginBottom: '16px',
            width: '52px', height: '44px',
          }}>
            <img src={logo3} alt="Koinônia" style={{ height: '30px', width: 'auto' }} />
          </div>
          <h1 style={{
            fontFamily: 'Cinzel, serif', fontSize: '22px',
            fontWeight: 700, color: '#fff', letterSpacing: '2px', marginBottom: '6px',
          }}>
            KOINONIA
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}>
            Acesse sua conta
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Email */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ color: 'rgba(255,255,255,0.55)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.5px', fontFamily: 'Inter, sans-serif' }}>
              E-MAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '13px 16px',
                color: '#fff', fontSize: '15px',
                fontFamily: 'Inter, sans-serif',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.target.style.borderColor = 'rgba(211,184,106,0.5)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
            />
          </div>

          {/* Senha */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ color: 'rgba(255,255,255,0.55)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.5px', fontFamily: 'Inter, sans-serif' }}>
              SENHA
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={mostrarSenha ? 'text' : 'password'}
                value={senha}
                onChange={e => setSenha(e.target.value)}
                required
                placeholder="••••••••"
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  padding: '13px 48px 13px 16px',
                  color: '#fff', fontSize: '15px',
                  fontFamily: 'Inter, sans-serif',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={e => (e.target.style.borderColor = 'rgba(211,184,106,0.5)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(v => !v)}
                style={{
                  position: 'absolute', right: '14px', top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none',
                  color: 'rgba(255,255,255,0.35)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center',
                }}
              >
                {mostrarSenha ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {/* Erro */}
          {erro && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                color: '#ff6b6b', fontSize: '13px',
                background: 'rgba(255,107,107,0.08)',
                border: '1px solid rgba(255,107,107,0.2)',
                borderRadius: '8px', padding: '10px 14px',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {erro}
            </motion.p>
          )}

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={!loading ? { scale: 1.02, boxShadow: '0 0 28px rgba(211,184,106,0.35)' } : {}}
            whileTap={!loading ? { scale: 0.97 } : {}}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              padding: '14px',
              background: loading ? 'rgba(211,184,106,0.4)' : 'linear-gradient(135deg, #d3b86a, #a8903a)',
              border: 'none', borderRadius: '12px',
              color: '#000', fontWeight: 700, fontSize: '15px',
              fontFamily: 'Cinzel, serif', letterSpacing: '0.5px',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '4px',
            }}
          >
            {loading ? (
              <span style={{ opacity: 0.7 }}>Entrando...</span>
            ) : (
              <><LogIn size={17} /> Entrar</>
            )}
          </motion.button>
        </form>

        {/* Divider */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          margin: '24px 0',
        }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>ou</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
        </div>

        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
          Não tem conta?{' '}
          <Link
            to="/cadastro"
            style={{ color: '#d3b86a', fontWeight: 600, textDecoration: 'none' }}
          >
            Cadastre-se
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
