// ------------------------------------------------------------
// IMPORTS — MÓDULOS DEL JUEGO
// ------------------------------------------------------------
import { initLogbook, addLog } from "./core/logbook.js";
import { initDialog, showDialog } from "./core/dialog.js";
import { initRooms } from "./core/rooms.js";
import { initWeather } from "./core/weather.js";
import { initSky } from "./core/sky.js";
import { initTime } from "./core/time.js";
import { initStats } from "./core/stats.js";

// ------------------------------------------------------------
// INICIALIZADOR PRINCIPAL
// ------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {

    // 1) Sistemas base primero
    initLogbook();
    initDialog();
    initStats();
    initTime();          // ⬅️ IMPORTANTE: antes del clima y del cielo

    // 2) Sistemas dependientes del tiempo
    initWeather();       // depende de initTime()
    initSky();           // depende de time y weather

    // 3) Sistemas de interacción
    initRooms();
    initModal();

    // 4) Mensajes iniciales
    showInitialMessages();
});

// ------------------------------------------------------------
// Modal de estados detallados
// ------------------------------------------------------------
function initModal() {
    const modal    = document.getElementById("modal-full-stats");
    const backdrop = document.getElementById("modal-backdrop");
    const btnOpen  = document.getElementById("btn-open-full-stats");
    const btnClose = document.getElementById("btn-close-full-stats");

    if (!modal || !backdrop) return;

    function open() {
        modal.classList.remove("hidden");
        backdrop.classList.remove("hidden");
    }

    function close() {
        modal.classList.add("hidden");
        backdrop.classList.add("hidden");
    }

    if (btnOpen)  btnOpen.addEventListener("click", open);
    if (btnClose) btnClose.addEventListener("click", close);

    // Cerrar clickeando fuera
    backdrop.addEventListener("click", close);
}

// ------------------------------------------------------------
// Mensajes iniciales
// ------------------------------------------------------------
function showInitialMessages() {
    addLog("Bienvenido a tu naufragio mental.");
    addLog("El día 1 comienza. No tienes nada, salvo deudas, dudas y un poco de café frío.");
    showDialog("¿Otra vez café frío?", true);
}