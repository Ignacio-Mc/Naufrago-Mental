// Habitaciones / lugares del mapa

import { addLog } from "./logbook.js";
import { showDialog } from "./dialog.js";
import { adjustStat, adjustMoney } from "./stats.js";

const rooms = {
    pieza: {
        name: "La Pieza",
        msg: "Despiertas en tu pieza. Huele a encierro emocional.",
        effects: { bienestar: -1, cordura: -1 }
    },
    cocina: {
        name: "La Cocina",
        msg: "La cocina te recibe con platos sucios y el juicio silencioso del refri.",
        effects: { hambre: -5, salud: +1 }
    },
    consulta: {
        name: "La Consulta",
        msg: "El psicólogo te mira… como si ya supiera todo.",
        effects: { cordura: +5, finanzas: -10 }
    },
    trabajo: {
        name: "Trabajo",
        msg: "El teletrabajo te abraza con el frío de los correos no respondidos.",
        effects: { finanzas: +15, cordura: -3, bienestar: -2 }
    },
    calle: {
        name: "La Calle",
        msg: "Sales afuera. El mundo sigue sin pausas para tus crisis.",
        effects: { cordura: -2, stress: +1 }
    },
    bar: {
        name: "El Bar",
        msg: "El bartender te mira como si ya fueras cliente habitual.",
        effects: { adiccion: +5, stress: -5, finanzas: -8 }
    },
    servicios: {
        name: "Servicios Sociales",
        msg: "Sacas número. Adelante van 57 personas.",
        effects: { stress: +3, finanzas: -2 }
    }
};

const OUTDOOR_ROOMS = ["calle", "bar", "trabajo", "servicios"];

let currentRoomId = "pieza";

export function getCurrentRoomId() {
    return currentRoomId;
}

export function isRoomOutdoor(id = currentRoomId) {
    return OUTDOOR_ROOMS.includes(id);
}

function applyRoomEffects(effects) {
    if (!effects) return;

    if (effects.finanzas)   adjustMoney(effects.finanzas);
    if (effects.cordura)    adjustStat("cordura", effects.cordura);
    if (effects.bienestar)  adjustStat("bienestar", effects.bienestar);
    if (effects.salud)      adjustStat("salud", effects.salud);
    // hambre, sed, estrés, etc. se implementarán después
}

export function changeRoom(id) {
    const room = rooms[id];
    if (!room) return;

    currentRoomId = id;
    addLog(`Cambiaste a: ${room.name}`);
    showDialog(room.msg);
    applyRoomEffects(room.effects);
}

export function initRooms() {
    const buttons = document.querySelectorAll(".room-button");
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-room");
            changeRoom(id);
        });
    });

    // Mensaje inicial de contexto
    addLog("Estás en tu pieza. Es… acogedora en un sentido deprimente.");
}