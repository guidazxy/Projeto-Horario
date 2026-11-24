import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Check,
  ClipboardList,
  GraduationCap,
  House,
  LogOut,
  MoreHorizontal,
  UsersRound,
  X,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const menus = {
  professor: [
    { id: "overview", label: "Visão geral", icon: House },
    { id: "schedule", label: "Horários", icon: CalendarDays },
    { id: "classes", label: "Turmas", icon: UsersRound },
    { id: "subjects", label: "Disciplinas", icon: BookOpen },
  ],
  aluno: [
    { id: "overview", label: "Visão geral", icon: House },
    { id: "schedule", label: "Meu horário", icon: CalendarDays },
    { id: "grades", label: "Boletim", icon: BookOpen },
    { id: "attendance", label: "Frequência", icon: ClipboardList },
  ],
};

const pageDetails = {
  schedule: {
    title: "Horários",
    description: "Consulte sua organização semanal e acompanhe as aulas previstas.",
    emptyTitle: "Sua grade ainda não foi publicada",
    emptyDescription: "Quando os horários forem disponibilizados, eles aparecerão nesta área.",
    icon: CalendarDays,
  },
  classes: {
    title: "Turmas",
    description: "Acompanhe as turmas vinculadas à sua rotina acadêmica.",
    emptyTitle: "Nenhuma turma disponível",
    emptyDescription: "As turmas vinculadas à sua conta serão exibidas aqui.",
    icon: UsersRound,
  },
  subjects: {
    title: "Disciplinas",
    description: "Acesse as disciplinas relacionadas ao seu período letivo.",
    emptyTitle: "Nenhuma disciplina disponível",
    emptyDescription: "As disciplinas serão organizadas aqui quando estiverem disponíveis.",
    icon: BookOpen,
  },
  grades: {
    title: "Boletim",
    description: "Acompanhe suas notas e avaliações ao longo do período.",
    emptyTitle: "Seu boletim está vazio",
    emptyDescription: "As notas serão exibidas aqui após o lançamento pelos professores.",
    icon: BookOpen,
  },
  attendance: {
    title: "Frequência",
    description: "Consulte seu acompanhamento de presença nas aulas.",
    emptyTitle: "Frequência ainda não registrada",
    emptyDescription: "Os registros de presença aparecerão aqui após o início das aulas.",
    icon: ClipboardList,
  },
};

function displayName(user) {
  return user?.nome || user?.name || user?.email?.split("@")[0] || "Usuário";
}

