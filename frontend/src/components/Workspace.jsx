import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Check,
  ClipboardList,
  Clock3,
  GraduationCap,
  House,
  LogOut,
  MapPin,
  MoreHorizontal,
  RefreshCw,
  UsersRound,
  X,
} from "lucide-react";
import { useI18n } from "../locales/I18nContext";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";

const menus = {
  professor: [
    { id: "overview", labelKey: "workspace.overview", icon: House },
    { id: "schedule", labelKey: "workspace.schedule", icon: CalendarDays },
    { id: "classes", labelKey: "workspace.classes", icon: UsersRound },
    { id: "subjects", labelKey: "workspace.subjects", icon: BookOpen },
  ],
  aluno: [
    { id: "overview", labelKey: "workspace.overview", icon: House },
    { id: "schedule", labelKey: "workspace.mySchedule", icon: CalendarDays },
    { id: "grades", labelKey: "workspace.grades", icon: BookOpen },
    { id: "attendance", labelKey: "workspace.attendance", icon: ClipboardList },
  ],
};

const pageDetails = {
  schedule: {
    descriptionKey: "workspace.scheduleDescription",
    emptyTitleKey: "workspace.noScheduleTitle",
    emptyDescriptionKey: "workspace.noScheduleDescription",
    icon: CalendarDays,
  },
  classes: {
    descriptionKey: "workspace.classesDescription",
    emptyTitleKey: "workspace.noClassesTitle",
    emptyDescriptionKey: "workspace.noClassesDescription",
    icon: UsersRound,
  },
  subjects: {
    descriptionKey: "workspace.subjectsDescription",
    emptyTitleKey: "workspace.noSubjectsTitle",
    emptyDescriptionKey: "workspace.noSubjectsDescription",
    icon: BookOpen,
  },
  grades: {
    descriptionKey: "workspace.gradesDescription",
    emptyTitleKey: "workspace.noGradesTitle",
    emptyDescriptionKey: "workspace.noGradesDescription",
    icon: BookOpen,
  },
  attendance: {
    descriptionKey: "workspace.attendanceDescription",
    emptyTitleKey: "workspace.noAttendanceTitle",
    emptyDescriptionKey: "workspace.noAttendanceDescription",
    icon: ClipboardList,
  },
};

function displayName(user) {
  return user?.nome || user?.name || user?.email?.split("@")[0] || "Usuário";
}

