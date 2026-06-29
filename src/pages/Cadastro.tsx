import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, UserPlus, ArrowLeft } from 'lucide-react'
import logo3 from '../assets/logo-3.png'
import { API } from '../config'

export default function Cadastro() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ nome: '', sobrenome: '', email: '', senha: '', confirmarSenha: '' })
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
    setErro('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')

    if (form.senha.length < 6) {
      setErro('A senha precisa ter no mínimo 6 caracteres')
      return
    }
    if (form.senha !== form.confirmarSenha) {
      setErro('As senhas não coincidem')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: form.nome,
          sobrenome: form.sobrenome,
          email: form.email,
          senha: form.senha,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erro ao cadastrar')
      setSucesso(true)
      setTimeout(() => navigate('/login'), 2200)
    } catch (err: any) {
      setErro(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '13px 16px',
    color: '#fff', fontSize: '15px',
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box' as const,
    transition: 'border-color 0.2s',
  }

  const labelStyle = {
    color: 'rgba(255,255,255,0.55)',
    fontSize: '12px', fontWeight: 600 as const,
    letterSpacing: '0.5px',
    fontFamily: 'Inter, sans-serif',
    marginBottom: '6px',
    display: 'block' as const,
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => (e.target.style.borderColor = 'rgba(211,184,106,0.5)')
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')

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
          width: '100%', maxWidth: '460px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '28px',
          padding: 'clamp(32px, 5vw, 48px)',
          backdropFilter: 'blur(20px)',
          position: 'relative',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            background: '#fff', borderRadius: '12px',
            padding: '8px 10px', marginBottom: '14px',
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
            Crie sua conta
          </p>
        </div>

        {/* Sucesso */}
        {sucesso ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              textAlign: 'center', padding: '32px 16px',
              color: '#7de8a0', fontFamily: 'Inter, sans-serif',
            }}
          >
            <div style={{ fontSize: '40px', marginBottom: '14px' }}>✓</div>
            <p style={{ fontSize: '17px', fontWeight: 600, marginBottom: '8px' }}>Cadastro realizado!</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Redirecionando para o login...</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Nome + Sobrenome */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>NOME</label>
                <input
                  type="text"
                  value={form.nome}
                  onChange={e => set('nome', e.target.value)}
                  required
                  placeholder="João"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
              <div>
                <label style={labelStyle}>SOBRENOME</label>
                <input
                  type="text"
                  value={form.sobrenome}
                  onChange={e => set('sobrenome', e.target.value)}
                  required
                  placeholder="Silva"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>E-MAIL</label>
              <input
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                required
                placeholder="seu@email.com"
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            {/* Senha */}
            <div>
              <label style={labelStyle}>SENHA</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  value={form.senha}
                  onChange={e => set('senha', e.target.value)}
                  required
                  placeholder="mínimo 6 caracteres"
                  style={{ ...inputStyle, paddingRight: '48px' }}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
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

            {/* Confirmar Senha */}
            <div>
              <label style={labelStyle}>CONFIRMAR SENHA</label>
              <input
                type={mostrarSenha ? 'text' : 'password'}
                value={form.confirmarSenha}
                onChange={e => set('confirmarSenha', e.target.value)}
                required
                placeholder="repita a senha"
                style={{
                  ...inputStyle,
                  borderColor: form.confirmarSenha && form.confirmarSenha !== form.senha
                    ? 'rgba(255,107,107,0.5)'
                    : 'rgba(255,255,255,0.1)',
                }}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
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
                <span style={{ opacity: 0.7 }}>Cadastrando...</span>
              ) : (
                <><UserPlus size={17} /> Criar Conta</>
              )}
            </motion.button>
          </form>
        )}

        {!sucesso && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
              <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>ou</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
            </div>

            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
              Já tem conta?{' '}
              <Link to="/login" style={{ color: '#d3b86a', fontWeight: 600, textDecoration: 'none' }}>
                Entrar
              </Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  )
}