function formatToday() {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

export default function Workspace({ user, onLogout }) {
  const [activeView, setActiveView] = useState("overview");
  const [moreOpen, setMoreOpen] = useState(false);
  const isProfessor = user?.role === "professor";
  const role = isProfessor ? "professor" : "aluno";
  const roleLabel = isProfessor ? "Área do professor" : "Área do estudante";
  const navigation = menus[role];
  const currentPage = navigation.find((item) => item.id === activeView) || navigation[0];
  const name = displayName(user);
  const initials = name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

  useEffect(() => {
    if (!moreOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setMoreOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [moreOpen]);

  const changeView = (view) => {
    setActiveView(view);
    setMoreOpen(false);
  };

  const logout = () => {
    localStorage.removeItem("academi_token");
    onLogout();
  };

  return (
    <div className="workspace-shell">
      <a className="skip-link" href="#workspace-content">Pular para o conteúdo</a>

      <aside className="desktop-sidebar" aria-label="Navegação principal">
        <a className="brand-lockup" href="#inicio" onClick={(event) => { event.preventDefault(); changeView("overview"); }}>
          <span className="brand-mark"><GraduationCap aria-hidden="true" size={22} /></span>
          <span className="brand-copy">
            <strong>AcademiStack</strong>
            <small>GESTÃO ACADÊMICA</small>
          </span>
        </a>

        <div className="sidebar-section-label">ESPAÇO DE TRABALHO</div>
        <nav className="desktop-nav">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === activeView;
            return (
              <button
                key={item.id}
                type="button"
                className={`nav-item${isActive ? " is-active" : ""}`}
                onClick={() => changeView(item.id)}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon aria-hidden="true" size={19} strokeWidth={1.8} />
                <span>{item.label}</span>
                {isActive && <span className="nav-active-mark" aria-hidden="true" />}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-account">
            <span className="user-avatar" aria-hidden="true">{initials}</span>
            <span className="account-copy">
              <strong>{name}</strong>
              <small>{isProfessor ? "Professor" : "Estudante"}</small>
            </span>
          </div>
          <div className="sidebar-controls">
            <ThemeToggle />
            <button type="button" className="icon-button" onClick={logout} aria-label="Sair da conta" title="Sair">
              <LogOut aria-hidden="true" size={18} strokeWidth={1.8} />
            </button>
          </div>
          <div className="sidebar-campus"><span className="status-dot" /> Portal acadêmico</div>
        </div>
      </aside>

      <div className="workspace-main">
        <header className="workspace-topbar">
          <div className="mobile-brand-lockup">
            <span className="brand-mark"><GraduationCap aria-hidden="true" size={20} /></span>
            <strong>AcademiStack</strong>
          </div>
          <div className="topbar-heading">
            <p>{roleLabel}</p>
            <h1>{currentPage.label}</h1>
          </div>
          <div className="topbar-actions">
            <div className="today-label"><CalendarDays aria-hidden="true" size={16} />{formatToday()}</div>
            <ThemeToggle className="mobile-theme-toggle" />
            <span className="topbar-avatar" aria-label={`Conta de ${name}`}>{initials}</span>
          </div>
        </header>

        <main className="workspace-content" id="workspace-content" tabIndex="-1">
          {activeView === "overview" ? (
            <Overview
              name={name}
              roleLabel={roleLabel}
              isProfessor={isProfessor}
              navigation={navigation}
              onNavigate={changeView}
            />
          ) : (
            <WorkspacePage page={pageDetails[activeView]} />
          )}
        </main>
      </div>

      <nav className="mobile-bottom-nav" aria-label="Navegação móvel">
        {navigation.slice(0, 3).map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activeView;
          return (
            <button
              key={item.id}
              type="button"
              className={`mobile-nav-item${isActive ? " is-active" : ""}`}
              onClick={() => changeView(item.id)}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon aria-hidden="true" size={20} strokeWidth={1.8} />
              <span>{item.label}</span>
            </button>
          );
        })}
        <button
          type="button"
          className={`mobile-nav-item${moreOpen || navigation.slice(3).some((item) => item.id === activeView) ? " is-active" : ""}`}
          onClick={() => setMoreOpen((open) => !open)}
          aria-expanded={moreOpen}
          aria-controls="mobile-more-menu"
        >
          {moreOpen ? <X aria-hidden="true" size={20} /> : <MoreHorizontal aria-hidden="true" size={20} />}
          <span>Mais</span>
        </button>
      </nav>

      {moreOpen && (
        <section className="mobile-more-menu" id="mobile-more-menu" aria-label="Mais opções">
          <div className="mobile-more-heading">
            <strong>Mais opções</strong>
            <button type="button" className="icon-button" onClick={() => setMoreOpen(false)} aria-label="Fechar menu">
              <X aria-hidden="true" size={18} />
            </button>
          </div>
          {navigation.slice(3).map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.id} type="button" className="more-menu-item" onClick={() => changeView(item.id)}>
                <Icon aria-hidden="true" size={19} />
                <span>{item.label}</span>
                <ArrowUpRight aria-hidden="true" className="more-menu-arrow" size={16} />
              </button>
            );
          })}
          <div className="mobile-more-footer">
            <span className="mobile-account-label">{name}</span>
            <button type="button" className="mobile-logout" onClick={logout}>
              <LogOut aria-hidden="true" size={17} /> Sair
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

function Overview({ name, roleLabel, isProfessor, navigation, onNavigate }) {
  const quickLinks = navigation.filter((item) => item.id !== "overview").slice(0, 3);

  return (
    <div className="overview-page">
      <section className="welcome-panel">
        <div className="welcome-copy">
          <span className="eyebrow"><span className="status-dot" />{roleLabel}</span>
          <h2>Olá, {name.split(" ")[0]}.</h2>
          <p>Seu espaço para acompanhar a rotina acadêmica com mais clareza.</p>
        </div>
        <div className="welcome-date">
          <span>HOJE</span>
          <strong>{formatToday()}</strong>
        </div>
        <span className="welcome-accent" aria-hidden="true"><GraduationCap size={104} strokeWidth={1} /></span>
      </section>

      <div className="overview-grid">
        <section className="surface-panel agenda-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-kicker">ROTINA</span>
              <h3>{isProfessor ? "Agenda acadêmica" : "Meu dia"}</h3>
            </div>
            <button type="button" className="text-action" onClick={() => onNavigate("schedule")}>
              Ver horários <ArrowUpRight aria-hidden="true" size={16} />
            </button>
          </div>
          <div className="agenda-empty">
            <span className="empty-illustration"><CalendarDays aria-hidden="true" size={25} strokeWidth={1.6} /></span>
            <div>
              <h4>Nenhum horário por enquanto</h4>
              <p>Quando a grade for publicada, seus próximos compromissos aparecerão aqui.</p>
            </div>
          </div>
        </section>

        <section className="surface-panel quick-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-kicker">ATALHOS</span>
              <h3>Acesso rápido</h3>
            </div>
          </div>
          <div className="quick-link-list">
            {quickLinks.map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.id} type="button" className="quick-link" onClick={() => onNavigate(item.id)}>
                  <span className="quick-link-icon"><Icon aria-hidden="true" size={19} strokeWidth={1.8} /></span>
                  <span>{item.label}</span>
                  <ArrowUpRight aria-hidden="true" className="quick-link-arrow" size={17} />
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <div className="workspace-footnote"><Check aria-hidden="true" size={15} /> Visão geral da sua rotina acadêmica</div>
    </div>
  );
}

function WorkspacePage({ page }) {
  const Icon = page.icon;

  return (
    <section className="surface-panel detail-page">
      <div className="detail-intro">
        <span className="panel-kicker">ÁREA ACADÊMICA</span>
        <p>{page.description}</p>
      </div>
      <div className="detail-empty">
        <span className="empty-illustration"><Icon aria-hidden="true" size={27} strokeWidth={1.6} /></span>
        <h2>{page.emptyTitle}</h2>
        <p>{page.emptyDescription}</p>
      </div>
    </section>
  );
}