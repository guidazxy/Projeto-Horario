import React, { useState } from 'react'

export default function Login() {
  const [perfil, setPerfil] = useState<'funcionario' | 'aluno'>('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  [error, setError] = useState('')

  const login = async () => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha, perfil })
      })
      const data = await res.json()
      if (data.sucesso) {
        window.location.href = perfil === 'funcionario' 
          ? '/funcionario' 
          : '/aluno'
      } else {
        setError(data.mensagem || 'Login falhou')
      }
    } catch {
      setError('Erro de conexão com a API')
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-slate-950 py-12">
      <div className="max-w-md w-full bg-slate-900/90 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 via-sky-400 to-emerald-400 mx-auto mb-4 flex items-center justify-center text-2xl font-black">
            ⚡
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Sistema de Gestão de Horários</h1>
          <p className="text-slate-400 text-sm mt-2">Insira suas credenciais para acessar o sistema</p>
        </div>

        {error && (
          <div className="bg-rose-950/80 border border-rose-800 rounded-xl p-4 mb-6 text-center">
            <p className="text-rose-300 text-sm">{error}</p>
          </div>
        )}

        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-bold uppercase text-slate-300 mb-2">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition text-sm"
            />
          </div>

          <div>
            <label htmlFor="senha" className="block text-sm font-bold uppercase text-slate-300 mb-2">Senha</label>
            <input
              type="password"
              id="senha"
              name="senha"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setPerfil('funcionario')}
              className={`w-full py-3 rounded-xl ${
                perfil === 'funcionario'
                  ? 'bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 text-white font-bold shadow-outline'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              } transition-colors cursor-pointer`}
            >
              <span>Funcionário</span>
            </button>
            <button
              onClick={() => setPerfil('aluno')}
              className={`w-full py-3 rounded-xl ${
                perfil === 'aluno'
                  ? 'bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 text-white font-bold shadow-outline'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              } transition-colors cursor-pointer`}
            >
              <span>Aluno</span>
            </button>
          </div>

          <button
            type="submit"
            onClick={login}
            disabled={!perfil || !email || !senha}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold transition duration-300 shadow-xl shadow-cyan-500/25 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {perfil ? 'Acessar Sistema' : 'Selecione um perfil e preencha os campos'}
          </button>
        </form>
      </div>
    </section>
  )
}