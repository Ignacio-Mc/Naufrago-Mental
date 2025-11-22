// Manejo de barras de estado + dinero

import { clamp } from "./utils.js";

const STAT_UI_MAP = {
    salud:     { barId: "stat-salud-bar",     textId: "stat-salud-text" },
    bienestar: { barId: "stat-bienestar-bar", textId: "stat-bienestar-text" },
    cordura:   { barId: "stat-cordura-bar",   textId: "stat-cordura-text" }
};

export function adjustStat(statKey, delta) {
    if (!delta) return;

    const conf = STAT_UI_MAP[statKey];
    if (!conf) return;

    const textEl = document.getElementById(conf.textId);
    const barEl  = document.getElementById(conf.barId);
    if (!textEl || !barEl) return;

    const current = parseInt(textEl.innerText) || 0;
    const next    = clamp(current + delta, 0, 100);

    textEl.innerText = `${next}/100`;
    barEl.style.width = `${next}%`;
}

export function adjustMoney(delta) {
    if (!delta) return;

    const hudMoney = document.getElementById("hud-money");
    if (!hudMoney) return;

    let current = parseInt(hudMoney.innerText) || 0;
    current += delta;
    hudMoney.innerText = current;
}