import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, User, MapPin, Shield, Check, AlertCircle } from 'lucide-react'
import PageShell, { Card, inputStyle, labelStyle, btnPrimary } from '../PageShell'

import { API } from '../../../config'

function authHeader(contentType = 'application/json') {
  return {
    'Content-Type': contentType,
    Authorization: `Bearer ${localStorage.getItem('koinonia_token') ?? ''}`,
  }
}

type TipoUsuario = 'ADMIN' | 'MEMBRO' | 'LIDER' | 'CO_LIDER' | 'PASTOR' | 'TESOUREIRO' | 'CONTADOR'

interface UsuarioForm {
  nome: string
  sobrenome: string
  email: string
  tipo: TipoUsuario
  ativo: boolean
  dataAniversario: string
  genero: string
  estadoCivil: string
  logradouro: string
  bairro: string
  cidade: string
}

const TIPOS: { value: TipoUsuario; label: string }[] = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'MEMBRO', label: 'Membro' },
  { value: 'LIDER', label: 'Líder' },
  { value: 'CO_LIDER', label: 'Co-Líder' },
  { value: 'PASTOR', label: 'Pastor' },
  { value: 'TESOUREIRO', label: 'Tesoureiro' },
  { value: 'CONTADOR', label: 'Contador' },
]

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

const EMPTY: UsuarioForm = {
  nome: '', sobrenome: '', email: '', tipo: 'MEMBRO', ativo: true,
  dataAniversario: '', genero: '', estadoCivil: '',
  logradouro: '', bairro: '', cidade: '',
}

