// Logbook: historial de texto

let logOutputEl = null;

export function initLogbook() {
    logOutputEl = document.getElementById("log-output");
    const btnClear = document.getElementById("btn-clear-log");

    if (btnClear && logOutputEl) {
        btnClear.addEventListener("click", () => {
            logOutputEl.innerHTML = "";
        });
    }
}

export function addLog(text) {
    if (!logOutputEl) return;
    const line = document.createElement("div");
    line.textContent = text;
    logOutputEl.appendChild(line);
    logOutputEl.scrollTop = logOutputEl.scrollHeight;
}