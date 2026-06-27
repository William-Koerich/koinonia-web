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
    </Routes>
  )
}
