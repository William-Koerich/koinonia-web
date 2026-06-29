import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Camera, Check, AlertCircle, Loader } from 'lucide-react'
import PageShell, { Card, inputStyle, labelStyle, btnPrimary } from '../PageShell'

import { API } from '../../../config'

function authHeader() {
  return { Authorization: `Bearer ${localStorage.getItem('koinonia_token') ?? ''}` }
}

type Ministerio = { id: string; nome: string }
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

export default function CriarEvento() {
  const navigate = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)

  const [ministerios, setMinisterios] = useState<Ministerio[]>([])
  const [fotoFile, setFotoFile] = useState<File | null>(null)
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [fb, setFb] = useState<Feedback | null>(null)

  const [form, setForm] = useState({
    nome: '', descricao: '', data: '', hora: '',
    localizacao: '', valor: '', ministerioId: '',
  })
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  useEffect(() => {
    fetch(`${API}/ministerios`, { headers: authHeader() })
      .then(r => r.json())
      .then(setMinisterios)
      .catch(() => {})
  }, [])

  function handleFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setFotoFile(file)
    const reader = new FileReader()
    reader.onload = ev => setFotoPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFb(null)
    setLoading(true)
    try {
      const dataHora = new Date(`${form.data}T${form.hora || '00:00'}`)
      if (isNaN(dataHora.getTime())) throw new Error('Data/hora inválida')

      const fd = new FormData()
      fd.append('nome', form.nome)
      fd.append('descricao', form.descricao)
      fd.append('dataHora', dataHora.toISOString())
      if (form.localizacao) fd.append('localizacao', form.localizacao)
      if (form.valor) fd.append('valor', form.valor)
      if (form.ministerioId) fd.append('ministerioId', form.ministerioId)
      if (fotoFile) fd.append('foto', fotoFile)

      const res = await fetch(`${API}/eventos`, {
        method: 'POST',
        headers: authHeader(),
        body: fd,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erro ao criar evento')

      setFb({ type: 'ok', msg: 'Evento criado com sucesso!' })
      setTimeout(() => navigate('/dashboard/eventos/editar'), 1400)
    } catch (err: any) {
      setFb({ type: 'err', msg: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageShell title="Criar Evento" subtitle="Preencha os dados do novo evento">
      <form onSubmit={handleSubmit} style={{ maxWidth: '680px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Foto */}
        <Card>
          <label style={labelStyle}>FOTO DO EVENTO</label>
          <div
            onClick={() => fileRef.current?.click()}
            style={{
              width: '100%', height: '180px', borderRadius: '14px', cursor: 'pointer',
              border: '2px dashed rgba(211,184,106,0.2)', overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: fotoPreview ? 'transparent' : 'rgba(255,255,255,0.02)',
              position: 'relative',
            }}
          >
            {fotoPreview ? (
              <img src={fotoPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.25)' }}>
                <Camera size={28} style={{ margin: '0 auto 8px' }} />
                <p style={{ fontSize: '13px', fontFamily: 'Inter, sans-serif' }}>Clique para adicionar foto</p>
                <p style={{ fontSize: '11px', marginTop: '4px' }}>JPG, PNG, WEBP · máx. 5MB</p>
              </div>
            )}
            {fotoPreview && (
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                style={{
                  position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: '13px', fontFamily: 'Inter, sans-serif', gap: '6px',
                }}
              >
                <Camera size={16} /> Trocar foto
              </motion.div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFoto} />
        </Card>

        {/* Dados principais */}
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}>NOME DO EVENTO *</label>
              <input style={inputStyle} value={form.nome} onChange={e => set('nome', e.target.value)} required placeholder="Ex: Culto de Celebração" />
            </div>

            <div>
              <label style={labelStyle}>DESCRIÇÃO *</label>
              <textarea
                style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                value={form.descricao}
                onChange={e => set('descricao', e.target.value)}
                required
                placeholder="Descreva o evento..."
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={labelStyle}>DATA *</label>
                <input style={inputStyle} type="date" value={form.data} onChange={e => set('data', e.target.value)} required />
              </div>
              <div>
                <label style={labelStyle}>HORA</label>
                <input style={inputStyle} type="time" value={form.hora} onChange={e => set('hora', e.target.value)} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>LOCALIZAÇÃO</label>
              <input style={inputStyle} value={form.localizacao} onChange={e => set('localizacao', e.target.value)} placeholder="Ex: Templo Principal, Salão Jovem..." />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={labelStyle}>VALOR (R$)</label>
                <input
                  style={inputStyle}
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.valor}
                  onChange={e => set('valor', e.target.value)}
                  placeholder="0,00 = gratuito"
                />
                <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px', fontFamily: 'Inter, sans-serif', marginTop: '5px' }}>
                  Deixe em branco ou 0 para evento gratuito
                </p>
              </div>
              <div>
                <label style={labelStyle}>MINISTÉRIO RESPONSÁVEL</label>
                <select style={selectStyle} value={form.ministerioId} onChange={e => set('ministerioId', e.target.value)}>
                  <option value="" style={{ background: '#08091a' }}>Nenhum</option>
                  {ministerios.map(m => (
                    <option key={m.id} value={m.id} style={{ background: '#08091a' }}>{m.nome}</option>
                  ))}
                </select>
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
          style={{
            ...btnPrimary,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading && (
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}>
              <Loader size={15} />
            </motion.div>
          )}
          {loading ? 'Criando evento...' : 'Criar Evento'}
        </motion.button>
      </form>
    </PageShell>
  )
}
