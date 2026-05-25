/* global React, ReactDOM, I, Screens, TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakToggle, TweakSelect */

const { useState, useEffect, useRef, useCallback, useMemo } = React;
const {
  LoginScreen, PrincipalScreen, FichaScreen, ExercicioScreen,
  AtividadeScreen, EncorajamentoScreen, ParabensScreen, FalhaScreen,
  InstrutorScreen, EmergenciaScreen, IncorretoScreen,
  TreinoConcluidoScreen, TreinoIncompletoScreen,
} = Screens;

/* =================================================================
   Data
   ================================================================= */
const USER = { name: "ADJAILSON", goal: "Crescimento" };

const initialExercises = [
{ id: "peito", name: "Peito", minutes: 25, done: false, description: "Supino reto, supino inclinado, crucifixo. Mantenha postura firme e respiração controlada durante cada série." },
{ id: "costas", name: "Costas", minutes: 25, done: false, description: "Puxada alta, remada baixa, pulldown unilateral. Foque no engajamento da escápula a cada repetição." },
{ id: "biceps", name: "Bíceps", minutes: 15, done: false, description: "Rosca direta, rosca alternada, rosca martelo. Movimento controlado, evite balanceio." },
{ id: "cardio", name: "Cardio", minutes: 20, done: false, description: "20 minutos contínuos em esteira ou bike. Mantenha frequência alvo entre 130–150 BPM." }];


const ALL_SCREENS = [
"login", "principal", "ficha", "exercicio", "atividade",
"encorajamento", "incorreto", "completo", "parabens", "falha",
"treino-concluido", "treino-incompleto",
"instrutor", "emergencia"];


const SCREEN_LABELS = {
  login: "01 · Login (RFID)",
  principal: "02 · Principal",
  ficha: "03 · Ficha",
  exercicio: "04 · Exercício (Detail)",
  atividade: "05 · Atividade (Active)",
  encorajamento: "06 · Encorajamento",
  incorreto: "07 · Execução Incorreta",
  completo: "08 · Exercício Completo",
  parabens: "09 · Parabéns",
  falha: "10 · Falha",
  "treino-concluido":  "11 · Treino Concluído",
  "treino-incompleto": "12 · Treino Incompleto",
  instrutor: "13 · Instrutor",
  emergencia: "14 · Emergência"
};

const INCORRETO_CUES = {
  peito:  "Mantenha os cotovelos alinhados e desça com controle",
  costas: "Flexione mais os braços e contraia a escapula",
  biceps: "Não balance o corpo — isole o movimento",
  cardio: "Aumente a cadência — mantém a postura ereta",
};

/* =================================================================
   Tweak defaults
   ================================================================= */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "refined",
  "showFrame": true,
  "showLabel": true,
  "autoCycle": false
} /*EDITMODE-END*/;

/* =================================================================
   Heart-rate + timer hooks
   ================================================================= */
function useFakeHR(active) {
  const [hr, setHR] = useState(82);
  useEffect(() => {
    if (!active) {setHR(82);return;}
    const id = setInterval(() => {
      setHR((h) => {
        const drift = (Math.random() - 0.5) * 4;
        return Math.max(110, Math.min(160, Math.round(h + drift + 0.4)));
      });
    }, 900);
    return () => clearInterval(id);
  }, [active]);
  return hr;
}

function useTimer(active, total, onComplete) {
  const [left, setLeft] = useState(total);
  useEffect(() => {setLeft(total);}, [total]);
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {clearInterval(id);onComplete && onComplete();return 0;}
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [active, total]);
  return [left, setLeft];
}

/* =================================================================
   App
   ================================================================= */
