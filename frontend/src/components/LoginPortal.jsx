import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function LoginPortal({ onAuth }) {
  const navigate = useNavigate();
  const [showCadastro, setShowCadastro] = useState(false);
  const [type, setType] = useState("professor");
  const [form, setForm] = useState({ email: "", senha: "", nome: "" });
  const [submeter, setSubmeter] = useState(false);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("academi_token");
    if (token) {
      fetch(`/api/auth/me?credentials=${encodeURIComponent(token)}`)
        .then((res) => {
          if (!res.ok) throw new Error("Sessão expirada");
          return res.json();
        })
        .then((data) => {
          if (!data?.user) throw new Error("Sessão inválida");
          onAuth(data.user, token);
          navigate(data.user.role === "professor" ? "/professor" : "/aluno");
        })
        .catch(() => localStorage.removeItem("academi_token"));
    }
  }, [onAuth, navigate]);

  const login = async (e) => {
    e.preventDefault();
    setSubmeter(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, senha: form.senha, perfil: type })
      });
      const data = await res.json();
      if (data.sucesso) {
        localStorage.setItem("academi_token", data.token || data);
        onAuth(data.user, data.token || data);
        navigate(data.user.role === "professor" ? "/professor" : "/aluno");
      } else {
        setMensagem(data.mensagem || "Login falhou");
        setSubmeter(false);
      }
    } catch (e) {
      setMensagem("Erro de conexão com a API");
      setSubmeter(false);
    }
  };

  const cadastro = async (e) => {
    e.preventDefault();
    setSubmeter(true);
    try {
      const res = await fetch("/api/auth/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: form.nome,
          email: form.email,
          senha: form.senha,
          role: type
        })
      });
      const data = await res.json();
      if (data.sucesso) {
        localStorage.setItem("academi_token", data.token || data);
        onAuth(data.user, data.token || data);
        navigate(data.user.role === "professor" ? "/professor" : "/aluno");
      } else {
        setMensagem(data.mensagem || "Cadastro falhou");
        setSubmeter(false);
      }
    } catch (e) {
      setMensagem("Erro de conexão com a API");
      setSubmeter(false);
    }
  };

  return (
  <>
    <div className="auth-page min-h-screen bg-background">
      <div className="glass-card auth-card">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="brand-mark"><GraduationCap aria-hidden="true" size={22} /></span>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-primary">AcademiStack</h2>
                <p className="text-xs text-muted">Portal acadêmico</p>
              </div>
            </div>
            <ThemeToggle />
          </div>

          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              {showCadastro ? "Criar acesso" : "Bem-vindo de volta"}
            </p>
            <h1 className="mt-1 text-2xl font-bold text-text">
              {showCadastro ? "Crie sua conta" : "Acesse sua conta"}
            </h1>
          </div>

          <div className="mb-5">
            <p className="mb-1 block text-sm font-medium text-text">Perfil</p>
            <div className="flex gap-2" role="group" aria-label="Perfil de acesso">
              <button
                type="button"
                onClick={() => setType("professor")}
                aria-pressed={type === "professor"}
                className={`w-1/2 rounded-md py-1.5 px-2 font-medium transition-colors ${type === "professor" ? "bg-primary text-on-primary" : "text-primary hover:bg-border"}`}
              >
                Professor
              </button>
              <button
                type="button"
                onClick={() => setType("aluno")}
                aria-pressed={type === "aluno"}
                className={`w-1/2 rounded-md py-1.5 px-2 font-medium transition-colors ${type === "aluno" ? "bg-primary text-on-primary" : "text-primary hover:bg-border"}`}
              >
                Aluno
              </button>
            </div>
          </div>

          {showCadastro ? (
            <form onSubmit={cadastro} className="space-y-4">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-text mb-1">Nome completo</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  required
                  autoComplete="name"
                  className="w-full rounded-md border p-2 focus-outline"
                />
              </div>
              <div>
                <label htmlFor="cadastro-email" className="block text-sm font-medium text-text mb-1">E-mail</label>
                <input
                  type="email"
                  id="cadastro-email"
                  name="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  autoComplete="email"
                  className="w-full rounded-md border p-2 focus-outline"
                />
              </div>
              <div>
                <label htmlFor="cadastro-senha" className="block text-sm font-medium text-text mb-1">Senha</label>
                <input
                  type="password"
                  id="cadastro-senha"
                  name="senha"
                  value={form.senha}
                  onChange={(e) => setForm({ ...form, senha: e.target.value })}
                  required
                  autoComplete="new-password"
                  className="w-full rounded-md border p-2 focus-outline"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-md py-2 font-medium transition-colors bg-primary text-on-primary hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                disabled={submeter}
              >
                {submeter ? "Criando..." : "Criar conta"}
              </button>
              </form>
            ) : (
              <form onSubmit={login} className="space-y-4">
                <div>
                  <label htmlFor="login-email" className="block text-sm font-medium text-text mb-1">E-mail</label>
                  <input
                    type="email"
                    id="login-email"
                    name="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    autoComplete="email"
                    className="w-full rounded-md border p-2 focus-outline"
                  />
                </div>
                <div>
                  <label htmlFor="login-senha" className="block text-sm font-medium text-text mb-1">Senha</label>
                  <input
                    type="password"
                    id="login-senha"
                    name="senha"
                    value={form.senha}
                    onChange={(e) => setForm({ ...form, senha: e.target.value })}
                    required
                    autoComplete="current-password"
                    className="w-full rounded-md border p-2 focus-outline"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-md py-2 font-medium transition-colors bg-primary text-on-primary hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  disabled={submeter}
                >
                  {submeter ? "Entrando..." : "Entrar"}
                </button>
              </form>
            )}
            {mensagem && <p className="mt-4 text-sm text-danger" role="alert">{mensagem}</p>}
            <p className="mt-5 text-center text-sm text-muted">
              {showCadastro ? "Já possui acesso?" : "Ainda não tem uma conta?"}{" "}
              <button
                type="button"
                className="font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                onClick={() => {
                  setShowCadastro((current) => !current);
                  setMensagem("");
                }}
              >
                {showCadastro ? "Entrar" : "Criar conta"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
