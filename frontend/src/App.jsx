import React, { useState, useEffect } from 'react'
import Login from './components/Login'
import Header from './components/Header'
import Hero from './components/Hero'
import Beneficios from './components/Beneficios'
import FormularioLead from './components/FormularioLead'
import ModalLeads from './components/ModalLeads'
import Toast from './components/Toast'
import Footer from './components/Footer'

export default function App() {
  const [toastState, setToastState] = useState({
    mensagem: '',
    tipo: 'sucesso',
    visivel: false
  })

  const [modalLeadsAberto, setModalLeadsAberto] = useState(false)

  const exibirToastSucesso = (mensagem) => {
    setToastState({ mensagem, tipo: 'sucesso', visivel: true })
  }

  const exibirToastErro = (mensagem) => {
    setToastState({ mensagem, tipo: 'erro', visivel: true })
  }

  const fecharToast = () => {
    setToastState(prev => ({ ...prev, visivel: false }))
  }

  const [usuarioPerfil, setUsuarioPerfil] = useState<'funcionario' | 'aluno' | null>(null)
  const [logado, setLogado] = useState(false)

  const fazerLogin = async (perfil: string, email: string, senha: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ perfil, email, senha })
      })
      const data = await res.json()
      if (data.sucesso) {
        setUsuarioPerfil(perfil)
        setLogado(true)
      } else {
        exibirToastErro(data.mensagem || 'Login falhou')
      }
    } catch {
      exibirToastErro('Erro de conexão com a API')
    }
  }

  const logout = () => {
    setUsuarioPerfil(null)
    setLogado(false)
  }

  useEffect(() => {
    const verificarLogin = async () => {
      try {
        const res = await fetch('/api/auth/status')
        const data = await res.json()
        if (data.autenticado && data.perfil) {
          setUsuarioPerfil(data.perfil)
          setLogado(true)
        }
      } catch {
        // Não autenticado, permanece no login
      }
    }
    verificarLogin()
  }, [])

  if (!logado) {
    return <Login aoFazerLogin={fazerLogin} />
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-white">
      <Header aoAbrirModalLeads={() => setModalLeadsAberto(true)} perfil={usuarioPerfil} />
      
      <main className="flex-1">
        {usuarioPerfil === 'funcionario' && (
          <>
            <Hero />
            <Beneficios />
            <FormularioLead
              emSucesso={exibirToastSucesso}
              emErro={exibirToastErro}
              aoAbrirModalLeads={() => setModalLeadsAberto(true)}
            />
          </>
        )}

        {usuarioPerfil === 'aluno' && (
          <div className="p-6">
            <h1 className="text-2xl font-black text-white mb-4">Painel do Aluno</h1>
            <p className="text-slate-400">Bem-vindo ao painel de consulta de horários</p>
            {/* TODO: Implementar grade do aluno */}
          </div>
        )}
      </main>

      <Footer aoAbrirModalLeads={() => setModalLeadsAberto(true)} perfil={usuarioPerfil} />

      <ModalLeads
        aberto={modalLeadsAberto}
        aoFechar={() => setModalLeadsAberto(false)}
      />

      <Toast
        mensagem={toastState.mensagem}
        tipo={toastState.tipo}
        visivel={toastState.visivel}
        aoFechar={fecharToast}
      />
    </div>
  )
}