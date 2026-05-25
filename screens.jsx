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
        gap: 10,
        padding: "8px 14px",
        borderRadius: 999,
        background: `color-mix(in oklab, ${cfg.color} 14%, var(--surface-1))`,
        border: `1px solid color-mix(in oklab, ${cfg.color} 36%, transparent)`,
        transition: "all var(--d-med) var(--ease-out)",
      }}
    >
      <div style={{ display: "flex", gap: 4 }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{
            width: 9, height: 9, borderRadius: 999,
            background: i < cfg.dots ? cfg.color : "color-mix(in oklab, var(--text-muted) 40%, transparent)",
            boxShadow: i < cfg.dots ? `0 0 6px ${cfg.color}` : "none",
            transition: "all var(--d-med) var(--ease-out)",
          }} />
        ))}
      </div>
      <span style={{
        fontSize: 14,
        fontWeight: 800,
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

        <div className="rfid" onClick={onLogin} role="button" aria-label="Toque para entrar" style={{ cursor: "pointer" }}>
          <div className="rfid__rings" />
          <div className="rfid__core"><I.Rfid /></div>
        </div>

        <div style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: 19, fontWeight: 600, lineHeight: 1.35, maxWidth: 360 }}>
          Toque para entrar com sua pulseira
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
            background: "linear-gradient(160deg, var(--accent-green) 0%, color-mix(in oklab, var(--accent-green) 75%, #000) 100%)",
            border: "none",
            borderRadius: "var(--r-card)",
            padding: "14px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-start",
            textAlign: "left",
            cursor: "pointer",
            transition: "all var(--d-fast) var(--ease-out)",
            color: "#00200E",
            boxShadow: "0 8px 22px -10px var(--accent-green), inset 0 1px 0 rgba(255,255,255,0.2)",
            position: "relative",
            overflow: "hidden",
            gap: 6,
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = "scale(.98)"}
          onMouseUp={(e) => e.currentTarget.style.transform = ""}
          onMouseLeave={(e) => e.currentTarget.style.transform = ""}
          >
            <div style={{ width: 40, height: 40, borderRadius: 11, background: "rgba(0, 32, 14, 0.22)", color: "#00200E", display: "grid", placeItems: "center" }}>
              <I.Dumbbell style={{ width: 24, height: 24 }} />
            </div>
            <div>
              <div style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 1.2,
                textTransform: "uppercase",
                opacity: 0.7,
                marginBottom: 2,
              }}>Hoje</div>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.6, lineHeight: 1, whiteSpace: "nowrap" }}>Iniciar Treino</div>
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              fontSize: 12, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase",
              background: "rgba(0, 32, 14, 0.22)",
              padding: "5px 10px",
              borderRadius: 999,
              alignSelf: "flex-start",
              whiteSpace: "nowrap",
            }}>
              4 exercícios <I.ArrowRight style={{ width: 12, height: 12 }} />
            </div>
          </button>

          <div className="col" style={{ gap: 12 }}>
            <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "12px 14px", minHeight: 84 }}>
              <div className="eyebrow" style={{ textAlign: "left", display: "flex", alignItems: "center", gap: 6 }}>
                <I.Target style={{ width: 14, height: 14 }} /> Objetivo
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.3 }}>Crescimento</div>
            </div>

            <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "12px 14px", minHeight: 84, background: "color-mix(in oklab, var(--accent-amber) 10%, var(--surface-1))", borderColor: "color-mix(in oklab, var(--accent-amber) 28%, transparent)" }}>
              <div className="eyebrow" style={{ textAlign: "left", display: "flex", alignItems: "center", gap: 6, color: "var(--accent-amber)" }}>
                <I.Sparkles style={{ width: 14, height: 14 }} /> Sequência
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, color: "var(--accent-amber)" }}>7</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: 0.4 }}>dias</span>
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
function FichaScreen({ exercises, onPick, onBack, onFinish }) {
  const done = exercises.filter(e => e.done).length;
  const total = exercises.length;
  const anyDone = done > 0;

  return (
    <div className="screen-wrap">
      <StatusBar status="idle" />
      <div className="page">
        <PageHeader title="Treino" onBack={onBack} />
        <div className="scroll col" style={{ gap: 8 }}>
          {exercises.map((ex, i) => (
            <div
              key={ex.id}
              className={`list-row ${ex.done ? "list-row--done" : ""}`}
              onClick={() => onPick(i)}
              role="button"
            >
              <span className="list-row__time">{ex.minutes}<small style={{ fontSize: 13, opacity: 0.7, marginLeft: 2 }}>min</small></span>
              <span className="list-row__name">{ex.name}</span>
              <span className={`check ${ex.done ? "check--done" : ""}`}><I.Check /></span>
            </div>
          ))}
        </div>
        {anyDone && (
          <button
            className="btn btn--primary"
            onClick={onFinish}
            style={{ width: "100%", marginTop: 10, flexShrink: 0 }}>
            Encerrar Treino <I.ArrowRight style={{ width: 16, height: 16 }} />
          </button>
        )}
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
        <PageHeader title={exercise.name} onBack={onBack} />
        <div className="col" style={{ gap: 10, flex: 1 }}>
          {completed ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "2px 4px 0" }}>
              <I.Clock style={{ width: 16, height: 16, color: "var(--text-muted)" }} />
              <span style={{ fontSize: 16, fontWeight: 700, color: "var(--text-secondary)" }}>
                <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>{exercise.minutes}</span> min
              </span>
            </div>
          ) : (
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
          )}

          <div className="card card--raised grow" style={{ display: "flex", flexDirection: "column", gap: 8, minHeight: 0, overflow: "hidden" }}>
            <div className="eyebrow" style={{ textAlign: "left" }}>Descrição</div>
            <div className="scroll" style={{ fontSize: 19, lineHeight: 1.4, color: "var(--text-secondary)", fontWeight: 500, paddingRight: 4 }}>
              {exercise.description}
            </div>
          </div>

          <div className="row" style={{ marginTop: 2, marginBottom: 4, justifyContent: completed ? "center" : "space-between", flexShrink: 0 }}>
            {completed ? (
              <button className="btn btn--secondary" onClick={onBack}>
                <I.ChevronLeft style={{ width: 16, height: 16 }} /> Voltar
              </button>
            ) : (
              <>
                <button className="btn btn--neutral" onClick={onCancel}>Cancelar</button>
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
function AtividadeScreen({ exercise, hr, secondsLeft, totalSeconds, forma = "boa", onTerminate, onConclude }) {
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
          gap: 12,
          padding: "4px 4px 0",
        }}>
          <div style={{
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: -0.5,
            lineHeight: 1,
            whiteSpace: "nowrap",
          }}>{exercise.name}</div>
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
            <I.Heart style={{ width: 16, height: 16, color: "var(--hr-color)", animation: "heartbeat 1.1s infinite var(--ease-in-out)" }} />
            <span style={{ fontSize: 18, fontWeight: 800, color: "var(--hr-color)", letterSpacing: -0.3 }}>{hr}</span>
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
            padding: "7px 13px",
            borderRadius: 999,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(8px)",
            color: "white",
            fontFamily: "var(--font-action)",
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: 0.6,
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}>
            <I.Play style={{ width: 13, height: 13 }} /> Ampliar
          </div>
        </button>

        {/* Bottom action: changes based on timer */}
        {secondsLeft === 0 ? (
          <button className="btn btn--primary" onClick={onConclude} style={{ alignSelf: "center" }}>
            <I.Check style={{ width: 16, height: 16 }} /> Concluir Exercício
          </button>
        ) : (
          <button className="btn btn--neutral" onClick={onTerminate} style={{ alignSelf: "center" }}>
            <I.Stop style={{ width: 16, height: 16 }} /> Terminar Exercício
          </button>
        )}
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
          <div style={{ textAlign: "center", fontSize: 15, color: "var(--text-secondary)", marginTop: 10, fontWeight: 500 }}>
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
  const progress = 1 - (secondsLeft / totalSeconds);
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="screen-wrap">
      <StatusBar status="active" progress={progress} />
      <div className="page" style={{ justifyContent: "space-between", paddingTop: 6 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--accent-green)" }}>
            <I.Sparkles style={{ width: 20, height: 20 }} />
            <span style={{
              fontSize: 14,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: 1.5,
            }}>Você está indo bem</span>
            <I.Sparkles style={{ width: 20, height: 20 }} />
          </div>
          <div className="hero hero--green" style={{ fontSize: 56, letterSpacing: -2.5 }}>
            VOCÊ<br/>CONSEGUE
          </div>
          <div style={{
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: -0.5,
            color: "var(--text-primary)",
          }}>{user.name}</div>
        </div>

        <button className="btn btn--primary" onClick={onContinue} style={{ width: "100%" }}>
          Continuar treino <I.ArrowRight style={{ width: 16, height: 16 }} />
        </button>
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
      <div className="page" style={{ alignItems: "center", justifyContent: "space-between", paddingTop: 4, gap: 8 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, marginTop: 4 }}>
          <div style={{
            width: 56, height: 56,
            borderRadius: 16,
            display: "grid", placeItems: "center",
            background: "color-mix(in oklab, var(--accent-green) 22%, var(--surface-1))",
            color: "var(--accent-green)",
          }}>
            <I.Trophy style={{ width: 30, height: 30 }} />
          </div>
          <div className="hero hero--green" style={{ fontSize: 42 }}>PARABÉNS</div>
          <div className="eyebrow" style={{ fontSize: 13 }}>{exercise.name} concluído</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, width: "100%" }}>
          <div className="metric"><span className="metric__label">Duração</span><span className="metric__value" style={{ fontSize: 22 }}>{exercise.minutes}<span className="metric__unit">min</span></span></div>
          <div className="metric"><span className="metric__label">Status</span><span className="metric__value" style={{ fontSize: 22, color: "var(--accent-green)" }}>100%</span></div>
        </div>

        <button className="btn btn--primary" onClick={onBack} style={{ width: "100%" }}>
          Voltar à Ficha <I.ChevronRight style={{ width: 14, height: 14 }} />
        </button>
      </div>
    </div>
  );
}

