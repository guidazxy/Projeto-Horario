import React, { useState, useEffect } from 'react'
import { useI18n } from './locales/I18nContext'

export default function App() {
  const [autenticado, setAutenticado] = useState(false);
  const [modoCadastro, setModoCadastro] = useState(false);
  const [perfil, setPerfil] = useState('Funcionário');
  const [usuarios, setUsuarios] = useState([
    { email: 'admin@escola.com', senha: 'admin123', perfil: 'Funcionário' }
  ]);
  const [email, setEmail] = useState('admin@escola.com');
  const [senha, setSenha] = useState('admin123');
  const [alerta, setAlerta] = useState('');
  const [sucesso, setSucesso] = useState('');

  // Estados do Dashboard e Horários
  const [turmas, setTurmas] = useState([
    { id: 1, nome: '1º Ano A', turno: 'Matutino' },
    { id: 2, nome: '2º Ano B', turno: 'Matutino' }
  ]);
  const [turmaId, setTurmaId] = useState(1);
  const [horarios, setHorarios] = useState([]);
  const [termoBusca, setTermoBusca] = useState('');

  // Estados do Formulário de Alocação
  const [novaMateria, setNovaMateria] = useState('');
  const [novoProf, setNovoProf] = useState('');
  const [novaSala, setNovaSala] = useState('');
  const [diaSemana, setDiaSemana] = useState('Segunda-feira');
  const [msgStatus, setMsgStatus] = useState({ tipo: '', texto: '' });

  useEffect(() => {
    if (autenticado) {
      fetch('http://localhost:3000/api/turmas')
        .then(res => res.json())
        .then(data => setTurmas(data))
        .catch(() => {});
    }
  }, [autenticado]);

  useEffect(() => {
    if (autenticado) {
      buscarHorarios();
    }
  }, [turmaId, autenticado]);

  const buscarHorarios = () => {
    fetch(`http://localhost:3000/api/horarios/${turmaId}`)
      .then(res => res.json())
      .then(data => setHorarios(data))
      .catch(() => setHorarios([]));
  };

  const fazerLogin = (e) => {
    e.preventDefault();
    const u = usuarios.find(x => x.email === email && x.senha === senha);
    if (u) {
      setAutenticado(true);
      setPerfil(u.perfil);
      setAlerta('');
    } else {
      setAlerta('E-mail ou senha incorretos!');
    }
  };

  const fazerCadastro = (e) => {
    e.preventDefault();
    if (usuarios.some(x => x.email === email)) {
      setAlerta('E-mail já cadastrado!');
      return;
    }
    setUsuarios([...usuarios, { email, senha, perfil }]);
    setSucesso('Conta criada com sucesso! Faça login.');
    setAlerta('');
    setModoCadastro(false);
  };

  const salvarHorario = (e) => {
    e.preventDefault();
    setMsgStatus({ tipo: '', texto: '' });

    const payload = {
      turma_id: Number(turmaId),
      dia_semana: diaSemana,
      horario: '07:30 - 08:20',
      disciplina: novaMateria,
      professor: novoProf,
      sala: novaSala
    };

    fetch('http://localhost:3000/api/horarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'Erro ao cadastrar');
        setMsgStatus({ tipo: 'sucesso', texto: '✅ Horário alocado com sucesso (Sem conflitos)!' });
        setNovaMateria('');
        setNovoProf('');
        setNovaSala('');
        buscarHorarios();
      })
      .catch((err) => {
        setMsgStatus({ tipo: 'erro', texto: `⚠️ ${err.message}` });
      });
  };

  // Filtrar horários com base na barra de busca
  const horariosFiltrados = horarios.filter(h => 
    h.disciplina.toLowerCase().includes(termoBusca.toLowerCase()) ||
    h.professor.toLowerCase().includes(termoBusca.toLowerCase()) ||
    h.sala.toLowerCase().includes(termoBusca.toLowerCase())
  );

  const pegarAula = (dia) => {
    const a = horariosFiltrados.find(h => h.dia_semana === dia);
    if (!a) return <span style={{ color: '#94a3b8' }}>- Sem Aula -</span>;
    return (
      <div style={{ background: '#eff6ff', padding: '8px', borderRadius: '6px', borderLeft: '3px solid #2563eb' }}>
        <strong style={{ color: '#1e40af', display: 'block' }}>{a.disciplina}</strong>
        <div style={{ fontSize: '12px', color: '#475569' }}>{a.professor}</div>
        <div style={{ fontSize: '11px', color: '#64748b' }}>📍 {a.sala}</div>
      </div>
    );
  };

  if (!autenticado) {
    return (
      <div style={{ background: '#0f172a', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif', padding: '20px' }}>
        <div style={{ background: '#1e293b', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '380px', color: '#fff', border: '1px solid #334155' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>⚡ {translate('header.title')}</h2>
          
          {alerta && <div style={{ background: '#7f1d1d', color: '#fca5a5', padding: '8px', borderRadius: '6px', marginBottom: '12px', fontSize: '13px', textAlign: 'center' }}>{alerta}</div>}
          {sucesso && <div style={{ background: '#065f46', color: '#a7f3d0', padding: '8px', borderRadius: '6px', marginBottom: '12px', fontSize: '13px', textAlign: 'center' }}>{sucesso}</div>}

          <form onSubmit={modoCadastro ? fazerCadastro : fazerLogin}>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '13px', display: 'block', marginBottom: '4px' }}>E-mail</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '8px', background: '#0f172a', border: '1px solid #475569', borderRadius: '6px', color: '#fff', boxSizing: 'border-box' }} required />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '13px', display: 'block', marginBottom: '4px' }}>Senha</label>
              <input type="password" value={senha} onChange={e => setSenha(e.target.value)} style={{ width: '100%', padding: '8px', background: '#0f172a', border: '1px solid #475569', borderRadius: '6px', color: '#fff', boxSizing: 'border-box' }} required />
            </div>
            <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
              <button type="button" onClick={() => setPerfil('Funcionário')} style={{ flex: 1, padding: '6px', background: perfil === 'Funcionário' ? '#3b82f6' : '#334155', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Funcionário</button>
              <button type="button" onClick={() => setPerfil('Aluno')} style={{ flex: 1, padding: '6px', background: perfil === 'Aluno' ? '#3b82f6' : '#334155', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Aluno</button>
            </div>
            <button type="submit" style={{ width: '100%', padding: '10px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '10px' }}>
              {modoCadastro ? 'Cadastrar' : 'Entrar'}
            </button>
          </form>

          <div style={{ textAlign: 'center' }}>
            <button onClick={() => { setModoCadastro(!modoCadastro); setAlerta(''); setSucesso(''); }} style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', fontSize: '13px', textDecoration: 'underline' }}>
              {modoCadastro ? 'Já tem conta? Faça login' : 'Não tem conta? Cadastre-se'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif', padding: '20px' }}>
      <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div>
          <h2 style={{ margin: 0, color: '#0f172a' }}>⚡ {translate('header.title')}</h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '14px' }}>Usuário: <strong>{email}</strong> ({perfil})</p>
        </div>
        <button onClick={() => setAutenticado(false)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Sair</button>
      </div>

      {perfil === 'Funcionário' && (
        <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>➕ Alocar Disciplina e Professor na Grade</h3>
          
          {msgStatus.texto && (
            <div style={{ background: msgStatus.tipo === 'erro' ? '#7f1d1d' : '#065f46', color: msgStatus.tipo === 'erro' ? '#fca5a5' : '#a7f3d0', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '13px', fontWeight: '500' }}>
              {msgStatus.texto}
            </div>
          )}

          <form onSubmit={salvarHorario} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', display: 'block', color: '#475569', marginBottom: '4px' }}>Dia da Semana</label>
              <select value={diaSemana} onChange={e => setDiaSemana(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                <option value="Segunda-feira">Segunda-feira</option>
                <option value="Terça-feira">Terça-feira</option>
                <option value="Quarta-feira">Quarta-feira</option>
                <option value="Quinta-feira">Quinta-feira</option>
                <option value="Sexta-feira">Sexta-feira</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', display: 'block', color: '#475569', marginBottom: '4px' }}>Disciplina</label>
              <input type="text" placeholder="Ex: Matemática" value={novaMateria} onChange={e => setNovaMateria(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} required />
            </div>
            <div>
              <label style={{ fontSize: '12px', display: 'block', color: '#475569', marginBottom: '4px' }}>Professor</label>
              <input type="text" placeholder="Ex: Prof. Carlos" value={novoProf} onChange={e => setNovoProf(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} required />
            </div>
            <div>
              <label style={{ fontSize: '12px', display: 'block', color: '#475569', marginBottom: '4px' }}>Sala</label>
              <input type="text" placeholder="Ex: Sala 101" value={novaSala} onChange={e => setNovaSala(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} required />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" style={{ width: '100%', padding: '9px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Salvar Horário</button>
            </div>
          </form>
        </div>
      )}

      {/* Tabela da Grade de Aulas com Filtro de Busca */}
      <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <h3 style={{ margin: 0, color: '#1e293b' }}>📅 Quadro de Aulas</h3>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input 
              type="text" 
              placeholder="🔍 Buscar matéria, prof, sala..." 
              value={termoBusca} 
              onChange={e => setTermoBusca(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '220px', fontSize: '13px', outline: 'none' }}
            />
            <select value={turmaId} onChange={e => setTurmaId(Number(e.target.value))} style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
              {turmas.map(t => <option key={t.id} value={t.id}>{t.nome} ({t.turno})</option>)}
            </select>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f1f5f9', color: '#334155' }}>
              <th style={{ padding: '10px', borderBottom: '2px solid #e2e8f0' }}>Horário</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #e2e8f0' }}>Segunda</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #e2e8f0' }}>Terça</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #e2e8f0' }}>Quarta</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #e2e8f0' }}>Quinta</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #e2e8f0' }}>Sexta</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '10px', fontWeight: 'bold', color: '#475569', borderBottom: '1px solid #f1f5f9' }}>07:30 - 08:20</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #f1f5f9' }}>{pegarAula('Segunda-feira')}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #f1f5f9' }}>{pegarAula('Terça-feira')}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #f1f5f9' }}>{pegarAula('Quarta-feira')}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #f1f5f9' }}>{pegarAula('Quinta-feira')}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #f1f5f9' }}>{pegarAula('Sexta-feira')}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}