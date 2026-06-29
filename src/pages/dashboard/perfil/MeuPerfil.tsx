import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { User, MapPin, Lock, Check, AlertCircle, Camera, Loader } from 'lucide-react'
import PageShell, { Card, inputStyle, labelStyle, btnPrimary } from '../PageShell'

const API = 'http://localhost:3000'

function authHeaders(contentType = 'application/json') {
  return {
    'Content-Type': contentType,
    Authorization: `Bearer ${localStorage.getItem('koinonia_token') ?? ''}`,
  }
}

type Feedback = { type: 'ok' | 'err'; msg: string }

function FeedbackMsg({ fb }: { fb: Feedback | null }) {
  if (!fb) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '10px 14px', borderRadius: '10px', fontSize: '13px',
        fontFamily: 'Inter, sans-serif',
        color: fb.type === 'ok' ? '#7de8a0' : '#ff6b6b',
        background: fb.type === 'ok' ? 'rgba(125,232,160,0.08)' : 'rgba(255,107,107,0.08)',
        border: `1px solid ${fb.type === 'ok' ? 'rgba(125,232,160,0.25)' : 'rgba(255,107,107,0.25)'}`,
      }}
    >
      {fb.type === 'ok' ? <Check size={14} /> : <AlertCircle size={14} />}
      {fb.msg}
    </motion.div>
  )
}

const selectStyle = { ...inputStyle, appearance: 'none' as const }

