import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, AlertCircle, X } from 'lucide-react'
import PageShell, { Card, inputStyle, labelStyle, btnPrimary } from '../PageShell'

import { API } from '../../../config'

function authHeader(ct = 'application/json') {
  return { 'Content-Type': ct, Authorization: `Bearer ${localStorage.getItem('koinonia_token') ?? ''}` }
}

interface Usuario { id: string; nome: string; sobrenome: string }
type Feedback = { type: 'ok' | 'err'; msg: string }

const selectStyle = { ...inputStyle, appearance: 'none' as const }

export default function CriarMinisterio() {
  const navigate = useNavigate()
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [liderId, setLiderId] = useState('')
  const [coLideresIds, setCoLideresIds] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [fb, setFb] = useState<Feedback | null>(null)

  useEffect(() => {
    fetch(`${API}/usuarios`, { headers: { Authorization: `Bearer ${localStorage.getItem('koinonia_token') ?? ''}` } })
      .then(r => r.json()).then(setUsuarios).catch(() => {})
  }, [])

  function toggleCoLider(id: string) {
    setCoLideresIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFb(null)
    setLoading(true)
    try {
      const res = await fetch(`${API}/ministerios`, {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({
          nome,
          descricao: descricao || undefined,
          liderId: liderId || undefined,
          coLideresIds: coLideresIds.length ? coLideresIds : undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erro ao criar ministério')
      setFb({ type: 'ok', msg: 'Ministério criado com sucesso!' })
      setTimeout(() => navigate('/dashboard/ministerios/editar'), 1400)
    } catch (err: any) {
      setFb({ type: 'err', msg: err.message })
    } finally {
      setLoading(false)
    }
  }

  const nomeCoLider = (id: string) => {
    const u = usuarios.find(u => u.id === id)
    return u ? `${u.nome} ${u.sobrenome}` : id
  }

  return (
    <PageShell title="Criar Ministério" subtitle="Cadastre um novo ministério da Igreja">
      <form onSubmit={handleSubmit} style={{ maxWidth: '580px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}>NOME DO MINISTÉRIO *</label>
              <input style={inputStyle} value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: Ministério de Louvor" required />
            </div>
            <div>
              <label style={labelStyle}>DESCRIÇÃO</label>
              <textarea
                style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                value={descricao}
                onChange={e => setDescricao(e.target.value)}
                placeholder="Descreva o propósito do ministério..."
              />
            </div>
            <div>
              <label style={labelStyle}>LÍDER</label>
              <select style={selectStyle} value={liderId} onChange={e => setLiderId(e.target.value)}>
                <option value="" style={{ background: '#08091a' }}>Nenhum</option>
                {usuarios.map(u => (
                  <option key={u.id} value={u.id} style={{ background: '#08091a' }}>{u.nome} {u.sobrenome}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>CO-LÍDERES</label>
              {coLideresIds.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                  {coLideresIds.map(id => (
                    <span key={id} style={{
                      display: 'flex', alignItems: 'center', gap: '5px',
                      padding: '4px 10px', borderRadius: '20px', fontSize: '12px',
                      fontFamily: 'Inter, sans-serif', fontWeight: 600,
                      background: 'rgba(211,184,106,0.12)', color: '#d3b86a',
                      border: '1px solid rgba(211,184,106,0.3)',
                    }}>
                      {nomeCoLider(id)}
                      <button type="button" onClick={() => toggleCoLider(id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d3b86a', display: 'flex', padding: 0 }}>
                        <X size={11} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <div style={{
                border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px',
                maxHeight: '160px', overflowY: 'auto', background: 'rgba(255,255,255,0.02)',
              }}>
                {usuarios.map((u, i) => {
                  const selected = coLideresIds.includes(u.id)
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => toggleCoLider(u.id)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        width: '100%', padding: '9px 12px', background: 'none', border: 'none',
                        borderBottom: i < usuarios.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                        cursor: 'pointer', textAlign: 'left',
                        color: selected ? '#d3b86a' : 'rgba(255,255,255,0.6)',
                        fontFamily: 'Inter, sans-serif', fontSize: '13px',
                        transition: 'background 0.15s',
                      }}
                    >
                      {u.nome} {u.sobrenome}
                      {selected && <Check size={13} color="#d3b86a" />}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </Card>

        {fb && (
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
        )}

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={!loading ? { scale: 1.02 } : {}}
          whileTap={!loading ? { scale: 0.97 } : {}}
          style={{ ...btnPrimary, opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Salvando...' : 'Criar Ministério'}
        </motion.button>
      </form>
    </PageShell>
  )
}
