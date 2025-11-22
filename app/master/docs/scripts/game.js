import { initLogbook, addLog } from "./core/logbook.js";
import { initDialog, showDialog } from "./core/dialog.js";
import { initRooms } from "./core/rooms.js";
import { initWeather } from "./core/weather.js";
import { initSky } from "./core/sky.js";

document.addEventListener("DOMContentLoaded", () => {
    // Inicializar sistemas base
    initLogbook();
    initDialog();
    initSky();
    initRooms();
    initWeather();

    initModal();
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
    backdrop.addEventListener("click", close);
}

// ------------------------------------------------------------
// Mensajes iniciales del juego
// ------------------------------------------------------------
function showInitialMessages() {
    addLog("Bienvenido a tu naufragio mental.");
    addLog("El día 1 comienza. No tienes nada, salvo deudas, dudas y un poco de café frío.");
    showDialog("¿Otra vez café frío?", true);
}