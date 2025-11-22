// Cielo dinámico: gradiente día/noche + estrellas

import { getGameTime } from "./time.js";
import { clamp, lerpColor } from "./utils.js";

let skyBaseEl   = null;
let starCanvas  = null;
let starCtx     = null;

const stars = [];

const SKY_KEYS = [
    { h:  0, colorTop: [3, 5, 23],   colorBottom: [0, 0, 5] },
    { h:  6, colorTop: [40, 35, 80], colorBottom: [5, 5, 25] },
    { h:  9, colorTop: [150,190,230],colorBottom: [80,140,190] },
    { h: 14, colorTop: [120,200,240],colorBottom: [40,120,180] },
    { h: 18, colorTop: [210,130,80], colorBottom: [80,40,60] },
    { h: 21, colorTop: [10,25,50],   colorBottom: [2,5,20] },
    { h: 24, colorTop: [3, 5, 23],   colorBottom: [0, 0, 5] }
];

export function initSky() {
    skyBaseEl  = document.getElementById("sky-base");
    starCanvas = document.getElementById("sky-stars");

    if (!skyBaseEl || !starCanvas || !starCanvas.getContext) return;

    starCtx = starCanvas.getContext("2d");

    resizeStars();
    window.addEventListener("resize", resizeStars);

    // Crear estrellas
    for (let i = 0; i < 130; i++) {
        stars.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            a: Math.random(),
            s: 0.5 + Math.random() * 0.7
        });
    }

    requestAnimationFrame(renderSky);
}

function resizeStars() {
    if (!starCanvas) return;
    starCanvas.width  = window.innerWidth;
    starCanvas.height = window.innerHeight;
}

function getSkyGradientForHour(dayHours) {
    let prev = SKY_KEYS[0];
    let next = SKY_KEYS[SKY_KEYS.length - 1];

    for (let i = 0; i < SKY_KEYS.length - 1; i++) {
        const a = SKY_KEYS[i];
        const b = SKY_KEYS[i + 1];
        if (dayHours >= a.h && dayHours <= b.h) {
            prev = a;
            next = b;
            break;
        }
    }

    const span = next.h - prev.h || 1;
    const t = (dayHours - prev.h) / span;

    const top = lerpColor(prev.colorTop,    next.colorTop,    t);
    const bot = lerpColor(prev.colorBottom, next.colorBottom, t);
    return `radial-gradient(circle at top, ${top} 0%, ${bot} 80%)`;
}

function renderSky() {
    if (!skyBaseEl || !starCtx || !starCanvas) {
        requestAnimationFrame(renderSky);
        return;
    }

    const { dayHours, hour } = getGameTime();

    // Gradiente de fondo
    skyBaseEl.style.background = getSkyGradientForHour(dayHours);

    // Estrellas solo de noche
    starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
    if (hour >= 20 || hour < 6) {
        stars.forEach(st => {
            st.a += (Math.random() - 0.5) * 0.15;
            st.a = clamp(st.a, 0.2, 1);
            starCtx.globalAlpha = st.a;
            starCtx.fillStyle = "#ffffff";
            starCtx.fillRect(st.x, st.y, st.s, st.s);
        });
    }

    requestAnimationFrame(renderSky);
}