/* =================================================================
   9. Falha — workout incomplete
   ================================================================= */
function FalhaScreen({ exercise, secondsLeft, onRetry, onChangeExercise, onFinishSession }) {
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const total = exercise.minutes * 60;
  const completed = total - secondsLeft;
  const pct = Math.max(0, Math.min(100, Math.round((completed / total) * 100)));
  const cMin = Math.floor(completed / 60);
  const cSec = String(completed % 60).padStart(2, "0");

  // Ring geometry
  const R = 44;
  const C = 2 * Math.PI * R;
  const dash = (pct / 100) * C;

  return (
    <div className="screen-wrap">
      <StatusBar status="idle" pillOverride="Interrompido" />
      <div className="page" style={{ alignItems: "center", justifyContent: "space-between", paddingTop: 4, paddingBottom: 14, gap: 6 }}>

        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, alignSelf: "stretch" }}>
          <div style={{
            width: 44, height: 44,
            borderRadius: 12,
            display: "grid", placeItems: "center",
            background: "var(--surface-2)",
            color: "var(--text-secondary)",
            border: "1.5px solid var(--border-strong)",
            flexShrink: 0,
          }}>
            <I.Pause style={{ width: 22, height: 22 }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="hero-sub" style={{ fontSize: 26, color: "var(--text-primary)", textAlign: "left", lineHeight: 1 }}>Treino pausado</div>
            <div style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.3, fontWeight: 600, marginTop: 3 }}>
              <strong style={{ color: "var(--text-primary)" }}>{exercise.name}</strong>
            </div>
          </div>
        </div>

        {/* Big progress ring with stats */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          alignItems: "center",
          gap: 18,
          padding: "0 4px",
          alignSelf: "stretch",
        }}>
          <div style={{ position: "relative", width: 110, height: 110 }}>
            <svg width="110" height="110" viewBox="0 0 110 110" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="55" cy="55" r={R} fill="none" stroke="var(--surface-3)" strokeWidth="9" />
              <circle
                cx="55" cy="55" r={R}
                fill="none"
                stroke="var(--accent-amber)"
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={`${dash} ${C}`}
                style={{ transition: "stroke-dasharray var(--d-slow) var(--ease-out)" }}
              />
            </svg>
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: 0,
            }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 800, color: "var(--accent-amber)", letterSpacing: -1, lineHeight: 1 }}>{pct}<span style={{ fontSize: 18 }}>%</span></span>
              <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", letterSpacing: 1, textTransform: "uppercase", marginTop: 2 }}>concluído</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div>
              <div className="eyebrow" style={{ textAlign: "left", marginBottom: 4 }}>Feito</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 700, color: "var(--text-primary)", letterSpacing: -0.5, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
                {cMin}:{cSec}
              </div>
            </div>
            <div>
              <div className="eyebrow" style={{ textAlign: "left", marginBottom: 4 }}>Restante</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 700, color: "var(--text-secondary)", letterSpacing: -0.5, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
                {mm}:{ss}
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="col" style={{ width: "100%", gap: 8, flexShrink: 0 }}>
          <button className="btn btn--primary" onClick={onRetry} style={{ width: "100%" }}>
            <I.Play style={{ width: 16, height: 16 }} /> Tentar de novo
          </button>
          <div className="row" style={{ width: "100%", gap: 8 }}>
            <button className="btn btn--neutral" onClick={onChangeExercise} style={{ flex: 1, paddingLeft: 12, paddingRight: 12 }}>
              Trocar
            </button>
            <button className="btn btn--neutral" onClick={onFinishSession} style={{ flex: 1, paddingLeft: 12, paddingRight: 12 }}>
              Encerrar
            </button>
          </div>
        </div>
      </div>
    </div>);

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
            <div style={{ fontSize: 16, color: "var(--text-secondary)", marginTop: 4, fontWeight: 500 }}>
              O instrutor foi acionado
            </div>
          </div>
        </div>

        <div className="card" style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 14px" }}>
          <div style={{ width: 8, height: 8, borderRadius: 50, background: "var(--accent-amber)", boxShadow: "0 0 8px var(--accent-amber)" }} />
          <div style={{ flex: 1, fontSize: 14, color: "var(--text-secondary)", fontWeight: 500 }}>
            Tempo médio: <strong style={{ color: "var(--text-primary)" }}>~2 min</strong>
          </div>
          <button className="btn btn--sm btn--neutral" onClick={onCancel}>Cancelar</button>
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
            <div style={{ fontSize: 16, color: "var(--text-secondary)", marginTop: 4, fontWeight: 500 }}>
              Fique calmo — ajuda a caminho
            </div>
          </div>
        </div>

        <div className="card" style={{
          width: "100%",
          background: "color-mix(in oklab, var(--accent-red) 12%, var(--surface-1))",
          borderColor: "color-mix(in oklab, var(--accent-red) 40%, transparent)",
          display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
        }}>
          <I.Phone style={{ width: 20, height: 20, color: "var(--accent-red)" }} />
          <div style={{ flex: 1, fontSize: 14, color: "var(--text-secondary)", fontWeight: 500 }}>
            Equipe <strong style={{ color: "var(--text-primary)" }}>notificada</strong>
          </div>
          <button className="btn btn--sm btn--neutral" onClick={onCancel}>Cancelar</button>
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
  // Visual countdown only — does NOT auto-dismiss
  const [countdown, setCountdown] = useState(10);
  useEffect(() => {
    if (countdown <= 0) return;
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [countdown]);

  return (
    <div className="screen-wrap" style={{
      background: "linear-gradient(160deg, color-mix(in oklab, var(--accent-amber) 14%, #000) 0%, var(--bg) 55%)",
    }}>
      <StatusBar status="wait" pillOverride="Corrigir Postura" />
      <div className="page" style={{ paddingTop: 4, paddingBottom: 14, gap: 10 }}>

        {/* Top: warning icon + title */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 6 }}>
          <div style={{
            width: 64, height: 64,
            borderRadius: 18,
            display: "grid", placeItems: "center",
            background: "color-mix(in oklab, var(--accent-amber) 22%, var(--surface-1))",
            color: "var(--accent-amber)",
            position: "relative",
            flexShrink: 0,
          }}>
            <span style={{
              position: "absolute", inset: -8,
              borderRadius: 20,
              border: "2px solid var(--accent-amber)",
              animation: "ring 1.8s infinite var(--ease-out)",
              opacity: 0.5,
            }} />
            <I.AlertTriangle style={{ width: 34, height: 34 }} />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 34,
              letterSpacing: -1,
              lineHeight: 0.95,
              color: "var(--accent-amber)",
            }}>EXECUÇÃO<br/>INCORRETA</div>
          </div>
        </div>

        {/* Cue card — the specific correction */}
        <div className="card card--raised grow" style={{
          display: "flex",
          gap: 16,
          padding: "16px 18px",
          alignItems: "center",
          borderColor: "color-mix(in oklab, var(--accent-amber) 32%, transparent)",
          background: "color-mix(in oklab, var(--accent-amber) 8%, var(--surface-1))",
          minHeight: 0,
        }}>
          <div style={{ width: 110, height: 110, borderRadius: 14, overflow: "hidden", flexShrink: 0 }}>
            <div className="exercise-illustration" style={{ width: "100%", height: "100%" }}>
              <img src="assets/body.png" alt={exercise?.name || "Exercício"} />
            </div>
          </div>
          <div style={{ minWidth: 0, flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: -0.3,
              color: "var(--text-primary)",
              lineHeight: 1.2,
            }}>{cue}</div>
            <div style={{
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 0.8,
              textTransform: "uppercase",
              color: "var(--accent-amber)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--accent-amber)", animation: "pulse 1.2s infinite var(--ease-in-out)" }} />
              {countdown > 0 ? `Retomando em ${countdown}s` : "Toque \"Entendi\" para continuar"}
            </div>
          </div>
        </div>

        {/* CTA */}
        <button className="btn btn--primary" onClick={onDismiss} style={{ width: "100%" }}>
          <I.Check style={{ width: 16, height: 16 }} /> Entendi
        </button>
      </div>
    </div>
  );
}