function formatToday(locale) {
  const intlLocale = { pt: "pt-BR", en: "en-US", es: "es-ES" }[locale] || "pt-BR";
  return new Intl.DateTimeFormat(intlLocale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

export default function Workspace({ user, onLogout }) {
  const { translate: t, locale } = useI18n();
  const [activeView, setActiveView] = useState("overview");
  const [moreOpen, setMoreOpen] = useState(false);
  const [records, setRecords] = useState({ cursos: [], turmas: [], disciplinas: [], horarios: [] });
  const [recordsLoading, setRecordsLoading] = useState(true);
  const [recordsError, setRecordsError] = useState("");
  const [refreshVersion, setRefreshVersion] = useState(0);
  const isProfessor = user?.role === "professor";
  const role = isProfessor ? "professor" : "aluno";
  const roleLabel = t(isProfessor ? "workspace.professorArea" : "workspace.studentArea");
  const navigation = menus[role];
  const currentPage = navigation.find((item) => item.id === activeView) || navigation[0];
  const currentPageLabel = t(currentPage.labelKey);
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

  useEffect(() => {
    const controller = new AbortController();
    const token = localStorage.getItem("academi_token");
    setRecordsLoading(true);
    setRecordsError("");

    const fetchJson = async (url) => {
      const response = await fetch(url, { signal: controller.signal });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(response.status === 401 ? "sessionExpired" : "loadError");
      }
      return payload;
    };

    const loadRecords = async () => {
      try {
        if (isProfessor) {
          const [context, timetable] = await Promise.all([
            fetchJson("/api/professor/contexto"),
            fetchJson("/api/professor/horarios"),
          ]);
          setRecords({
            cursos: context.cursos || [],
            turmas: context.turmas || [],
            disciplinas: context.disciplinas || [],
            horarios: timetable.horarios || [],
          });
        } else {
          if (!token) throw new Error("sessionExpired");
          const timetable = await fetchJson(`/api/aluno/horarios?token=${encodeURIComponent(token)}`);
          setRecords({ cursos: [], turmas: [], disciplinas: [], horarios: timetable.horarios || [] });
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          setRecordsError(error.message === "sessionExpired" ? "sessionExpired" : "loadError");
        }
      } finally {
        if (!controller.signal.aborted) setRecordsLoading(false);
      }
    };

    loadRecords();
    return () => controller.abort();
  }, [isProfessor, refreshVersion]);

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
      <a className="skip-link" href="#workspace-content">{t("workspace.skipContent")}</a>

      <aside className="desktop-sidebar" aria-label="Navegação principal">
        <a className="brand-lockup" href="#inicio" onClick={(event) => { event.preventDefault(); changeView("overview"); }}>
          <span className="brand-mark"><GraduationCap aria-hidden="true" size={22} /></span>
          <span className="brand-copy">
            <strong>AcademiStack</strong>
            <small>{t("workspace.brandCaption")}</small>
          </span>
        </a>

        <div className="sidebar-section-label">{t("workspace.sectionLabel")}</div>
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
                <span>{t(item.labelKey)}</span>
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
              <small>{t(isProfessor ? "workspace.professorRole" : "workspace.studentRole")}</small>
            </span>
          </div>
          <div className="sidebar-controls">
            <LanguageSwitcher />
            <ThemeToggle />
            <button type="button" className="icon-button" onClick={logout} aria-label={t("workspace.logout")} title={t("workspace.logoutShort")}>
              <LogOut aria-hidden="true" size={18} strokeWidth={1.8} />
            </button>
          </div>
          <div className="sidebar-campus"><span className="status-dot" /> {t("workspace.portal")}</div>
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
            <h1>{currentPageLabel}</h1>
          </div>
          <div className="topbar-actions">
            <div className="today-label"><CalendarDays aria-hidden="true" size={16} />{formatToday(locale)}</div>
            <LanguageSwitcher className="mobile-language-toggle" />
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
              locale={locale}
              t={t}
              navigation={navigation}
              onNavigate={changeView}
              records={records}
              loading={recordsLoading}
              error={recordsError}
              onRetry={() => setRefreshVersion((version) => version + 1)}
            />
          ) : (
            <WorkspacePage
              page={pageDetails[activeView]}
              view={activeView}
              records={records}
              loading={recordsLoading}
              error={recordsError}
              onRetry={() => setRefreshVersion((version) => version + 1)}
              t={t}
            />
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
              <span>{t(item.labelKey)}</span>
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
          <span>{t("workspace.more")}</span>
        </button>
      </nav>

      {moreOpen && (
        <section className="mobile-more-menu" id="mobile-more-menu" aria-label={t("workspace.moreOptions")}>
          <div className="mobile-more-heading">
            <strong>{t("workspace.moreOptions")}</strong>
            <button type="button" className="icon-button" onClick={() => setMoreOpen(false)} aria-label={t("workspace.closeMenu")}>
              <X aria-hidden="true" size={18} />
            </button>
          </div>
          {navigation.slice(3).map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.id} type="button" className="more-menu-item" onClick={() => changeView(item.id)}>
                <Icon aria-hidden="true" size={19} />
                <span>{t(item.labelKey)}</span>
                <ArrowUpRight aria-hidden="true" className="more-menu-arrow" size={16} />
              </button>
            );
          })}
          <div className="mobile-more-footer">
            <span className="mobile-account-label">{name}</span>
            <button type="button" className="mobile-logout" onClick={logout}>
              <LogOut aria-hidden="true" size={17} /> {t("workspace.logoutShort")}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

function Overview({ name, roleLabel, isProfessor, navigation, onNavigate, records, loading, error, onRetry, locale, t }) {
  const quickLinks = navigation.filter((item) => item.id !== "overview").slice(0, 3);

  return (
    <div className="overview-page">
      <section className="welcome-panel">
        <div className="welcome-copy">
          <span className="eyebrow"><span className="status-dot" />{roleLabel}</span>
          <h2>{t("workspace.greeting").replace("{name}", name.split(" ")[0])}</h2>
          <p>{t("workspace.welcomeCopy")}</p>
        </div>
        <div className="welcome-date">
          <span>{t("workspace.today")}</span>
          <strong>{formatToday(locale)}</strong>
        </div>
        <span className="welcome-accent" aria-hidden="true"><GraduationCap size={104} strokeWidth={1} /></span>
      </section>

      <div className="overview-grid">
        <section className="surface-panel agenda-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-kicker">{t("workspace.routine")}</span>
              <h3>{t(isProfessor ? "workspace.agenda" : "workspace.myDay")}</h3>
            </div>
            <button type="button" className="text-action" onClick={() => onNavigate("schedule")}>
              {t("workspace.viewSchedules")} <ArrowUpRight aria-hidden="true" size={16} />
            </button>
          </div>
          <div className="agenda-records" aria-live="polite">
            {loading ? (
              <RecordMessage>{t("workspace.loadingSchedules")}</RecordMessage>
            ) : error ? (
              <RecordError message={t(`workspace.${error}`)} onRetry={onRetry} t={t} />
            ) : records.horarios.length ? (
              records.horarios.slice(0, 3).map((record) => <ScheduleRecord key={record.id} record={record} compact t={t} />)
            ) : (
              <RecordEmpty icon={CalendarDays} title={t("workspace.noSchedules")}>
                {t("workspace.noSchedulesCopy")}
              </RecordEmpty>
            )}
          </div>
        </section>

        <section className="surface-panel quick-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-kicker">{t("workspace.shortcuts")}</span>
              <h3>{t("workspace.quickAccess")}</h3>
            </div>
          </div>
          <div className="quick-link-list">
            {quickLinks.map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.id} type="button" className="quick-link" onClick={() => onNavigate(item.id)}>
                  <span className="quick-link-icon"><Icon aria-hidden="true" size={19} strokeWidth={1.8} /></span>
                  <span>{t(item.labelKey)}</span>
                  <ArrowUpRight aria-hidden="true" className="quick-link-arrow" size={17} />
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <div className="workspace-footnote"><Check aria-hidden="true" size={15} /> {t("workspace.overviewFootnote")}</div>
    </div>
  );
}

