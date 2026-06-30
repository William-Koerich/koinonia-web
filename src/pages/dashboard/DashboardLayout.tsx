import { useState } from 'react'
import { Outlet, useNavigate, useLocation, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar, ChevronDown, Users, LayoutGrid,
  LogOut, Menu, X, Home, UserCircle, UsersRound,
} from 'lucide-react'
import logo3 from '../../assets/logo-3.png'

const SIDEBAR_W = 260

const menu = [
  {
    id: 'eventos',
    label: 'Eventos',
    icon: Calendar,
    children: [
      { label: 'Ver Eventos', path: '/dashboard/eventos' },
      { label: 'Criar', path: '/dashboard/eventos/criar' },
      { label: 'Gerenciar', path: '/dashboard/eventos/editar' },
      { label: 'Gerenciar Inscrições', path: '/dashboard/eventos/inscricoes' },
      { label: 'Meus Eventos', path: '/dashboard/eventos/meus-eventos' },
    ],
  },
  {
    id: 'escala',
    label: 'Escala',
    icon: LayoutGrid,
    children: [
      { label: 'Criar', path: '/dashboard/escala/criar' },
      { label: 'Editar', path: '/dashboard/escala/editar' },
      { label: 'Minhas Escalas', path: '/dashboard/escala/minhas-escalas' },
    ],
  },
  {
    id: 'ministerios',
    label: 'Ministérios',
    icon: Users,
    children: [
      { label: 'Criar', path: '/dashboard/ministerios/criar' },
      { label: 'Editar', path: '/dashboard/ministerios/editar' },
    ],
  },
]

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState<string | null>(() => {
    const active = menu.find(m => location.pathname.startsWith(`/dashboard/${m.id}`))
    return active?.id ?? null
  })

  const usuario = (() => {
    try { return JSON.parse(localStorage.getItem('koinonia_usuario') ?? '{}') } catch { return {} }
  })()

  const logout = () => {
    localStorage.removeItem('koinonia_token')
    localStorage.removeItem('koinonia_usuario')
    navigate('/login')
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100%', overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{
        padding: '24px 20px 20px',
        borderBottom: '1px solid rgba(211,184,106,0.08)',
        display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        <div style={{
          background: '#fff', borderRadius: '8px',
          padding: '4px 6px', width: '36px', height: '32px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <img src={logo3} alt="Koinônia" style={{ height: '22px', width: 'auto' }} />
        </div>
        <span style={{
          fontFamily: 'Cinzel, serif', fontWeight: 700,
          fontSize: '15px', letterSpacing: '2px', color: '#fff',
        }}>
          KOINÔNIA
        </span>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              marginLeft: 'auto', background: 'none', border: 'none',
              color: 'rgba(255,255,255,0.4)', cursor: 'pointer',
              display: 'flex', alignItems: 'center',
            }}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* User info */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid rgba(211,184,106,0.06)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #d3b86a, #0a215b)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '13px', color: '#fff',
          }}>
            {usuario.nome?.[0] ?? 'U'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ color: '#fff', fontSize: '13px', fontWeight: 600, fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {usuario.nome} {usuario.sobrenome}
            </p>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {usuario.email}
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
        {/* Home */}
        <NavLink
          to="/dashboard"
          end
          onClick={onClose}
          style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 20px', textDecoration: 'none',
            color: isActive ? '#d3b86a' : 'rgba(255,255,255,0.6)',
            background: isActive ? 'rgba(211,184,106,0.06)' : 'none',
            borderRight: isActive ? '2px solid #d3b86a' : '2px solid transparent',
            fontSize: '14px', fontFamily: 'Inter, sans-serif', fontWeight: 500,
            transition: 'all 0.2s',
          })}
        >
          <Home size={16} />
          Início
        </NavLink>

        {/* Meu Perfil */}
        <NavLink
          to="/dashboard/perfil"
          onClick={onClose}
          style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 20px', textDecoration: 'none',
            color: isActive ? '#d3b86a' : 'rgba(255,255,255,0.6)',
            background: isActive ? 'rgba(211,184,106,0.06)' : 'none',
            borderRight: isActive ? '2px solid #d3b86a' : '2px solid transparent',
            fontSize: '14px', fontFamily: 'Inter, sans-serif', fontWeight: 500,
            transition: 'all 0.2s',
          })}
        >
          <UserCircle size={16} />
          Meu Perfil
        </NavLink>

        {/* Usuários */}
        <NavLink
          to="/dashboard/usuarios"
          onClick={onClose}
          style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 20px', textDecoration: 'none',
            color: isActive ? '#d3b86a' : 'rgba(255,255,255,0.6)',
            background: isActive ? 'rgba(211,184,106,0.06)' : 'none',
            borderRight: isActive ? '2px solid #d3b86a' : '2px solid transparent',
            fontSize: '14px', fontFamily: 'Inter, sans-serif', fontWeight: 500,
            transition: 'all 0.2s',
          })}
        >
          <UsersRound size={16} />
          Usuários
        </NavLink>

        <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '8px 0' }} />

        {/* Menu groups */}
        {menu.map(group => {
          const isGroupActive = location.pathname.startsWith(`/dashboard/${group.id}`)
          const isOpen = open === group.id
          return (
            <div key={group.id}>
              <button
                onClick={() => setOpen(isOpen ? null : group.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 20px',
                  background: isGroupActive ? 'rgba(211,184,106,0.06)' : 'none',
                  borderRight: isGroupActive ? '2px solid #d3b86a' : '2px solid transparent',
                  border: 'none', cursor: 'pointer',
                  color: isGroupActive ? '#d3b86a' : 'rgba(255,255,255,0.6)',
                  fontSize: '14px', fontFamily: 'Inter, sans-serif', fontWeight: 500,
                  textAlign: 'left', transition: 'all 0.2s',
                }}
              >
                <group.icon size={16} />
                <span style={{ flex: 1 }}>{group.label}</span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={14} />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    style={{ overflow: 'hidden' }}
                  >
                    {group.children.map(child => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        onClick={onClose}
                        style={({ isActive }) => ({
                          display: 'block',
                          padding: '8px 20px 8px 46px',
                          textDecoration: 'none',
                          color: isActive ? '#d3b86a' : 'rgba(255,255,255,0.45)',
                          fontSize: '13px', fontFamily: 'Inter, sans-serif',
                          background: isActive ? 'rgba(211,184,106,0.04)' : 'none',
                          borderRight: isActive ? '2px solid #d3b86a' : '2px solid transparent',
                          transition: 'all 0.15s',
                        })}
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(211,184,106,0.08)' }}>
        <button
          onClick={logout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 12px', borderRadius: '10px',
            background: 'none', border: '1px solid rgba(255,255,255,0.06)',
            color: 'rgba(255,255,255,0.45)', fontSize: '13px',
            fontFamily: 'Inter, sans-serif', cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#ff6b6b'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,107,107,0.3)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.45)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.06)' }}
        >
          <LogOut size={15} />
          Sair da conta
        </button>
      </div>
    </div>
  )
}

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#08091a' }}>
      {/* Desktop sidebar */}
      <aside style={{
        width: `${SIDEBAR_W}px`, flexShrink: 0,
        background: '#06070f',
        borderRight: '1px solid rgba(211,184,106,0.07)',
        position: 'fixed', top: 0, left: 0, bottom: 0,
        display: 'none',
        zIndex: 100,
      }} className="dashboard-sidebar">
        <SidebarContent />
      </aside>

      {/* Mobile overlay sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
                zIndex: 200, backdropFilter: 'blur(4px)',
              }}
            />
            <motion.aside
              initial={{ x: -SIDEBAR_W }}
              animate={{ x: 0 }}
              exit={{ x: -SIDEBAR_W }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              style={{
                position: 'fixed', top: 0, left: 0, bottom: 0,
                width: `${SIDEBAR_W}px`,
                background: '#06070f',
                borderRight: '1px solid rgba(211,184,106,0.07)',
                zIndex: 201,
              }}
            >
              <SidebarContent onClose={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div style={{ flex: 1 }} className="dashboard-main">
        {/* Mobile topbar */}
        <div className="dashboard-topbar" style={{
          display: 'none', alignItems: 'center', gap: '14px',
          padding: '0 20px', height: '60px',
          background: '#06070f',
          borderBottom: '1px solid rgba(211,184,106,0.07)',
          position: 'sticky', top: 0, zIndex: 50,
        }}>
          <button
            onClick={() => setMobileOpen(true)}
            style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px', width: '36px', height: '36px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', cursor: 'pointer', flexShrink: 0,
            }}
          >
            <Menu size={18} />
          </button>
          <span style={{ fontFamily: 'Cinzel, serif', fontSize: '14px', letterSpacing: '2px', color: '#fff', fontWeight: 700 }}>
            KOINÔNIA
          </span>
        </div>

        <div style={{ padding: 'clamp(24px, 3vw, 40px)' }}>
          <Outlet />
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .dashboard-sidebar { display: block !important; }
          .dashboard-main { margin-left: ${SIDEBAR_W}px; }
          .dashboard-topbar { display: none !important; }
        }
        @media (max-width: 767px) {
          .dashboard-topbar { display: flex !important; }
        }
      `}</style>
    </div>
  )
}