function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [screen, setScreen] = useState("login");
  const [exercises, setExercises] = useState(initialExercises);
  const [activeIdx, setActiveIdx] = useState(0);
  const [forma, setForma] = useState("boa");
  const [toast, setToast] = useState(null);

  const active = exercises[activeIdx] || exercises[0];
  const totalSeconds = active ? active.minutes * 60 : 600;
  const isActive = screen === "atividade" || screen === "encorajamento";
  const hr = useFakeHR(isActive);
  const [secondsLeft, setSecondsLeft] = useTimer(screen === "atividade", totalSeconds, null);

  // Forma quality simulation — drifts naturally during activity (no auto-nav)
  useEffect(() => {
    if (screen !== "atividade") {setForma("boa");return;}
    const seq = ["boa", "excelente", "boa", "atencao", "boa", "excelente", "atencao", "boa"];
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % seq.length;
      setForma(seq[i]);
    }, 6500);
    return () => clearInterval(id);
  }, [screen]);

  // Toast helper
  const showToast = useCallback((msg, ms = 1600) => {
    setToast(msg);
    setTimeout(() => setToast(null), ms);
  }, []);

  // Navigation handlers
  const goto = setScreen;
  const onPickExercise = (i) => {setActiveIdx(i);setScreen("exercicio");};
  const onStartExercise = () => {setSecondsLeft(totalSeconds);setScreen("atividade");};
  const onTerminate = () => setScreen("falha");
  const onConclude = () => {
    // Mark current exercise done + go to parabens
    setExercises((es) => es.map((e, i) => i === activeIdx ? { ...e, done: true } : e));
    setScreen("parabens");
  };
  const onRetry = () => {setSecondsLeft(totalSeconds);setScreen("atividade");};
  const onBackToFicha = () => setScreen("ficha");
  const onFinishWorkout = () => {
    const doneCount = exercises.filter((e) => e.done).length;
    setScreen(doneCount === exercises.length ? "treino-concluido" : "treino-incompleto");
  };

  // Workout stats (mock based on done exercises)
  const workoutStats = useMemo(() => {
    const doneList = exercises.filter((e) => e.done);
    // Seed mock values when navigating directly to completion screens (demo)
    if (doneList.length === 0 && (screen === "treino-concluido" || screen === "treino-incompleto")) {
      const allMin = exercises.reduce((s, e) => s + e.minutes, 0);
      const dur = screen === "treino-concluido" ? allMin : Math.round(allMin * 0.55);
      return { duration: dur, calories: Math.round(dur * 7.4), avgHr: 138 };
    }
    const duration = doneList.reduce((s, e) => s + e.minutes, 0);
    const calories = Math.round(duration * 7.4); // ~7.4 kcal/min mock
    const avgHr = doneList.length ? 132 + (doneList.length % 4) * 3 : 0;
    return { duration, calories, avgHr };
  }, [exercises, screen]);

  // Mock-time for testing / completed view: jump preview
  const viewCompletedExercise = useMemo(() => ({
    ...active, done: true
  }), [active]);

  /* ─── Keyboard nav for prototype tour ─── */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") cycleScreen(-1);
      if (e.key === "ArrowRight") cycleScreen(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const cycleScreen = (dir) => {
    const i = ALL_SCREENS.indexOf(screen);
    const ni = (i + dir + ALL_SCREENS.length) % ALL_SCREENS.length;
    setScreen(ALL_SCREENS[ni]);
  };

  /* ─── Auto cycle for demo (off by default) ─── */
  useEffect(() => {
    if (!tweaks.autoCycle) return;
    const id = setInterval(() => cycleScreen(1), 4500);
    return () => clearInterval(id);
  }, [tweaks.autoCycle, screen]);

  /* ─── Apply theme ─── */
  useEffect(() => {
    document.documentElement.dataset.theme = tweaks.theme;
  }, [tweaks.theme]);

  /* ─── Render current screen ─── */
  let body;
  switch (screen) {
    case "login":
      body = <LoginScreen onLogin={() => goto("principal")} />;
      break;
    case "principal":
      body = <PrincipalScreen user={USER} onStart={() => goto("ficha")} />;
      break;
    case "ficha":
      body = <FichaScreen exercises={exercises} onPick={onPickExercise} onBack={() => goto("principal")} onFinish={onFinishWorkout} />;
      break;
    case "exercicio":
      body = <ExercicioScreen exercise={active} onStart={onStartExercise} onCancel={() => goto("ficha")} onBack={() => goto("ficha")} />;
      break;
    case "atividade":
      body = <AtividadeScreen
        exercise={active}
        hr={hr}
        secondsLeft={secondsLeft}
        totalSeconds={totalSeconds}
        forma={forma}
        onTerminate={onTerminate}
        onConclude={onConclude} />;

      break;
    case "incorreto":
      body = <IncorretoScreen
        exercise={active}
        cue={INCORRETO_CUES[active.id] || "Ajuste a postura e mantenha o controle"}
        onDismiss={() => { setForma("boa"); setScreen("atividade"); }} />;
      break;
    case "encorajamento":
      body = <EncorajamentoScreen
        user={USER}
        exercise={active}
        hr={hr}
        secondsLeft={secondsLeft}
        totalSeconds={totalSeconds}
        onContinue={() => goto("atividade")} />;

      break;
    case "completo":
      body = <ExercicioScreen exercise={viewCompletedExercise} completed onBack={() => goto("ficha")} />;
      break;
    case "parabens":
      body = <ParabensScreen exercise={active} onBack={onBackToFicha} />;
      break;
    case "falha":
      body = <FalhaScreen
        exercise={active}
        secondsLeft={secondsLeft}
        onRetry={onRetry}
        onChangeExercise={onBackToFicha}
        onFinishSession={onFinishWorkout} />;
      break;
    case "instrutor":
      body = <InstrutorScreen user={USER} onCancel={() => goto("principal")} />;
      break;
    case "emergencia":
      body = <EmergenciaScreen user={USER} onCancel={() => goto("principal")} />;
      break;
    case "treino-concluido":
      body = <TreinoConcluidoScreen stats={workoutStats} onBack={() => { setExercises(initialExercises); goto("principal"); }} />;
      break;
    case "treino-incompleto":
      body = <TreinoIncompletoScreen
        stats={workoutStats}
        done={exercises.filter((e) => e.done).length}
        total={exercises.length}
        onBack={() => { setExercises(initialExercises); goto("principal"); }} />;
      break;
    default:
      body = null;
  }

  // Compute scale to fit viewport
  const stageRef = useRef(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const compute = () => {
      const pad = 48;
      const frameW = tweaks.showFrame ? 446 + 52 : 446;
      const frameH = tweaks.showFrame ? 374 + 52 : 374;
      const w = (window.innerWidth - pad) / frameW;
      const h = (window.innerHeight - pad) / frameH;
      setScale(Math.min(1.6, Math.min(w, h)));
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [tweaks.showFrame]);

  return (
    <div className="stage" ref={stageRef}>
      {/* prev / next arrows */}
      <button className="cycle-arrow cycle-arrow--left" onClick={() => cycleScreen(-1)} aria-label="Tela anterior">
        <I.ChevronLeft />
      </button>
      <button className="cycle-arrow cycle-arrow--right" onClick={() => cycleScreen(1)} aria-label="Próxima tela">
        <I.ChevronRight />
      </button>

      <div style={{ transform: `scale(${scale})`, transformOrigin: "center" }}>
        <div className="watch" data-frame={tweaks.showFrame ? "on" : "off"}>
          {tweaks.showFrame &&
          <>
              <span className="watch__strap-top" />
              <span className="watch__strap-bot" />
              <button
                className="watch__crown"
                data-label="SOS"
                aria-label="Emergência (botão físico)"
                onClick={() => goto("emergencia")}
              />
              <button
                className="watch__btn"
                data-label="Instrutor"
                aria-label="Chamar instrutor (botão físico)"
                onClick={() => goto("instrutor")}
              />
            </>
          }
          <div className="screen" data-screen-label={SCREEN_LABELS[screen]}>
            {body}
            {toast && <div className="toast">{toast}</div>}
          </div>
        </div>
      </div>

      {tweaks.showLabel &&
      <div className="screen-label">
          {SCREEN_LABELS[screen]}  ·  ← →
        </div>
      }

      {/* Tweaks panel */}
      <TweaksPanel>
        <TweakSection title="Aparência">
          <TweakRadio
            label="Tema"
            value={tweaks.theme}
            options={[
            { value: "refined", label: "Refinado" },
            { value: "original", label: "Original" },
            { value: "contrast", label: "Contraste" }]
            }
            onChange={(v) => setTweak("theme", v)} />
          
          <TweakToggle label="Moldura do relógio" value={tweaks.showFrame} onChange={(v) => setTweak("showFrame", v)} />
          <TweakToggle label="Rótulo da tela" value={tweaks.showLabel} onChange={(v) => setTweak("showLabel", v)} />
        </TweakSection>

        <TweakSection title="Tour">
          <TweakSelect
            label="Ir para tela"
            value={screen}
            options={ALL_SCREENS.map((s) => ({ value: s, label: SCREEN_LABELS[s] }))}
            onChange={(v) => setScreen(v)} />
          
          <TweakToggle label="Ciclar automaticamente" value={tweaks.autoCycle} onChange={(v) => setTweak("autoCycle", v)} />
        </TweakSection>
      </TweaksPanel>
    </div>);

}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);