function WorkspacePage({ page, view, records, loading, error, onRetry, t }) {
  const Icon = page.icon;
  const recordsByView = {
    schedule: records.horarios,
    classes: records.turmas,
    subjects: records.disciplinas,
  };
  const items = recordsByView[view] || [];

  return (
    <section className="surface-panel detail-page">
      <div className="detail-intro">
        <span className="panel-kicker">{t("workspace.academicArea")}</span>
        <p>{t(page.descriptionKey)}</p>
      </div>
      <div className="records-content" aria-live="polite">
        {loading ? (
          <RecordMessage>{t("workspace.loadingRecords")}</RecordMessage>
        ) : error ? (
          <RecordError message={t(`workspace.${error}`)} onRetry={onRetry} t={t} />
        ) : items.length ? (
          <RecordsList view={view} items={items} t={t} />
        ) : (
          <RecordEmpty icon={Icon} title={t(page.emptyTitleKey)}>{t(page.emptyDescriptionKey)}</RecordEmpty>
        )}
      </div>
    </section>
  );
}

function RecordsList({ view, items, t }) {
  if (view === "schedule") {
    return <div className="record-list">{items.map((record) => <ScheduleRecord key={record.id} record={record} t={t} />)}</div>;
  }

  if (view === "classes") {
    return (
      <div className="record-list">
        {items.map((record) => (
          <article className="record-row" key={record.id}>
            <span className="record-icon"><UsersRound aria-hidden="true" size={19} /></span>
            <span className="record-copy">
              <strong>{record.nome}</strong>
              <span>{record.curso_nome || t("workspace.courseUnknown")}</span>
            </span>
            <span className="record-meta">{[record.ano_letivo, record.periodo_letivo].filter(Boolean).join(" · ") || t("workspace.classId").replace("{id}", record.id)}</span>
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className="record-list">
      {items.map((record) => (
        <article className="record-row" key={record.id}>
          <span className="record-icon"><BookOpen aria-hidden="true" size={19} /></span>
          <span className="record-copy">
            <strong>{record.materia_nome}</strong>
              <span>{record.professor_nome || t("workspace.professorUnknown")}</span>
          </span>
          <span className="record-meta">{[record.turma_nome, record.curso_nome].filter(Boolean).join(" · ")}</span>
        </article>
      ))}
    </div>
  );
}

function ScheduleRecord({ record, compact = false, t }) {
  const day = record.dia_semana || record.dia;
  const start = record.hora_inicio || record.inicio;
  const end = record.hora_fim || record.fim;
  const room = record.sala_nome || record.sala;
  const translatedDay = t(`workspace.weekdays.${day}`);
  const statusKey = { confirmado: "confirmed", pendente: "pending", cancelado: "cancelled" }[record.status] || "pending";

  return (
    <article className={`record-row schedule-record${compact ? " is-compact" : ""}`}>
      <span className="schedule-time">
        <strong>{start || "Horário"}</strong>
        {!compact && <span>{end ? t("workspace.until").replace("{time}", end) : translatedDay}</span>}
      </span>
      <span className="record-copy">
        <strong>{record.materia_nome || "Aula"}</strong>
        <span>{[record.turma_nome, record.professor_nome].filter(Boolean).join(" · ") || translatedDay}</span>
      </span>
      {!compact && (
        <span className="schedule-details">
          <span>{translatedDay}</span>
          {room && <span><MapPin aria-hidden="true" size={14} />{room}</span>}
        </span>
      )}
      {!compact && <span className={`status-tag ${record.status === "confirmado" ? "is-confirmed" : ""}`}>{t(`workspace.${statusKey}`)}</span>}
    </article>
  );
}

function RecordMessage({ children }) {
  return <div className="record-message"><Clock3 aria-hidden="true" size={17} />{children}</div>;
}

function RecordError({ message, onRetry, t }) {
  return (
    <div className="record-error" role="alert">
      <p>{message}</p>
      <button type="button" className="text-action" onClick={onRetry}>
        <RefreshCw aria-hidden="true" size={15} /> {t("workspace.retry")}
      </button>
    </div>
  );
}

function RecordEmpty({ icon: Icon, title, children }) {
  return (
    <div className="detail-empty">
      <span className="empty-illustration"><Icon aria-hidden="true" size={27} strokeWidth={1.6} /></span>
      <h2>{title}</h2>
      <p>{children}</p>
    </div>
  );
}