export default function MeuPerfil() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [perfil, setPerfil] = useState({
    nome: '', sobrenome: '', email: '',
    foto: '', dataAniversario: '',
    genero: '', estadoCivil: '',
    logradouro: '', bairro: '', cidade: '',
  })
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)
  const [uploadingFoto, setUploadingFoto] = useState(false)
  const [fbFoto, setFbFoto] = useState<Feedback | null>(null)

  const [senha, setSenha] = useState({ senhaAtual: '', novaSenha: '', confirmar: '' })
  const [loadingPerfil, setLoadingPerfil] = useState(false)
  const [loadingSenha, setLoadingSenha] = useState(false)
  const [fbPerfil, setFbPerfil] = useState<Feedback | null>(null)
  const [fbSenha, setFbSenha] = useState<Feedback | null>(null)

  useEffect(() => {
    fetch(`${API}/usuarios/me`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('koinonia_token') ?? ''}` },
    })
      .then(r => r.json())
      .then(data => {
        setPerfil({
          nome: data.nome ?? '',
          sobrenome: data.sobrenome ?? '',
          email: data.email ?? '',
          foto: data.foto ?? '',
          dataAniversario: data.dataAniversario
            ? new Date(data.dataAniversario).toISOString().slice(0, 10)
            : '',
          genero: data.genero ?? '',
          estadoCivil: data.estadoCivil ?? '',
          logradouro: data.logradouro ?? '',
          bairro: data.bairro ?? '',
          cidade: data.cidade ?? '',
        })
      })
      .catch(() => {})
  }, [])

  // --- Upload de foto ---
  async function handleFotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview imediato
    const reader = new FileReader()
    reader.onload = ev => setFotoPreview(ev.target?.result as string)
    reader.readAsDataURL(file)

    // Upload
    setUploadingFoto(true)
    setFbFoto(null)
    try {
      const formData = new FormData()
      formData.append('foto', file)
      const res = await fetch(`${API}/usuarios/me/foto`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('koinonia_token') ?? ''}` },
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erro ao enviar foto')

      setPerfil(p => ({ ...p, foto: data.foto }))
      setFotoPreview(null) // usa a foto do servidor agora

      const saved = JSON.parse(localStorage.getItem('koinonia_usuario') ?? '{}')
      localStorage.setItem('koinonia_usuario', JSON.stringify({ ...saved, ...data }))

      setFbFoto({ type: 'ok', msg: 'Foto atualizada!' })
      setTimeout(() => setFbFoto(null), 3000)
    } catch (err: any) {
      setFbFoto({ type: 'err', msg: err.message })
      setFotoPreview(null)
    } finally {
      setUploadingFoto(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // --- Salvar perfil ---
  async function salvarPerfil(e: React.FormEvent) {
    e.preventDefault()
    setFbPerfil(null)
    setLoadingPerfil(true)
    try {
      const body: Record<string, string | undefined> = {
        nome: perfil.nome || undefined,
        sobrenome: perfil.sobrenome || undefined,
        email: perfil.email || undefined,
        dataAniversario: perfil.dataAniversario || undefined,
        genero: perfil.genero || undefined,
        estadoCivil: perfil.estadoCivil || undefined,
        logradouro: perfil.logradouro || undefined,
        bairro: perfil.bairro || undefined,
        cidade: perfil.cidade || undefined,
      }
      Object.keys(body).forEach(k => body[k] === undefined && delete body[k])

      const res = await fetch(`${API}/usuarios/me`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erro ao salvar')

      const saved = JSON.parse(localStorage.getItem('koinonia_usuario') ?? '{}')
      localStorage.setItem('koinonia_usuario', JSON.stringify({ ...saved, ...data }))

      setFbPerfil({ type: 'ok', msg: 'Perfil atualizado com sucesso!' })
      setTimeout(() => setFbPerfil(null), 3500)
    } catch (err: any) {
      setFbPerfil({ type: 'err', msg: err.message })
    } finally {
      setLoadingPerfil(false)
    }
  }

  // --- Alterar senha ---
  async function alterarSenha(e: React.FormEvent) {
    e.preventDefault()
    setFbSenha(null)
    if (senha.novaSenha !== senha.confirmar) {
      setFbSenha({ type: 'err', msg: 'As senhas não coincidem' })
      return
    }
    if (senha.novaSenha.length < 6) {
      setFbSenha({ type: 'err', msg: 'A nova senha precisa ter no mínimo 6 caracteres' })
      return
    }
    setLoadingSenha(true)
    try {
      const res = await fetch(`${API}/usuarios/me/senha`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ senhaAtual: senha.senhaAtual, novaSenha: senha.novaSenha }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erro ao alterar senha')
      setSenha({ senhaAtual: '', novaSenha: '', confirmar: '' })
      setFbSenha({ type: 'ok', msg: 'Senha alterada com sucesso!' })
      setTimeout(() => setFbSenha(null), 3500)
    } catch (err: any) {
      setFbSenha({ type: 'err', msg: err.message })
    } finally {
      setLoadingSenha(false)
    }
  }

  const set = (k: string, v: string) => setPerfil(p => ({ ...p, [k]: v }))
  const setSen = (k: string, v: string) => setSenha(s => ({ ...s, [k]: v }))

  const initials = `${perfil.nome?.[0] ?? ''}${perfil.sobrenome?.[0] ?? ''}`.toUpperCase() || 'U'
  const fotoSrc = fotoPreview ?? (perfil.foto ? `${API}${perfil.foto}` : null)

  return (
    <PageShell title="Meu Perfil" subtitle="Gerencie suas informações pessoais">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '640px' }}>

        {/* Avatar + upload */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>

            {/* Avatar clicável */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div
                onClick={() => !uploadingFoto && fileInputRef.current?.click()}
                style={{
                  width: '80px', height: '80px', borderRadius: '50%',
                  background: fotoSrc ? 'transparent' : 'linear-gradient(135deg, #d3b86a, #0a215b)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '26px', color: '#fff',
                  boxShadow: '0 0 28px rgba(211,184,106,0.2)',
                  cursor: uploadingFoto ? 'not-allowed' : 'pointer',
                  overflow: 'hidden', position: 'relative',
                }}
              >
                {fotoSrc ? (
                  <img src={fotoSrc} alt="Foto de perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  initials
                )}

                {/* Overlay hover */}
                {!uploadingFoto && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    style={{
                      position: 'absolute', inset: 0, borderRadius: '50%',
                      background: 'rgba(0,0,0,0.55)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <Camera size={20} color="#fff" />
                  </motion.div>
                )}

                {/* Loading spinner */}
                {uploadingFoto && (
                  <div style={{
                    position: 'absolute', inset: 0, borderRadius: '50%',
                    background: 'rgba(0,0,0,0.6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                    >
                      <Loader size={22} color="#d3b86a" />
                    </motion.div>
                  </div>
                )}
              </div>

              {/* Input oculto */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                style={{ display: 'none' }}
                onChange={handleFotoChange}
              />
            </div>

            {/* Info + feedback */}
            <div style={{ flex: 1, minWidth: '160px' }}>
              <p style={{ color: '#fff', fontSize: '17px', fontWeight: 700, fontFamily: 'Cinzel, serif', marginBottom: '3px' }}>
                {perfil.nome} {perfil.sobrenome}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', fontFamily: 'Inter, sans-serif', marginBottom: '10px' }}>
                {perfil.email}
              </p>
              <button
                onClick={() => !uploadingFoto && fileInputRef.current?.click()}
                disabled={uploadingFoto}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '7px 14px', borderRadius: '8px', fontSize: '12px',
                  fontFamily: 'Inter, sans-serif', fontWeight: 600,
                  background: 'rgba(211,184,106,0.08)',
                  border: '1px solid rgba(211,184,106,0.25)',
                  color: '#d3b86a', cursor: uploadingFoto ? 'not-allowed' : 'pointer',
                  opacity: uploadingFoto ? 0.5 : 1,
                }}
              >
                <Camera size={13} />
                {uploadingFoto ? 'Enviando...' : 'Alterar foto'}
              </button>
              <p style={{ color: 'rgba(255,255,255,0.22)', fontSize: '11px', fontFamily: 'Inter, sans-serif', marginTop: '6px' }}>
                JPG, PNG ou WEBP · máx. 5 MB
              </p>
              {fbFoto && (
                <div style={{ marginTop: '8px' }}>
                  <FeedbackMsg fb={fbFoto} />
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Dados pessoais */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <User size={16} color="#d3b86a" />
            <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '15px', fontWeight: 700, color: '#fff' }}>
              Dados Pessoais
            </h3>
          </div>

          <form onSubmit={salvarPerfil} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={labelStyle}>NOME</label>
                <input style={inputStyle} value={perfil.nome} onChange={e => set('nome', e.target.value)} required placeholder="Nome" />
              </div>
              <div>
                <label style={labelStyle}>SOBRENOME</label>
                <input style={inputStyle} value={perfil.sobrenome} onChange={e => set('sobrenome', e.target.value)} required placeholder="Sobrenome" />
              </div>
            </div>

            <div>
              <label style={labelStyle}>E-MAIL</label>
              <input style={inputStyle} type="email" value={perfil.email} onChange={e => set('email', e.target.value)} required />
            </div>

            <div>
              <label style={labelStyle}>DATA DE ANIVERSÁRIO</label>
              <input style={inputStyle} type="date" value={perfil.dataAniversario} onChange={e => set('dataAniversario', e.target.value)} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={labelStyle}>GÊNERO</label>
                <select style={selectStyle} value={perfil.genero} onChange={e => set('genero', e.target.value)}>
                  <option value="" style={{ background: '#08091a' }}>Não informado</option>
                  <option value="MASCULINO" style={{ background: '#08091a' }}>Masculino</option>
                  <option value="FEMININO" style={{ background: '#08091a' }}>Feminino</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>ESTADO CIVIL</label>
                <select style={selectStyle} value={perfil.estadoCivil} onChange={e => set('estadoCivil', e.target.value)}>
                  <option value="" style={{ background: '#08091a' }}>Não informado</option>
                  <option value="SOLTEIRO" style={{ background: '#08091a' }}>Solteiro(a)</option>
                  <option value="CASADO" style={{ background: '#08091a' }}>Casado(a)</option>
                  <option value="DIVORCIADO" style={{ background: '#08091a' }}>Divorciado(a)</option>
                  <option value="VIUVO" style={{ background: '#08091a' }}>Viúvo(a)</option>
                  <option value="UNIAO_ESTAVEL" style={{ background: '#08091a' }}>União Estável</option>
                </select>
              </div>
            </div>

            <FeedbackMsg fb={fbPerfil} />

            <motion.button
              type="submit"
              disabled={loadingPerfil}
              whileHover={!loadingPerfil ? { scale: 1.02 } : {}}
              whileTap={!loadingPerfil ? { scale: 0.97 } : {}}
              style={{ ...btnPrimary, opacity: loadingPerfil ? 0.6 : 1, cursor: loadingPerfil ? 'not-allowed' : 'pointer' }}
            >
              {loadingPerfil ? 'Salvando...' : 'Salvar Dados Pessoais'}
            </motion.button>
          </form>
        </Card>

        {/* Endereço */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <MapPin size={16} color="#d3b86a" />
            <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '15px', fontWeight: 700, color: '#fff' }}>
              Endereço
            </h3>
          </div>

          <form onSubmit={salvarPerfil} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}>LOGRADOURO</label>
              <input style={inputStyle} value={perfil.logradouro} onChange={e => set('logradouro', e.target.value)} placeholder="Rua, Av., número..." />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={labelStyle}>BAIRRO</label>
                <input style={inputStyle} value={perfil.bairro} onChange={e => set('bairro', e.target.value)} placeholder="Bairro" />
              </div>
              <div>
                <label style={labelStyle}>CIDADE</label>
                <input style={inputStyle} value={perfil.cidade} onChange={e => set('cidade', e.target.value)} placeholder="Cidade" />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loadingPerfil}
              whileHover={!loadingPerfil ? { scale: 1.02 } : {}}
              whileTap={!loadingPerfil ? { scale: 0.97 } : {}}
              style={{ ...btnPrimary, opacity: loadingPerfil ? 0.6 : 1, cursor: loadingPerfil ? 'not-allowed' : 'pointer' }}
            >
              {loadingPerfil ? 'Salvando...' : 'Salvar Endereço'}
            </motion.button>
          </form>
        </Card>

        {/* Segurança */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Lock size={16} color="#d3b86a" />
            <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '15px', fontWeight: 700, color: '#fff' }}>
              Alterar Senha
            </h3>
          </div>

          <form onSubmit={alterarSenha} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}>SENHA ATUAL</label>
              <input style={inputStyle} type="password" value={senha.senhaAtual} onChange={e => setSen('senhaAtual', e.target.value)} required placeholder="••••••••" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={labelStyle}>NOVA SENHA</label>
                <input style={inputStyle} type="password" value={senha.novaSenha} onChange={e => setSen('novaSenha', e.target.value)} required placeholder="Mínimo 6 caracteres" />
              </div>
              <div>
                <label style={labelStyle}>CONFIRMAR SENHA</label>
                <input
                  style={{
                    ...inputStyle,
                    borderColor: senha.confirmar && senha.confirmar !== senha.novaSenha
                      ? 'rgba(255,107,107,0.5)' : 'rgba(255,255,255,0.1)',
                  }}
                  type="password"
                  value={senha.confirmar} onChange={e => setSen('confirmar', e.target.value)}
                  required placeholder="Repita a senha"
                />
              </div>
            </div>

            <FeedbackMsg fb={fbSenha} />

            <motion.button
              type="submit"
              disabled={loadingSenha}
              whileHover={!loadingSenha ? { scale: 1.02 } : {}}
              whileTap={!loadingSenha ? { scale: 0.97 } : {}}
              style={{
                ...btnPrimary,
                background: 'linear-gradient(135deg, rgba(211,184,106,0.15), rgba(10,33,91,0.3))',
                color: '#d3b86a', border: '1px solid rgba(211,184,106,0.3)',
                opacity: loadingSenha ? 0.6 : 1,
                cursor: loadingSenha ? 'not-allowed' : 'pointer',
              }}
            >
              {loadingSenha ? 'Alterando...' : 'Alterar Senha'}
            </motion.button>
          </form>
        </Card>

      </div>
    </PageShell>
  )
}
