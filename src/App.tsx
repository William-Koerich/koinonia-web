import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import Sobre from './components/Sobre'
import Eventos from './components/Eventos'
import Projetos from './components/Projetos'
import Ofertas from './components/Ofertas'
import Pastores from './components/Pastores'
import Localizacao from './components/Localizacao'
import Footer from './components/Footer'
import MissaoMocambique from './pages/MissaoMocambique'
import LIMPAZ from './pages/LIMPAZ'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import PrivateRoute from './components/PrivateRoute'
import DashboardLayout from './pages/dashboard/DashboardLayout'
import DashboardHome from './pages/dashboard/DashboardHome'
import CriarEvento from './pages/dashboard/eventos/CriarEvento'
import EditarEvento from './pages/dashboard/eventos/EditarEvento'
import ListaEventos from './pages/dashboard/eventos/ListaEventos'
import MeusEventos from './pages/dashboard/eventos/MeusEventos'
import CriarEscala from './pages/dashboard/escala/CriarEscala'
import EditarEscala from './pages/dashboard/escala/EditarEscala'
import MinhasEscalas from './pages/dashboard/escala/MinhasEscalas'
import CriarMinisterio from './pages/dashboard/ministerios/CriarMinisterio'
import EditarMinisterio from './pages/dashboard/ministerios/EditarMinisterio'
import MeuPerfil from './pages/dashboard/perfil/MeuPerfil'
import Usuarios from './pages/dashboard/usuarios/Usuarios'
import EditarUsuario from './pages/dashboard/usuarios/EditarUsuario'
import InscritosEvento from './pages/dashboard/eventos/InscritosEvento'
import EditarEventoForm from './pages/dashboard/eventos/EditarEventoForm'
import DetalheEvento from './pages/dashboard/eventos/DetalheEvento'
import GerenciarInscricoes from './pages/dashboard/eventos/GerenciarInscricoes'
import './App.css'

function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Sobre />
        <Eventos />
        <Projetos />
        <Ofertas />
        <Pastores />
        <Localizacao />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/projetos/missao-mocambique" element={<MissaoMocambique />} />
      <Route path="/projetos/limpaz" element={<LIMPAZ />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/dashboard" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
        <Route index element={<DashboardHome />} />
        <Route path="eventos" element={<ListaEventos />} />
        <Route path="eventos/criar" element={<CriarEvento />} />
        <Route path="eventos/editar" element={<EditarEvento />} />
        <Route path="eventos/meus-eventos" element={<MeusEventos />} />
        <Route path="eventos/inscricoes" element={<GerenciarInscricoes />} />
        <Route path="eventos/:id" element={<DetalheEvento />} />
        <Route path="escala/criar" element={<CriarEscala />} />
        <Route path="escala/editar" element={<EditarEscala />} />
        <Route path="escala/minhas-escalas" element={<MinhasEscalas />} />
        <Route path="ministerios/criar" element={<CriarMinisterio />} />
        <Route path="ministerios/editar" element={<EditarMinisterio />} />
        <Route path="perfil" element={<MeuPerfil />} />
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="usuarios/:id/editar" element={<EditarUsuario />} />
        <Route path="eventos/:id/editar" element={<EditarEventoForm />} />
        <Route path="eventos/:id/inscritos" element={<InscritosEvento />} />
      </Route>
    </Routes>
  )
}