/* =================================================================
   13. Treino Concluído — full session, all exercises done
   ================================================================= */
function TreinoConcluidoScreen({ stats, onBack }) {
  return (
    <div className="screen-wrap" style={{
      background: "linear-gradient(160deg, color-mix(in oklab, var(--accent-green) 14%, #000) 0%, var(--bg) 55%)",
    }}>
      <StatusBar status="done" pillOverride="Treino Completo" />
      <div className="page" style={{ paddingTop: 2, gap: 10 }}>
        <div style={{ textAlign: "center", marginTop: 4 }}>
          <div style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: 38,
            letterSpacing: -1.2,
            lineHeight: 0.95,
            color: "var(--accent-green)",
          }}>TREINO<br/>CONCLUÍDO</div>
        </div>

        <div className="grow" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, minHeight: 0 }}>
          <CompletionStat label="Calorias" value={stats.calories} unit="kcal" color="var(--accent-amber)" />
          <CompletionStat label="BPM médio" value={stats.avgHr}    unit="bpm"  color="var(--hr-color)" />
          <CompletionStat label="Duração"  value={stats.duration} unit="min"  color="var(--accent-green)" />
        </div>

        <button className="btn btn--primary" onClick={onBack} style={{ width: "100%" }}>
          <I.Check style={{ width: 16, height: 16 }} /> Finalizar
        </button>
      </div>
    </div>
  );
}