export default function EditarUsuario() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [form, setForm] = useState<UsuarioForm>(EMPTY)
  const [loadingFetch, setLoadingFetch] = useState(true)
  const [loading, setLoading] = useState(false)
  const [fb, setFb] = useState<Feedback | null>(null)

  useEffect(() => {
    if (!id) return
    fetch(`${API}/usuarios/${id}`, { headers: authHeader() })
      .then(r => r.json())
      .then(data => {
        setForm({
          nome: data.nome ?? '',
          sobrenome: data.sobrenome ?? '',
          email: data.email ?? '',
          tipo: data.tipo ?? 'MEMBRO',
          ativo: data.ativo ?? true,
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
      .catch(() => setFb({ type: 'err', msg: 'Erro ao carregar dados do usuário' }))
      .finally(() => setLoadingFetch(false))
  }, [id])

  const set = (k: keyof UsuarioForm, v: string | boolean) =>
    setForm(f => ({ ...f, [k]: v }))

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    setFb(null)
    setLoading(true)
    try {
      const body: Record<string, unknown> = {
        nome: form.nome || undefined,
        sobrenome: form.sobrenome || undefined,
        email: form.email || undefined,
        tipo: form.tipo || undefined,
        ativo: form.ativo,
        dataAniversario: form.dataAniversario || undefined,
        genero: form.genero || undefined,
        estadoCivil: form.estadoCivil || undefined,
        logradouro: form.logradouro || undefined,
        bairro: form.bairro || undefined,
        cidade: form.cidade || undefined,
      }
      Object.keys(body).forEach(k => body[k] === undefined && delete body[k])

      const res = await fetch(`${API}/usuarios/${id}`, {
        method: 'PUT',
        headers: authHeader(),
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erro ao salvar')

      setFb({ type: 'ok', msg: 'Usuário atualizado com sucesso!' })
      setTimeout(() => navigate('/dashboard/usuarios'), 1400)
    } catch (err: any) {
      setFb({ type: 'err', msg: err.message })
    } finally {
      setLoading(false)
    }
  }

  if (loadingFetch) {
    return (
      <PageShell title="Editar Usuário">
        <p style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'Inter, sans-serif', fontSize: '14px' }}>
          Carregando...
        </p>
      </PageShell>
    )
  }

  return (
    <PageShell title="Editar Usuário" subtitle={`${form.nome} ${form.sobrenome}`}>
      <div style={{ maxWidth: '640px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Voltar */}
        <button
          onClick={() => navigate('/dashboard/usuarios')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,0.45)', fontFamily: 'Inter, sans-serif',
            fontSize: '13px', padding: 0, marginBottom: '4px',
          }}
        >
          <ArrowLeft size={14} />
          Voltar para Usuários
        </button>

        <form onSubmit={salvar} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Perfil */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <User size={16} color="#d3b86a" />
              <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '15px', fontWeight: 700, color: '#fff' }}>
                Dados Pessoais
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={labelStyle}>NOME</label>
                  <input style={inputStyle} value={form.nome} onChange={e => set('nome', e.target.value)} required />
                </div>
                <div>
                  <label style={labelStyle}>SOBRENOME</label>
                  <input style={inputStyle} value={form.sobrenome} onChange={e => set('sobrenome', e.target.value)} required />
                </div>
              </div>

              <div>
                <label style={labelStyle}>E-MAIL</label>
                <input style={inputStyle} type="email" value={form.email} onChange={e => set('email', e.target.value)} required />
              </div>

              <div>
                <label style={labelStyle}>DATA DE ANIVERSÁRIO</label>
                <input style={inputStyle} type="date" value={form.dataAniversario} onChange={e => set('dataAniversario', e.target.value)} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={labelStyle}>GÊNERO</label>
                  <select style={selectStyle} value={form.genero} onChange={e => set('genero', e.target.value)}>
                    <option value="" style={{ background: '#08091a' }}>Não informado</option>
                    <option value="MASCULINO" style={{ background: '#08091a' }}>Masculino</option>
                    <option value="FEMININO" style={{ background: '#08091a' }}>Feminino</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>ESTADO CIVIL</label>
                  <select style={selectStyle} value={form.estadoCivil} onChange={e => set('estadoCivil', e.target.value)}>
                    <option value="" style={{ background: '#08091a' }}>Não informado</option>
                    <option value="SOLTEIRO" style={{ background: '#08091a' }}>Solteiro(a)</option>
                    <option value="CASADO" style={{ background: '#08091a' }}>Casado(a)</option>
                    <option value="DIVORCIADO" style={{ background: '#08091a' }}>Divorciado(a)</option>
                    <option value="VIUVO" style={{ background: '#08091a' }}>Viúvo(a)</option>
                    <option value="UNIAO_ESTAVEL" style={{ background: '#08091a' }}>União Estável</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>

          {/* Endereço */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <MapPin size={16} color="#d3b86a" />
              <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '15px', fontWeight: 700, color: '#fff' }}>
                Endereço
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>LOGRADOURO</label>
                <input style={inputStyle} value={form.logradouro} onChange={e => set('logradouro', e.target.value)} placeholder="Rua, Av., número..." />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={labelStyle}>BAIRRO</label>
                  <input style={inputStyle} value={form.bairro} onChange={e => set('bairro', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>CIDADE</label>
                  <input style={inputStyle} value={form.cidade} onChange={e => set('cidade', e.target.value)} />
                </div>
              </div>
            </div>
          </Card>

          {/* Tipo e status — seção administrativa */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Shield size={16} color="#d3b86a" />
              <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '15px', fontWeight: 700, color: '#fff' }}>
                Papel & Acesso
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>TIPO DE USUÁRIO</label>
                <select
                  style={selectStyle}
                  value={form.tipo}
                  onChange={e => set('tipo', e.target.value)}
                >
                  {TIPOS.map(t => (
                    <option key={t.value} value={t.value} style={{ background: '#08091a' }}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px', fontFamily: 'Inter, sans-serif', marginTop: '6px' }}>
                  Define o papel deste usuário no sistema. Novos usuários são criados como Membro.
                </p>
              </div>

              <div>
                <label style={labelStyle}>STATUS DA CONTA</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {[true, false].map(v => (
                    <button
                      key={String(v)}
                      type="button"
                      onClick={() => set('ativo', v)}
                      style={{
                        flex: 1, padding: '11px', borderRadius: '12px', fontSize: '13px',
                        fontFamily: 'Inter, sans-serif', fontWeight: 600, cursor: 'pointer',
                        transition: 'all 0.15s',
                        background: form.ativo === v
                          ? v ? 'rgba(52,211,153,0.12)' : 'rgba(255,107,107,0.12)'
                          : 'rgba(255,255,255,0.04)',
                        border: form.ativo === v
                          ? v ? '1px solid rgba(52,211,153,0.3)' : '1px solid rgba(255,107,107,0.3)'
                          : '1px solid rgba(255,255,255,0.08)',
                        color: form.ativo === v
                          ? v ? '#34d399' : '#ff6b6b'
                          : 'rgba(255,255,255,0.35)',
                      }}
                    >
                      {v ? 'Ativo' : 'Inativo'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <FeedbackMsg fb={fb} />

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.97 } : {}}
            style={{ ...btnPrimary, opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </motion.button>
        </form>
      </div>
    </PageShell>
  )
}
