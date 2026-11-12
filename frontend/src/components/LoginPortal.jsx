import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "./ThemeContext";

export default function LoginPortal({ onAuth }) {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [showCadastro, setShowCadastro] = useState(false);
  const [type, setType] = useState("professor");
  const [form, setForm] = useState({ email: "", senha: "", nome: "", matricula: "", turma_id: "" });
  const [submeter, setSubmeter] = useState(false);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("academi_token");
    if (token) {
      fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => {
          if (!res.ok) return localStorage.removeItem("academi_token");
          return res.json();
        })
        .then((user) => {
          onAuth(user, token);
          navigate(user.role === "professor" ? "/professor" : "/aluno");
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
        navigate(type === "professor" ? "/professor" : "/aluno");
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
          role: type,
          ...(type === "aluno" && { matricula: form.matricula, turma_id: parseInt(form.turma_id) })
        })
      });
      const data = await res.json();
      if (data.sucesso) {
        localStorage.setItem("academi_token", data.token || data);
        onAuth(data.user, data.token || data);
        navigate(type === "professor" ? "/professor" : "/aluno");
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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="glass-card w-full max-w-md w-100">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-primary">
              {type === "professor" ? "AcademiStack" : "AcademiStack"}
            </h2>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-border"
              aria-label="Alternar tema"
            >
              {isDark ? "🌙" : "☀️"}
            </button>
          </div>

          {showCadastro ? (
            <form onSubmit={cadastro} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1">Nome Completo</label>
                <input
                  type="text"
                  name="nome"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  required
                  className="w-full rounded-md border p-2 focus-outline"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">E-mail</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full rounded-md border p-2 focus-outline"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">Senha</label>
                <input
                  type="password"
                  name="senha"
                  value={form.senha}
                  onChange={(e) => setForm({ ...form, senha: e.target.value })}
                  required
                  className="w-full rounded-md border p-2 focus-outline"
                />
              </div>
              {type === "aluno" && (
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Matrícula</label>
                  <input
                    type="text"
                    name="matricula"
                    value={form.matricula}
                    onChange={(e) => setForm({ ...form, matricula: e.target.value })}
                    required
                    className="w-full rounded-md border p-2 focus-outline"
                  />
                  <label className="block text-sm font-medium text-text mb-1">Turma</label>
                  <select
                    name="turma_id"
                    value={form.turma_id}
                    onChange={(e) => setForm({ ...form, turma_id: e.target.value })}
                    required
                    className="w-full rounded-md border p-2 focus-outline"
                    >
                      <option value="">Selecione uma turma</option>
                    </select>
                  </div>
                )}
                <div>
                  <button
                    type="submit"
                    className="w-full rounded-md py-2 font-medium transition-colors bg-primary text-white hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    disabled={submeter}
                  >
                    {submeter ? "Criando..." : "Cadastrar"}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={login} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-1">E-mail</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    className="w-full rounded-md border p-2 focus-outline"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Senha</label>
                  <input
                    type="password"
                    name="senha"
                    value={form.senha}
                    onChange={(e) => setForm({ ...form, senha: e.target.value })}
                    required
                    className="w-full rounded-md border p-2 focus-outline"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Perfil</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setType("professor")}
                      className={`w-1/2 rounded-md py-1.5 px-2 font-medium transition-colors ${type === "professor" ? "bg-primary text-white" : "text-primary hover:bg-primary-dark"}`}
                    >
                      Professor
                    </button>
                    <button
                      type="button"
                      onClick={() => setType("aluno")}
                      className={`w-1/2 rounded-md py-1.5 px-2 font-medium transition-colors ${type === "aluno" ? "bg-primary text-white" : "text-primary hover:bg-primary-dark"}`}
                    >
                      Aluno
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full rounded-md py-2 font-medium transition-colors bg-primary text-white hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  disabled={submeter}
                >
                  {submeter ? "Entrando..." : type === "professor" ? "Entrar" : "Entrar"}
                </button>
              </form>
            )}
            <p className="mt-4 text-center text-sm text-muted">
              {type === "professor"
                ? "Já tem conta? Entre com suas credenciais."
                : "Não tem conta? Cadastre-se usando e-mail institucional."}
              </p>
              <p className="mt-3 text-center text-xs text-muted">
                {isDark ? "Modo escuro" : "Modo claro"}
              </p>
          </div>
        </div>
      </div>
    </>
  );
}