/* =================================================================
   14. Treino Incompleto — session ended with exercises unfinished
   ================================================================= */
function TreinoIncompletoScreen({ stats, done, total, onBack }) {
  return (
    <div className="screen-wrap">
      <StatusBar status="idle" pillOverride="Treino Parcial" />
      <div className="page" style={{ paddingTop: 2, gap: 10 }}>
        <div style={{ textAlign: "center", marginTop: 4 }}>
          <div style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: 28,
            letterSpacing: -0.8,
            lineHeight: 1,
            color: "var(--accent-blue)",
          }}>Um passo de cada vez</div>
          <div style={{
            fontSize: 16,
            fontWeight: 600,
            color: "var(--text-secondary)",
            marginTop: 8,
            lineHeight: 1.35,
          }}>
            Você concluiu <strong style={{ color: "var(--text-primary)" }}>{done} de {total}</strong> exercícios. Continue assim!
          </div>
        </div>

        <div className="grow" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, minHeight: 0 }}>
          <CompletionStat label="Calorias" value={stats.calories} unit="kcal" color="var(--accent-amber)" />
          <CompletionStat label="BPM médio" value={stats.avgHr}    unit="bpm"  color="var(--hr-color)" />
          <CompletionStat label="Duração"  value={stats.duration} unit="min"  color="var(--accent-green)" />
        </div>

        <button className="btn btn--primary" onClick={onBack} style={{ width: "100%" }}>
          <I.Check style={{ width: 16, height: 16 }} /> Finalizar
        </button>
      </div>
    </div>
  );
}

