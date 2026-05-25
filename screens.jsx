/* global React, I */

const { useState, useEffect, useRef, useMemo } = React;

/* =================================================================
   Forma (execution quality) badge — used on Atividade
   ================================================================= */
const FORMA_LEVELS = {
  excelente: { label: "Excelente", color: "var(--accent-green)", dots: 3 },
  boa:       { label: "Boa",       color: "var(--accent-green)", dots: 2 },
  atencao:   { label: "Atenção",   color: "var(--accent-amber)", dots: 1 },
  critica:   { label: "Crítica",   color: "var(--accent-red)",   dots: 0 },
};

function FormaBadge({ level = "boa" }) {
  const cfg = FORMA_LEVELS[level] || FORMA_LEVELS.boa;
  return (
    <div
      title={`Forma: ${cfg.label}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 12px",
        borderRadius: 999,
        background: `color-mix(in oklab, ${cfg.color} 14%, var(--surface-1))`,
        border: `1px solid color-mix(in oklab, ${cfg.color} 36%, transparent)`,
        transition: "all var(--d-med) var(--ease-out)",
      }}
    >
      <div style={{ display: "flex", gap: 3 }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{
            width: 7, height: 7, borderRadius: 999,
            background: i < cfg.dots ? cfg.color : "color-mix(in oklab, var(--text-muted) 40%, transparent)",
            boxShadow: i < cfg.dots ? `0 0 6px ${cfg.color}` : "none",
            transition: "all var(--d-med) var(--ease-out)",
          }} />
        ))}
      </div>
      <span style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.4,
        textTransform: "uppercase",
        color: cfg.color,
        whiteSpace: "nowrap",
      }}>{cfg.label}</span>
    </div>
  );
}

/* =================================================================
   Shared chrome — StatusBar, BackHeader
   ================================================================= */

function StatusBar({ status, time = "10:32", progress = null, pillOverride = null }) {
  // status: "idle" | "active" | "wait" | "alert" | "done"
  const pillText = pillOverride ?? ({
    idle:   "Pronto",
    active: "Em Treino",
    wait:   "Aguarde",
    alert:  "Emergência",
    done:   "Concluído",
  }[status] || "");

  return (
    <div className="statusbar">
      <div className="statusbar__left">
        <span>{time}</span>
      </div>

      <div className="statusbar__center">
        {progress !== null ? (
          <div className="progress-line" role="progressbar" aria-valuenow={Math.round(progress * 100)}>
            <div className="progress-line__fill" style={{ width: `${progress * 100}%` }} />
          </div>
        ) : status ? (
          <span className={`status-pill status-pill--${status}`}>
            <span className="status-pill__dot" />
            {pillText}
          </span>
        ) : null}
      </div>

      <div className="statusbar__right">
        <I.Wifi style={{ width: 14, height: 14, opacity: 0.85 }} />
        <span className="battery"><span className="battery__fill" /></span>
      </div>
    </div>
  );
}

function PageHeader({ title, subtitle, onBack, center = true }) {
  return (
    <div className="page__header">
      {onBack && (
        <button className="page__back" onClick={onBack} aria-label="Voltar">
          <I.ChevronLeft />
        </button>
      )}
      <div className={`grow ${center ? "" : ""}`}>
        {subtitle && <div className="page__subtitle">{subtitle}</div>}
        <h1 className={`page__title ${center && onBack ? "page__title--center" : ""}`}>{title}</h1>
      </div>
    </div>
  );
}

/* =================================================================
   1. Login (RFID)
   ================================================================= */
function LoginScreen({ onLogin }) {
  // Auto-advance after a few seconds to simulate scan
  useEffect(() => {
    const t = setTimeout(onLogin, 4200);
    return () => clearTimeout(t);
  }, [onLogin]);

  return (
    <div className="screen-wrap">
      <StatusBar status="idle" />
      <div className="page" style={{ alignItems: "center", justifyContent: "space-between", paddingTop: 8 }}>
        <div style={{ marginTop: 4 }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Smart Gym</div>
          <div style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: 52,
            letterSpacing: 6,
            color: "var(--accent-blue)",
            lineHeight: 1,
          }}>S.H.A.P.E</div>
        </div>

        <div className="rfid" onClick={onLogin} role="button" aria-label="Aproxime a pulseira">
          <div className="rfid__rings" />
          <div className="rfid__core"><I.Rfid /></div>
        </div>

        <div style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: 14, fontWeight: 600, lineHeight: 1.4, maxWidth: 320 }}>
          Aproxime a pulseira da área indicada na recepção
        </div>
      </div>
    </div>
  );
}

/* =================================================================
   2. Principal — Welcome
   ================================================================= */
function PrincipalScreen({ user, onStart }) {
  return (
    <div className="screen-wrap">
      <StatusBar status="idle" />
      <div className="page">
        <div style={{ paddingTop: 4, textAlign: "center" }}>
          <div className="eyebrow">Bem-vindo de volta</div>
          <div style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: 44,
            letterSpacing: -1.5,
            color: "var(--accent-blue)",
            lineHeight: 1,
            marginTop: 4,
          }}>{user.name}</div>
        </div>

        <div className="grow" style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: 12,
          marginTop: 14,
        }}>
          <button onClick={onStart} style={{
            background: "linear-gradient(160deg, var(--surface-2) 0%, var(--surface-1) 100%)",
            border: "1px solid var(--border)",
            borderRadius: "var(--r-card)",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-start",
            textAlign: "left",
            cursor: "pointer",
            transition: "all var(--d-fast) var(--ease-out)",
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = "scale(.98)"}
          onMouseUp={(e) => e.currentTarget.style.transform = ""}
          onMouseLeave={(e) => e.currentTarget.style.transform = ""}
          >
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "color-mix(in oklab, var(--accent-green) 22%, var(--surface-3))", color: "var(--accent-green)", display: "grid", placeItems: "center" }}>
              <I.Dumbbell style={{ width: 24, height: 24 }} />
            </div>
            <div>
              <div className="eyebrow" style={{ textAlign: "left", marginBottom: 4 }}>Hoje</div>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.6 }}>Iniciar Treino</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--accent-green)", fontSize: 13, fontWeight: 700 }}>
              4 exercícios <I.ArrowRight style={{ width: 14, height: 14 }} />
            </div>
          </button>

          <div className="col" style={{ gap: 12 }}>
            <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "12px 14px", minHeight: 84 }}>
              <div className="eyebrow" style={{ textAlign: "left", display: "flex", alignItems: "center", gap: 6 }}>
                <I.Target style={{ width: 12, height: 12 }} /> Objetivo
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: -0.3 }}>Crescimento</div>
            </div>

            <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "12px 14px", minHeight: 84, background: "color-mix(in oklab, var(--accent-amber) 10%, var(--surface-1))", borderColor: "color-mix(in oklab, var(--accent-amber) 28%, transparent)" }}>
              <div className="eyebrow" style={{ textAlign: "left", display: "flex", alignItems: "center", gap: 6, color: "var(--accent-amber)" }}>
                <I.Sparkles style={{ width: 12, height: 12 }} /> Sequência
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5, color: "var(--accent-amber)" }}>7</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.4 }}>dias</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =================================================================
   3. Ficha — Workout list
   ================================================================= */
function FichaScreen({ exercises, onPick, onBack }) {
  const done = exercises.filter(e => e.done).length;
  const total = exercises.length;
  const totalMin = exercises.reduce((s, e) => s + e.minutes, 0);

  return (
    <div className="screen-wrap">
      <StatusBar status="idle" />
      <div className="page">
        <PageHeader title="Treino" subtitle={`${done}/${total} concluídos · ${totalMin} min`} onBack={onBack} />
        <div className="scroll col" style={{ gap: 8 }}>
          {exercises.map((ex, i) => (
            <div
              key={ex.id}
              className={`list-row ${ex.done ? "list-row--done" : ""}`}
              onClick={() => onPick(i)}
              role="button"
            >
              <span className="list-row__time">{ex.minutes}<small style={{ fontSize: 11, opacity: 0.6 }}>min</small></span>
              <span className="list-row__name">{ex.name}</span>
              <span className={`check ${ex.done ? "check--done" : ""}`}><I.Check /></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =================================================================
   4. Exercício — Detail (before & after states)
   ================================================================= */
function ExercicioScreen({ exercise, onStart, onCancel, onBack, completed = false }) {
  return (
    <div className="screen-wrap">
      <StatusBar status="idle" />
      <div className="page">
        <PageHeader title={exercise.name} subtitle={completed ? "Concluído" : "Próximo exercício"} onBack={onBack} />
        <div className="col" style={{ gap: 10, flex: 1 }}>
          <div className="card card--raised" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <I.Clock style={{ width: 20, height: 20, color: "var(--text-muted)" }} />
              <span style={{ fontWeight: 700, fontSize: 18 }}>Duração</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 26, letterSpacing: -0.4 }}>{exercise.minutes}</span>
              <span className="eyebrow">min</span>
            </div>
          </div>

          <div className="card card--raised grow" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div className="eyebrow" style={{ textAlign: "left" }}>Descrição</div>
            <div style={{ fontSize: 17, lineHeight: 1.4, color: "var(--text-secondary)", fontWeight: 500 }}>
              {exercise.description}
            </div>
          </div>

          <div className="row" style={{ marginTop: 4, justifyContent: completed ? "center" : "space-between" }}>
            {completed ? (
              <button className="btn btn--ghost" onClick={onBack}>
                <I.ChevronLeft style={{ width: 16, height: 16 }} /> Voltar
              </button>
            ) : (
              <>
                <button className="btn btn--danger" onClick={onCancel}>Cancelar</button>
                <button className="btn btn--primary" onClick={onStart}>
                  Começar <I.Play style={{ width: 14, height: 14 }} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =================================================================
   5. Atividade — Active workout (live)
   Usability-first: big Demonstração tile + big Terminar button.
   Timer + HR live as compact info on top.
   ================================================================= */
function AtividadeScreen({ exercise, hr, secondsLeft, totalSeconds, forma = "boa", onTerminate }) {
  const [showDemo, setShowDemo] = useState(false);
  const progress = 1 - (secondsLeft / totalSeconds);
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="screen-wrap">
      <StatusBar status="active" progress={progress} />
      <div className="page" style={{ paddingTop: 0, paddingBottom: 12, gap: 10 }}>

        {/* Compact info row: name + forma + timer + HR */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr auto auto",
          alignItems: "center",
          gap: 10,
          padding: "6px 4px 2px",
        }}>
          <div style={{ minWidth: 0 }}>
            <div className="eyebrow" style={{ textAlign: "left", marginBottom: 2, whiteSpace: "nowrap" }}>Exercício</div>
            <div style={{
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: -0.5,
              lineHeight: 1.05,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}>{exercise.name}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <FormaBadge level={forma} />
          </div>
          <div style={{
            fontFamily: "var(--font-mono)",
            fontWeight: 700,
            fontSize: 26,
            lineHeight: 1,
            letterSpacing: -1,
            color: "var(--accent-green)",
            fontVariantNumeric: "tabular-nums",
          }}>
            {mm}<span style={{ opacity: 0.4 }}>:</span>{ss}
          </div>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 10px",
            borderRadius: 999,
            background: "color-mix(in oklab, var(--hr-color) 14%, var(--surface-1))",
            border: "1px solid color-mix(in oklab, var(--hr-color) 32%, transparent)",
          }}>
            <I.Heart style={{ width: 14, height: 14, color: "var(--hr-color)", animation: "heartbeat 1.1s infinite var(--ease-in-out)" }} />
            <span style={{ fontSize: 16, fontWeight: 800, color: "var(--hr-color)", letterSpacing: -0.3 }}>{hr}</span>
          </div>
        </div>

        {/* Demonstração tile — the dominant focus element */}
        <button
          onClick={() => setShowDemo(true)}
          style={{
            flex: 1,
            minHeight: 0,
            border: "1.5px solid var(--border-strong)",
            borderRadius: "var(--r-card)",
            background: "var(--surface-2)",
            padding: 8,
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            transition: "all var(--d-fast) var(--ease-out)",
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = "scale(.98)"}
          onMouseUp={(e) => e.currentTarget.style.transform = ""}
          onMouseLeave={(e) => e.currentTarget.style.transform = ""}
        >
          <div className="exercise-illustration" style={{ flex: 1, minHeight: 0, borderRadius: 12 }}>
            <img src="assets/body.png" alt={exercise.name} />
          </div>
          <div style={{
            position: "absolute",
            top: 14,
            left: 14,
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 12px",
            borderRadius: 999,
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(8px)",
            color: "white",
            fontFamily: "var(--font-action)",
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: 0.6,
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}>
            <I.Play style={{ width: 12, height: 12 }} /> Ampliar
          </div>
        </button>

        {/* Big terminar button */}
        <button className="btn btn--danger btn--xl" onClick={onTerminate} style={{ width: "100%" }}>
          <I.Stop style={{ width: 18, height: 18 }} /> Terminar Treino
        </button>
      </div>

      {/* Demo overlay */}
      {showDemo && (
        <div
          onClick={() => setShowDemo(false)}
          style={{
            position: "absolute", inset: 0, zIndex: 60,
            background: "rgba(0,0,0,0.92)",
            display: "grid",
            gridTemplateRows: "44px 1fr auto",
            padding: "0 20px 18px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-secondary)" }}>{exercise.name} · Demonstração</span>
            <button onClick={() => setShowDemo(false)} style={{ width: 36, height: 36, borderRadius: 999, background: "var(--surface-2)", border: "1px solid var(--border-strong)", color: "white", display: "grid", placeItems: "center", cursor: "pointer" }}>
              <I.X style={{ width: 16, height: 16 }} />
            </button>
          </div>
          <div className="exercise-illustration" style={{ minHeight: 0 }}>
            <img src="assets/body.png" alt={exercise.name} />
          </div>
          <div style={{ textAlign: "center", fontSize: 13, color: "var(--text-muted)", marginTop: 8 }}>
            Toque em qualquer lugar para fechar
          </div>
        </div>
      )}
    </div>
  );
}

/* =================================================================
   6. Encorajamento — animated motivation overlay during activity
   ================================================================= */
function EncorajamentoScreen({ user, exercise, hr, secondsLeft, totalSeconds, onContinue }) {
  // Auto-dismiss
  useEffect(() => {
    const t = setTimeout(onContinue, 3200);
    return () => clearTimeout(t);
  }, [onContinue]);

  const progress = 1 - (secondsLeft / totalSeconds);
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="screen-wrap">
      <StatusBar status="active" progress={progress} />
      <div className="page" style={{ justifyContent: "space-between", paddingTop: 8 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--accent-green)" }}>
            <I.Sparkles style={{ width: 20, height: 20 }} />
            <span style={{
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1.5,
            }}>Você está indo bem</span>
            <I.Sparkles style={{ width: 20, height: 20 }} />
          </div>
          <div className="hero hero--green" style={{ fontSize: 64, letterSpacing: -2.5 }}>
            VOCÊ<br/>CONSEGUE
          </div>
          <div style={{
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: -0.5,
            color: "var(--text-primary)",
          }}>{user.name}</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div className="metric" style={{ padding: "8px 12px" }}>
            <span className="metric__label">{exercise.name}</span>
            <span className="metric__value" style={{ fontSize: 22, color: "var(--text-primary)" }}>Ativo</span>
          </div>
          <div className="metric" style={{ padding: "8px 12px" }}>
            <span className="metric__label">Restante</span>
            <span className="metric__value metric__value--mono" style={{ fontSize: 22, color: "var(--accent-green)" }}>{mm}:{ss}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =================================================================
   7/8. Parabens — completed entire workout
   ================================================================= */
function ParabensScreen({ exercise, onBack }) {
  return (
    <div className="screen-wrap">
      <StatusBar status="done" />
      <div className="page" style={{ alignItems: "center", justifyContent: "space-between", paddingTop: 8 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginTop: 18 }}>
          <div style={{
            width: 64, height: 64,
            borderRadius: 18,
            display: "grid", placeItems: "center",
            background: "color-mix(in oklab, var(--accent-green) 22%, var(--surface-1))",
            color: "var(--accent-green)",
          }}>
            <I.Trophy style={{ width: 36, height: 36 }} />
          </div>
          <div className="hero hero--green" style={{ fontSize: 52 }}>PARABÉNS</div>
          <div className="eyebrow">{exercise.name} · Concluído</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, width: "100%" }}>
          <div className="metric"><span className="metric__label">Duração</span><span className="metric__value" style={{ fontSize: 22 }}>{exercise.minutes}<span className="metric__unit">min</span></span></div>
          <div className="metric"><span className="metric__label">Status</span><span className="metric__value" style={{ fontSize: 22, color: "var(--accent-green)" }}>100%</span></div>
        </div>

        <button className="btn btn--primary" onClick={onBack} style={{ marginTop: 6 }}>
          Voltar à Ficha <I.ChevronRight style={{ width: 14, height: 14 }} />
        </button>
      </div>
    </div>
  );
}

/* =================================================================
   9. Falha — workout incomplete
   ================================================================= */
function FalhaScreen({ exercise, secondsLeft, onRetry, onBack }) {
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="screen-wrap">
      <StatusBar status="alert" />
      <div className="page" style={{ alignItems: "center", justifyContent: "space-between", paddingTop: 8 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginTop: 14 }}>
          <div style={{
            width: 56, height: 56,
            borderRadius: 16,
            display: "grid", placeItems: "center",
            background: "color-mix(in oklab, var(--accent-red) 18%, var(--surface-1))",
            color: "var(--accent-red)",
          }}>
            <I.AlertTriangle style={{ width: 32, height: 32 }} />
          </div>
          <div className="hero-sub" style={{ fontSize: 26 }}>Não concluído</div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center", maxWidth: 320 }}>
            Você interrompeu <strong style={{ color: "var(--text-secondary)" }}>{exercise.name}</strong>. Sem problema — tente novamente quando estiver pronto.
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, width: "100%" }}>
          <div className="metric"><span className="metric__label">Restante</span><span className="metric__value metric__value--mono" style={{ fontSize: 22 }}>{mm}:{ss}</span></div>
          <div className="metric"><span className="metric__label">Próximo passo</span><span className="metric__value" style={{ fontSize: 16, color: "var(--accent-amber)" }}>Descansar</span></div>
        </div>

        <div className="row" style={{ width: "100%", justifyContent: "space-between", marginTop: 4 }}>
          <button className="btn btn--secondary" onClick={onBack}>Sair</button>
          <button className="btn btn--primary" onClick={onRetry}>
            Tentar de novo <I.Play style={{ width: 14, height: 14 }} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* =================================================================
   10. Instrutor — waiting for staff
   ================================================================= */
function InstrutorScreen({ user, onCancel }) {
  return (
    <div className="screen-wrap">
      <StatusBar status="wait" />
      <div className="page" style={{ alignItems: "center", justifyContent: "space-between", paddingTop: 8 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginTop: 18 }}>
          <div style={{
            width: 72, height: 72,
            borderRadius: 50,
            display: "grid", placeItems: "center",
            background: "color-mix(in oklab, var(--accent-amber) 20%, var(--surface-1))",
            color: "var(--accent-amber)",
            position: "relative",
          }}>
            <span style={{
              position: "absolute", inset: -8,
              borderRadius: 50,
              border: "2px solid var(--accent-amber)",
              animation: "ring 1.6s infinite var(--ease-out)",
              opacity: 0.6,
            }} />
            <I.User style={{ width: 36, height: 36 }} />
          </div>
          <div className="hero hero--amber" style={{ fontSize: 48 }}>AGUARDE</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.4 }}>{user.name}</div>
            <div style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4 }}>
              O instrutor foi acionado
            </div>
          </div>
        </div>

        <div className="card" style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 14px" }}>
          <div style={{ width: 6, height: 6, borderRadius: 50, background: "var(--accent-amber)", boxShadow: "0 0 8px var(--accent-amber)" }} />
          <div style={{ flex: 1, fontSize: 12, color: "var(--text-secondary)" }}>
            Tempo médio de resposta: <strong style={{ color: "var(--text-primary)" }}>~2 min</strong>
          </div>
          <button className="btn btn--sm btn--secondary" onClick={onCancel}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

/* =================================================================
   11. Emergencia
   ================================================================= */
function EmergenciaScreen({ user, onCancel }) {
  return (
    <div className="screen-wrap" style={{ background: "linear-gradient(160deg, color-mix(in oklab, var(--accent-red) 18%, #000) 0%, var(--bg) 60%)" }}>
      <StatusBar status="alert" />
      <div className="page" style={{ alignItems: "center", justifyContent: "space-between", paddingTop: 8 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginTop: 14 }}>
          <div style={{
            width: 76, height: 76,
            borderRadius: 50,
            display: "grid", placeItems: "center",
            background: "var(--accent-red)",
            color: "#1A0000",
            position: "relative",
            boxShadow: "0 0 30px color-mix(in oklab, var(--accent-red) 60%, transparent)",
          }}>
            <span style={{
              position: "absolute", inset: -10,
              borderRadius: 50,
              border: "2px solid var(--accent-red)",
              animation: "ring 1.2s infinite var(--ease-out)",
              opacity: 0.8,
            }} />
            <I.Siren style={{ width: 38, height: 38 }} />
          </div>

          <div className="hero hero--red" style={{ fontSize: 46, letterSpacing: -2 }}>EMERGÊNCIA</div>

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.4 }}>{user.name}</div>
            <div style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4 }}>
              Fique calmo — ajuda a caminho
            </div>
          </div>
        </div>

        <div className="card" style={{
          width: "100%",
          background: "color-mix(in oklab, var(--accent-red) 12%, var(--surface-1))",
          borderColor: "color-mix(in oklab, var(--accent-red) 40%, transparent)",
          display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
        }}>
          <I.Phone style={{ width: 18, height: 18, color: "var(--accent-red)" }} />
          <div style={{ flex: 1, fontSize: 12, color: "var(--text-secondary)" }}>
            Equipe e recepção foram <strong style={{ color: "var(--text-primary)" }}>notificadas</strong>
          </div>
          <button className="btn btn--sm btn--secondary" onClick={onCancel}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

/* =================================================================
   12. Incorreto — execution-error feedback
   Amber-tinted background, large warning icon, specific cue text,
   reference illustration, primary "Entendi" CTA. Auto-dismiss.
   ================================================================= */
function IncorretoScreen({ exercise, cue = "Flexione mais os braços", onDismiss }) {
  // Auto-dismiss after 5s
  useEffect(() => {
    const t = setTimeout(onDismiss, 5000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div className="screen-wrap" style={{
      background: "linear-gradient(160deg, color-mix(in oklab, var(--accent-amber) 14%, #000) 0%, var(--bg) 55%)",
    }}>
      <StatusBar status="wait" pillOverride="Corrigir Postura" />
      <div className="page" style={{ paddingTop: 4, paddingBottom: 14, gap: 10 }}>

        {/* Top: warning icon + title */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 4 }}>
          <div style={{
            width: 56, height: 56,
            borderRadius: 16,
            display: "grid", placeItems: "center",
            background: "color-mix(in oklab, var(--accent-amber) 22%, var(--surface-1))",
            color: "var(--accent-amber)",
            position: "relative",
            flexShrink: 0,
          }}>
            <span style={{
              position: "absolute", inset: -8,
              borderRadius: 18,
              border: "2px solid var(--accent-amber)",
              animation: "ring 1.8s infinite var(--ease-out)",
              opacity: 0.5,
            }} />
            <I.AlertTriangle style={{ width: 30, height: 30 }} />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="eyebrow" style={{ textAlign: "left", marginBottom: 4, color: "var(--accent-amber)" }}>
              {exercise?.name || "Exercício"} · Atenção
            </div>
            <div style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 28,
              letterSpacing: -0.8,
              lineHeight: 1,
              color: "var(--accent-amber)",
            }}>EXECUÇÃO<br/>INCORRETA</div>
          </div>
        </div>

        {/* Cue card — the specific correction */}
        <div className="card card--raised" style={{
          display: "flex",
          gap: 14,
          padding: "14px 16px",
          alignItems: "center",
          borderColor: "color-mix(in oklab, var(--accent-amber) 32%, transparent)",
          background: "color-mix(in oklab, var(--accent-amber) 8%, var(--surface-1))",
        }}>
          <div style={{ width: 70, height: 70, borderRadius: 12, overflow: "hidden", flexShrink: 0 }}>
            <div className="exercise-illustration" style={{ width: "100%", height: "100%" }}>
              <img src="assets/body.png" alt={exercise?.name || "Exercício"} />
            </div>
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="eyebrow" style={{ textAlign: "left", marginBottom: 4 }}>Corrija</div>
            <div style={{
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: -0.2,
              color: "var(--text-primary)",
              lineHeight: 1.25,
            }}>{cue}</div>
          </div>
        </div>

        {/* CTA */}
        <button className="btn btn--primary btn--xl" onClick={onDismiss} style={{ width: "100%" }}>
          <I.Check style={{ width: 18, height: 18 }} /> Entendi
        </button>
      </div>
    </div>
  );
}

window.Screens = {
  LoginScreen, PrincipalScreen, FichaScreen, ExercicioScreen,
  AtividadeScreen, EncorajamentoScreen, ParabensScreen, FalhaScreen,
  InstrutorScreen, EmergenciaScreen, IncorretoScreen,
  StatusBar, PageHeader, FormaBadge,
};
