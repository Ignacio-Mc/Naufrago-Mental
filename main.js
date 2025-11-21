document.addEventListener("DOMContentLoaded", () => {
  const state = {
    day: 1,
    money: 0,
    health: 100,
    wellbeing: 60,
    sanity: 70,
  };

  // DOM refs
  const barHealth = document.getElementById("bar-health");
  const barWellbeing = document.getElementById("bar-wellbeing");
  const barSanity = document.getElementById("bar-sanity");

  const counterMoney = document.getElementById("counter-money");
  const counterDay = document.getElementById("counter-day");

  const logEl = document.getElementById("log");

  const btnWork = document.getElementById("btn-work");
  const btnRest = document.getElementById("btn-rest");
  const btnCoffee = document.getElementById("btn-coffee");
  const btnClearLog = document.getElementById("btn-clear-log");

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function updateUI() {
    barHealth.style.width = `${state.health}%`;
    barWellbeing.style.width = `${state.wellbeing}%`;
    barSanity.style.width = `${state.sanity}%`;

    counterMoney.textContent = state.money.toFixed(0);
    counterDay.textContent = state.day;
  }

  function addLog(message, type = "neutral") {
    const entry = document.createElement("div");
    entry.classList.add("nm-log-entry", `nm-log-entry--${type}`);
    entry.textContent = message;
    logEl.appendChild(entry);
    logEl.scrollTop = logEl.scrollHeight;
  }

  // --- Acciones base ---

  btnWork.addEventListener("click", () => {
    state.money += 15;
    state.wellbeing -= 4;
    state.sanity -= 2;

    state.wellbeing = clamp(state.wellbeing, 0, 100);
    state.sanity = clamp(state.sanity, 0, 100);

    addLog("Vas a trabajar. Ganas dinero, pierdes un poco de paz mental.", "neutral");

    if (state.wellbeing <= 20) {
      addLog("Te sientes drenado. Quizá deberías descansar pronto.", "bad");
    }

    updateUI();
  });

  btnRest.addEventListener("click", () => {
    state.day += 1;
    state.health += 6;
    state.wellbeing += 8;
    state.sanity += 5;

    state.health = clamp(state.health, 0, 100);
    state.wellbeing = clamp(state.wellbeing, 0, 100);
    state.sanity = clamp(state.sanity, 0, 100);

    addLog("Duermes. El mundo no mejora, pero tú te sientes un poco menos roto.", "good");

    updateUI();
  });

  btnCoffee.addEventListener("click", () => {
    state.wellbeing += 3;
    state.sanity -= 3;

    state.wellbeing = clamp(state.wellbeing, 0, 100);
    state.sanity = clamp(state.sanity, 0, 100);

    addLog("Tomas café. Productivo, nervioso, vivo… más o menos.", "neutral");

    if (state.sanity <= 25) {
      addLog("Empiezas a notar el temblor en las manos. Algo no va bien.", "bad");
    }

    updateUI();
  });

  btnClearLog.addEventListener("click", () => {
    logEl.innerHTML = "";
    addLog("Nuevo día, mismo naufragio. (Log limpiado)", "neutral");
  });

  // Mensaje inicial
  addLog("Despiertas en tu pieza. No hay tutorial, pero las cuentas vencen igual.", "neutral");
  updateUI();
});
