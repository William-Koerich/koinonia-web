import { useState } from 'react'
import { motion } from 'framer-motion'
import PageShell, { Card, inputStyle, labelStyle, btnPrimary } from '../PageShell'

export default function CriarEvento() {
  const [form, setForm] = useState({ titulo: '', data: '', hora: '', local: '', tipo: 'CULTO', descricao: '' })
  const [saved, setSaved] = useState(false)

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <PageShell title="Criar Evento" subtitle="Preencha os dados do novo evento">
      <Card style={{ maxWidth: '640px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

          <div>
            <label style={labelStyle}>TÍTULO DO EVENTO</label>
            <input style={inputStyle} value={form.titulo} onChange={e => set('titulo', e.target.value)} placeholder="Ex: Culto de Celebração" required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={labelStyle}>DATA</label>
              <input style={inputStyle} type="date" value={form.data} onChange={e => set('data', e.target.value)} required />
            </div>
            <div>
              <label style={labelStyle}>HORA</label>
              <input style={inputStyle} type="time" value={form.hora} onChange={e => set('hora', e.target.value)} required />
            </div>
          </div>

          <div>
            <label style={labelStyle}>LOCAL</label>
            <input style={inputStyle} value={form.local} onChange={e => set('local', e.target.value)} placeholder="Ex: Templo Principal" required />
          </div>

          <div>
            <label style={labelStyle}>TIPO</label>
            <select
              style={{ ...inputStyle, appearance: 'none' }}
              value={form.tipo}
              onChange={e => set('tipo', e.target.value)}
            >
              {['CULTO', 'JOVENS', 'FAMÍLIA', 'ESPECIAL', 'VIGÍLIA', 'DISCIPULADO'].map(t => (
                <option key={t} value={t} style={{ background: '#08091a' }}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>DESCRIÇÃO</label>
            <textarea
              style={{ ...inputStyle, minHeight: '90px', resize: 'vertical' }}
              value={form.descricao}
              onChange={e => set('descricao', e.target.value)}
              placeholder="Descreva o evento..."
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={btnPrimary}
            >
              Salvar Evento
            </motion.button>
            {saved && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                style={{ color: '#7de8a0', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}
              >
                ✓ Evento salvo!
              </motion.span>
            )}
          </div>
        </form>
      </Card>
    </PageShell>
  )
}
