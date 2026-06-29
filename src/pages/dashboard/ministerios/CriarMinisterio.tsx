import { useState } from 'react'
import { motion } from 'framer-motion'
import PageShell, { Card, inputStyle, labelStyle, btnPrimary } from '../PageShell'

export default function CriarMinisterio() {
  const [form, setForm] = useState({ nome: '', lider: '', descricao: '', diaSemana: '', horario: '' })
  const [saved, setSaved] = useState(false)
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <PageShell title="Criar Ministério" subtitle="Cadastre um novo ministério da Igreja">
      <Card style={{ maxWidth: '580px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <div>
            <label style={labelStyle}>NOME DO MINISTÉRIO</label>
            <input style={inputStyle} value={form.nome} onChange={e => set('nome', e.target.value)} placeholder="Ex: Ministério de Louvor" required />
          </div>

          <div>
            <label style={labelStyle}>LÍDER RESPONSÁVEL</label>
            <input style={inputStyle} value={form.lider} onChange={e => set('lider', e.target.value)} placeholder="Nome do líder" required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={labelStyle}>DIA DE REUNIÃO</label>
              <select style={{ ...inputStyle, appearance: 'none' }} value={form.diaSemana} onChange={e => set('diaSemana', e.target.value)}>
                <option value="" style={{ background: '#08091a' }}>Selecione...</option>
                {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map(d => (
                  <option key={d} value={d} style={{ background: '#08091a' }}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>HORÁRIO</label>
              <input style={inputStyle} type="time" value={form.horario} onChange={e => set('horario', e.target.value)} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>DESCRIÇÃO</label>
            <textarea
              style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
              value={form.descricao}
              onChange={e => set('descricao', e.target.value)}
              placeholder="Descreva o propósito do ministério..."
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <motion.button type="submit" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={btnPrimary}>
              Salvar Ministério
            </motion.button>
            {saved && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ color: '#7de8a0', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}>
                ✓ Ministério salvo!
              </motion.span>
            )}
          </div>
        </form>
      </Card>
    </PageShell>
  )
}
