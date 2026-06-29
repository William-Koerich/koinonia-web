import { useState } from 'react'
import { motion } from 'framer-motion'
import PageShell, { Card, inputStyle, labelStyle, btnPrimary } from '../PageShell'
import { Plus, X } from 'lucide-react'

const funcoes = ['Louvor', 'Instrumentista', 'Som', 'Projeção', 'Recepção', 'Transmissão', 'Oração', 'Palavra', 'Dança', 'Teatro']

export default function CriarEscala() {
  const [form, setForm] = useState({ data: '', servico: 'Culto Domingo', funcao: '', membro: '' })
  const [membros, setMembros] = useState<{ nome: string; funcao: string }[]>([])
  const [saved, setSaved] = useState(false)

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const addMembro = () => {
    if (!form.membro.trim() || !form.funcao) return
    setMembros(m => [...m, { nome: form.membro.trim(), funcao: form.funcao }])
    setForm(f => ({ ...f, membro: '' }))
  }

  const removeMembro = (i: number) => setMembros(m => m.filter((_, idx) => idx !== i))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <PageShell title="Criar Escala" subtitle="Monte a escala de serviço para um culto ou evento">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '640px' }}>
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={labelStyle}>DATA</label>
                <input style={inputStyle} type="date" value={form.data} onChange={e => set('data', e.target.value)} required />
              </div>
              <div>
                <label style={labelStyle}>SERVIÇO</label>
                <select style={{ ...inputStyle, appearance: 'none' }} value={form.servico} onChange={e => set('servico', e.target.value)}>
                  {['Culto Domingo', 'Culto Sábado Jovens', 'Vigília', 'Discipulado', 'Evento Especial'].map(s => (
                    <option key={s} value={s} style={{ background: '#08091a' }}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <label style={{ ...labelStyle, marginBottom: '14px' }}>MEMBROS DA ESCALA</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '10px', marginBottom: '16px', alignItems: 'end' }}>
            <div>
              <label style={labelStyle}>NOME DO MEMBRO</label>
              <input style={inputStyle} value={form.membro} onChange={e => set('membro', e.target.value)} placeholder="Nome completo" />
            </div>
            <div>
              <label style={labelStyle}>FUNÇÃO</label>
              <select style={{ ...inputStyle, appearance: 'none' }} value={form.funcao} onChange={e => set('funcao', e.target.value)}>
                <option value="" style={{ background: '#08091a' }}>Selecione...</option>
                {funcoes.map(f => <option key={f} value={f} style={{ background: '#08091a' }}>{f}</option>)}
              </select>
            </div>
            <motion.button
              type="button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={addMembro}
              style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: 'rgba(211,184,106,0.12)', border: '1px solid rgba(211,184,106,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#d3b86a', flexShrink: 0,
              }}
            >
              <Plus size={18} />
            </motion.button>
          </div>

          {membros.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '13px', fontFamily: 'Inter, sans-serif', textAlign: 'center', padding: '16px 0' }}>
              Nenhum membro adicionado ainda
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {membros.map((m, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 14px', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <span style={{ flex: 1, color: '#fff', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}>{m.nome}</span>
                  <span style={{
                    padding: '2px 10px', borderRadius: '50px', fontSize: '11px',
                    color: '#d3b86a', background: 'rgba(211,184,106,0.1)',
                    border: '1px solid rgba(211,184,106,0.2)', fontFamily: 'Inter, sans-serif',
                  }}>
                    {m.funcao}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeMembro(i)}
                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <motion.button type="submit" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={btnPrimary}>
            Salvar Escala
          </motion.button>
          {saved && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ color: '#7de8a0', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}>
              ✓ Escala salva!
            </motion.span>
          )}
        </div>
      </form>
    </PageShell>
  )
}