function CompletionStat({ label, value, unit, color }) {
  return (
    <div className="card" style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: 4,
      padding: "12px 8px",
      background: `color-mix(in oklab, ${color} 8%, var(--surface-1))`,
      borderColor: `color-mix(in oklab, ${color} 28%, transparent)`,
    }}>
      <div style={{
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: 0.6,
        textTransform: "uppercase",
        color: "var(--text-muted)",
        textAlign: "center",
      }}>{label}</div>
      <div style={{
        fontFamily: "var(--font-display)",
        fontWeight: 800,
        fontSize: 42,
        letterSpacing: -2,
        lineHeight: 1,
        color: color,
      }}>{value}</div>
      <div style={{
        fontSize: 12,
        fontWeight: 700,
        color: "var(--text-muted)",
        textTransform: "uppercase",
        letterSpacing: 0.4,
      }}>{unit}</div>
    </div>
  );
}

window.Screens = {
  LoginScreen, PrincipalScreen, FichaScreen, ExercicioScreen,
  AtividadeScreen, EncorajamentoScreen, ParabensScreen, FalhaScreen,
  InstrutorScreen, EmergenciaScreen, IncorretoScreen,
  TreinoConcluidoScreen, TreinoIncompletoScreen,
  StatusBar, PageHeader, FormaBadge,
};
