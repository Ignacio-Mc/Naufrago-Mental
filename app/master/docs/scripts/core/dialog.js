// Burbuja de diálogo del personaje

import { addLog } from "./logbook.js";

let dialogBubbleEl = null;

export function initDialog() {
    dialogBubbleEl = document.getElementById("dialog-bubble");
}

export function showDialog(text, alsoLog = true, durationMs = 4500) {
    if (!dialogBubbleEl) return;

    dialogBubbleEl.textContent = text;
    dialogBubbleEl.classList.add("visible");

    if (alsoLog) {
        addLog("> " + text);
    }

    if (dialogBubbleEl._hideTimeout) {
        clearTimeout(dialogBubbleEl._hideTimeout);
    }
    dialogBubbleEl._hideTimeout = setTimeout(() => {
        dialogBubbleEl.classList.remove("visible");
    }, durationMs);
}