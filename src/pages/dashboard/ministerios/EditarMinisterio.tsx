import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Edit2, Trash2, Plus, Check, AlertTriangle, CheckCircle, X } from 'lucide-react'
import PageShell, { Card, inputStyle, labelStyle } from '../PageShell'
import { usePermissao } from '../../../hooks/usePermissao'

import { API } from '../../../config'

function authHeader(ct?: string) {
  const h: Record<string, string> = { Authorization: `Bearer ${localStorage.getItem('koinonia_token') ?? ''}` }
  if (ct) h['Content-Type'] = ct
  return h
}

interface CoLiderEntry { usuario: { id: string; nome: string; sobrenome: string } }
interface Usuario { id: string; nome: string; sobrenome: string }
interface Ministerio {
  id: string; nome: string; descricao: string | null
  lider: { id: string; nome: string; sobrenome: string } | null
  coLideres: CoLiderEntry[]
}

const selectStyle = { ...inputStyle, appearance: 'none' as const }

export default function EditarMinisterio() {
  const navigate = useNavigate()
  const { podeGerenciar } = usePermissao()
  const [ministerios, setMinisterios] = useState<Ministerio[]>([])
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [editando, setEditando] = useState<Ministerio | null>(null)
  const [formNome, setFormNome] = useState('')
  const [formDescricao, setFormDescricao] = useState('')
  const [formLiderId, setFormLiderId] = useState('')
  const [formCoLideresIds, setFormCoLideresIds] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [deletando, setDeletando] = useState<Ministerio | null>(null)
  const [toast, setToast] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null)

  const showToast = useCallback((type: 'ok' | 'err', msg: string) => {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 3500)
  }, [])

  const carregar = useCallback(async () => {
    const [ms, us] = await Promise.all([
      fetch(`${API}/ministerios`, { headers: authHeader() }).then(r => r.json()),
      fetch(`${API}/usuarios`, { headers: authHeader() }).then(r => r.json()),
    ])
    setMinisterios(Array.isArray(ms) ? ms : [])
    setUsuarios(Array.isArray(us) ? us : [])
  }, [])

  useEffect(() => { carregar() }, [carregar])

  function abrirEdicao(m: Ministerio) {
    setEditando(m)
    setFormNome(m.nome)
    setFormDescricao(m.descricao ?? '')
    setFormLiderId(m.lider?.id ?? '')
    setFormCoLideresIds(m.coLideres.map(c => c.usuario.id))
  }

  function toggleCoLider(id: string) {
    setFormCoLideresIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  async function salvar() {
    if (!editando) return
    setLoading(true)
    try {
      const res = await fetch(`${API}/ministerios/${editando.id}`, {
        method: 'PUT',
        headers: authHeader('application/json'),
        body: JSON.stringify({
          nome: formNome,
          descricao: formDescricao || undefined,
          liderId: formLiderId || undefined,
          coLideresIds: formCoLideresIds,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erro ao salvar')
      await carregar()
      setEditando(null)
      showToast('ok', 'Ministério atualizado!')
    } catch (err: any) {
      showToast('err', err.message)
    } finally {
      setLoading(false)
    }
  }

  async function confirmarDelete() {
    if (!deletando) return
    try {
      const res = await fetch(`${API}/ministerios/${deletando.id}`, {
        method: 'DELETE', headers: authHeader(),
      })
      if (!res.ok) throw new Error()
      setMinisterios(prev => prev.filter(m => m.id !== deletando.id))
      showToast('ok', 'Ministério excluído!')
    } catch {
      showToast('err', 'Erro ao excluir ministério')
    } finally {
      setDeletando(null)
    }
  }

  const nomeUsuario = (id: string) => {
    const u = usuarios.find(u => u.id === id)
    return u ? `${u.nome} ${u.sobrenome}` : id
  }

  return (
    <PageShell title="Ministérios" subtitle={`${ministerios.length} ministério${ministerios.length !== 1 ? 's' : ''} cadastrado${ministerios.length !== 1 ? 's' : ''}`}>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            style={{
              position: 'fixed', top: '24px', right: '24px', zIndex: 900,
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '12px 18px', borderRadius: '12px', fontSize: '13px',
              fontFamily: 'Inter, sans-serif',
              color: toast.type === 'ok' ? '#34d399' : '#ff6b6b',
              background: toast.type === 'ok' ? 'rgba(52,211,153,0.1)' : 'rgba(255,107,107,0.1)',
              border: `1px solid ${toast.type === 'ok' ? 'rgba(52,211,153,0.25)' : 'rgba(255,107,107,0.25)'}`,
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)',
            }}
          >
            {toast.type === 'ok' ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de edição */}
      <AnimatePresence>
        {editando && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setEditando(null)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(4px)', zIndex: 1000,
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
            }}
          >
            <motion.div
              initial={{ scale: 0.92, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 16 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: '#0d0f1e', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '480px',
                maxHeight: '90vh', overflowY: 'auto',
              }}
            >
              <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '16px', color: '#fff', marginBottom: '20px' }}>
                Editar Ministério
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={labelStyle}>NOME *</label>
                  <input style={inputStyle} value={formNome} onChange={e => setFormNome(e.target.value)} required />
                </div>
                <div>
                  <label style={labelStyle}>DESCRIÇÃO</label>
                  <textarea style={{ ...inputStyle, minHeight: '70px', resize: 'vertical' }} value={formDescricao} onChange={e => setFormDescricao(e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>LÍDER</label>
                  <select style={selectStyle} value={formLiderId} onChange={e => setFormLiderId(e.target.value)}>
                    <option value="" style={{ background: '#08091a' }}>Nenhum</option>
                    {usuarios.map(u => <option key={u.id} value={u.id} style={{ background: '#08091a' }}>{u.nome} {u.sobrenome}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>CO-LÍDERES</label>
                  {formCoLideresIds.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                      {formCoLideresIds.map(id => (
                        <span key={id} style={{
                          display: 'flex', alignItems: 'center', gap: '5px',
                          padding: '4px 10px', borderRadius: '20px', fontSize: '12px',
                          fontFamily: 'Inter, sans-serif', fontWeight: 600,
                          background: 'rgba(211,184,106,0.12)', color: '#d3b86a',
                          border: '1px solid rgba(211,184,106,0.3)',
                        }}>
                          {nomeUsuario(id)}
                          <button type="button" onClick={() => toggleCoLider(id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d3b86a', display: 'flex', padding: 0 }}>
                            <X size={11} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <div style={{
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px',
                    maxHeight: '140px', overflowY: 'auto', background: 'rgba(255,255,255,0.02)',
                  }}>
                    {usuarios.map((u, i) => {
                      const selected = formCoLideresIds.includes(u.id)
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
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button onClick={() => setEditando(null)} style={{
                  padding: '9px 18px', borderRadius: '10px', fontSize: '13px',
                  fontFamily: 'Inter, sans-serif', fontWeight: 600,
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
                }}>
                  Cancelar
                </button>
                <button onClick={salvar} disabled={loading} style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  padding: '9px 18px', borderRadius: '10px', fontSize: '13px',
                  fontFamily: 'Inter, sans-serif', fontWeight: 600,
                  background: 'linear-gradient(135deg, #d3b86a, #a8903a)',
                  border: 'none', color: '#000', cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                }}>
                  <Check size={13} /> {loading ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm delete */}
      <AnimatePresence>
        {deletando && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setDeletando(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          >
            <motion.div
              initial={{ scale: 0.92, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 16 }}
              onClick={e => e.stopPropagation()}
              style={{ background: '#0d0f1e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '380px' }}
            >
              <div style={{ display: 'flex', gap: '14px', marginBottom: '20px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,107,107,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <AlertTriangle size={18} color="#ff6b6b" />
                </div>
                <div>
                  <h4 style={{ fontFamily: 'Cinzel, serif', fontSize: '15px', color: '#fff', marginBottom: '6px' }}>Excluir ministério</h4>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
                    Tem certeza que deseja excluir <strong style={{ color: '#fff' }}>{deletando.nome}</strong>?
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button onClick={() => setDeletando(null)} style={{ padding: '9px 18px', borderRadius: '10px', fontSize: '13px', fontFamily: 'Inter, sans-serif', fontWeight: 600, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>Cancelar</button>
                <button onClick={confirmarDelete} style={{ padding: '9px 18px', borderRadius: '10px', fontSize: '13px', fontFamily: 'Inter, sans-serif', fontWeight: 600, background: 'rgba(255,107,107,0.15)', border: '1px solid rgba(255,107,107,0.3)', color: '#ff6b6b', cursor: 'pointer' }}>Excluir</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toolbar */}
      {podeGerenciar && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/dashboard/ministerios/criar')}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '11px 18px', borderRadius: '12px', fontSize: '13px',
              fontFamily: 'Inter, sans-serif', fontWeight: 600,
              background: 'linear-gradient(135deg, #d3b86a, #a8903a)',
              border: 'none', color: '#000', cursor: 'pointer',
            }}
          >
            <Plus size={14} /> Novo Ministério
          </motion.button>
        </div>
      )}

      {/* Lista */}
      {ministerios.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.2)', fontFamily: 'Inter, sans-serif' }}>
          <Users size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
          <p style={{ fontSize: '14px' }}>Nenhum ministério cadastrado.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '640px' }}>
          {ministerios.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flexWrap: 'wrap' }}>
                  <div style={{
                    width: '42px', height: '42px', borderRadius: '10px', flexShrink: 0,
                    background: 'rgba(144,192,128,0.1)', border: '1px solid rgba(144,192,128,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Users size={18} color="#90c080" />
                  </div>
                  <div style={{ flex: 1, minWidth: '140px' }}>
                    <p style={{ color: '#fff', fontSize: '14px', fontWeight: 600, fontFamily: 'Inter, sans-serif', marginBottom: '3px' }}>{m.nome}</p>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>
                      {m.lider ? `Líder: ${m.lider.nome} ${m.lider.sobrenome}` : 'Sem líder'}
                    </p>
                    {m.coLideres.length > 0 && (
                      <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '12px', fontFamily: 'Inter, sans-serif', marginTop: '2px' }}>
                        Co-líderes: {m.coLideres.map(c => `${c.usuario.nome} ${c.usuario.sobrenome}`).join(', ')}
                      </p>
                    )}
                    {m.descricao && (
                      <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '11px', fontFamily: 'Inter, sans-serif', marginTop: '3px' }}>
                        {m.descricao}
                      </p>
                    )}
                  </div>
                  {podeGerenciar && (
                    <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                      <motion.button
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={() => abrirEdicao(m)}
                        style={{ width: '34px', height: '34px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)', color: '#60a5fa', cursor: 'pointer' }}
                      >
                        <Edit2 size={14} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={() => setDeletando(m)}
                        style={{ width: '34px', height: '34px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.15)', color: '#ff6b6b', cursor: 'pointer' }}
                      >
                        <Trash2 size={14} />
                      </motion.button>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </PageShell>
  )
}
