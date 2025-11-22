// Sistema de clima: HUD, lógica, efectos y partículas visuales

import { getGameTime } from "./time.js";
import { addLog } from "./logbook.js";
import { adjustStat } from "./stats.js";
import { isRoomOutdoor, getCurrentRoomId } from "./rooms.js";

// DOM refs (HUD)
let timeClockEl   = null;
let weatherIconEl = null;
let weatherLabelEl= null;

// Canvas visual para lluvia/nieve/niebla
let weatherCanvas = null;
let weatherCtx    = null;

// Partículas
const weatherDrops = [];

// Estado del clima
let currentWeatherId = null;
let lastWeatherChangeTotalHours = 0;
const WEATHER_MIN_HOURS_BETWEEN_CHANGES = 3; // 3h ingame

let lastWeatherEffectHour = -1;

// Sonido
let currentWeatherAudio = null;

// Rutas
const WEATHER_ICON_PATH = "assets/images/weather/";

// Definiciones de clima
const WEATHER_DEFS = {
    sunny:         { label: "Soleado",            icon: "Sunny.png",                  animClass: "weather-anim-sunny" },
    partly_day:    { label: "Parcial nublado",    icon: "Partly_cloudy_Day.png",     animClass: "weather-anim-cloudy" },
    partly_night:  { label: "Nubes nocturnas",    icon: "Partly_cloudy_Night.png",   animClass: "weather-anim-cloudy" },
    cloudy:        { label: "Nublado",            icon: "Cloudy.png",                animClass: "weather-anim-cloudy" },
    light_rain:    { label: "Lluvia ligera",      icon: "Light rain.png",            animClass: "weather-anim-rain" },
    heavy_rain:    { label: "Lluvia fuerte",      icon: "Heavy_rain.png",            animClass: "weather-anim-rain-strong" },
    storm:         { label: "Tormenta",           icon: "Thunderstorm.png",          animClass: "weather-anim-storm" },
    storm_rain:    { label: "Tormenta lluviosa",  icon: "Rain_with_thunderstorm.png",animClass: "weather-anim-storm" },
    snow:          { label: "Nevando",            icon: "snowy.png",                 animClass: "weather-anim-snow" },
    sleet:         { label: "Aguanieve",          icon: "sleet.png",                 animClass: "weather-anim-snow" },
    snow_storm:    { label: "Tormenta de nieve",  icon: "Snow_and_thunderstorm.png", animClass: "weather-anim-storm" },
    fog:           { label: "Niebla",             icon: "Fog .png",                  animClass: "weather-anim-fog" },
    freezing_rain: { label: "Lluvia helada",      icon: "Freezing_rain.png",         animClass: "weather-anim-rain" },
    night_clear:   { label: "Noche clara",        icon: "Moon.png",                  animClass: "weather-anim-moon" },
    tornado:       { label: "Tormenta severa",    icon: "Tornado.png",               animClass: "weather-anim-tornado" }
};

// Rutas opcionales para sonido (si los creas luego)
const WEATHER_SOUNDS = {
    light_rain:    "assets/sounds/light_rain.mp3",
    heavy_rain:    "assets/sounds/heavy_rain.mp3",
    storm:         "assets/sounds/storm.mp3",
    storm_rain:    "assets/sounds/storm_rain.mp3",
    snow:          "assets/sounds/snow.mp3",
    sleet:         "assets/sounds/sleet.mp3",
    snow_storm:    "assets/sounds/snow_storm.mp3",
    fog:           "assets/sounds/fog.mp3",
    night_clear:   "assets/sounds/night_ambience.mp3",
    sunny:         "assets/sounds/day_ambience.mp3"
};

export function getCurrentWeatherId() {
    return currentWeatherId;
}

// ------------------------------------------------------------
// Inicialización
// ------------------------------------------------------------
export function initWeather() {
    timeClockEl    = document.getElementById("time-hud-clock");
    weatherIconEl  = document.getElementById("weather-icon");
    weatherLabelEl = document.getElementById("weather-label");

    // Canvas de partículas
    weatherCanvas = document.getElementById("sky-weather");
    if (weatherCanvas && weatherCanvas.getContext) {
        weatherCtx = weatherCanvas.getContext("2d");
        resizeWeatherCanvas();
        window.addEventListener("resize", resizeWeatherCanvas);

        // Prellenar partículas
        for (let i = 0; i < 120; i++) {
            weatherDrops.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                v: 2 + Math.random() * 3
            });
        }

        requestAnimationFrame(renderWeather);
    }

    // Loop de HUD (hora + clima + efectos)
    setInterval(updateHUD, 250);
    updateHUD();
}

// ------------------------------------------------------------
// HUD Tiempo + Clima
// ------------------------------------------------------------
function updateHUD() {
    const { hour, minute, totalHours } = getGameTime();

    // Reloj
    if (timeClockEl) {
        const hh = String(hour).padStart(2, "0");
        const mm = String(minute).padStart(2, "0");
        timeClockEl.textContent = `${hh}:${mm}`;
    }

    // Clima
    updateWeatherSystem(totalHours);
    applyWeatherHourlyEffects(totalHours);
}

function updateWeatherSystem(totalHours) {
    if (currentWeatherId === null) {
        currentWeatherId = rollWeather(totalHours);
        lastWeatherChangeTotalHours = totalHours;
        applyWeatherToHUD();
        return;
    }

    if (totalHours - lastWeatherChangeTotalHours >= WEATHER_MIN_HOURS_BETWEEN_CHANGES) {
        currentWeatherId = rollWeather(totalHours);
        lastWeatherChangeTotalHours = totalHours;
        applyWeatherToHUD();
    }
}

function rollWeather(totalHours) {
    const gameHours = totalHours % 24;
    const isNight = (gameHours < 6 || gameHours >= 20);
    const r = Math.random();

    if (isNight) {
        if (r < 0.30) return "night_clear";
        if (r < 0.55) return "partly_night";
        if (r < 0.75) return "cloudy";
        if (r < 0.87) return "fog";
        if (r < 0.95) return "light_rain";
        if (r < 0.99) return "storm";
        return "tornado";
    } else {
        if (r < 0.25) return "sunny";
        if (r < 0.45) return "partly_day";
        if (r < 0.65) return "cloudy";
        if (r < 0.80) return "light_rain";
        if (r < 0.88) return "heavy_rain";
        if (r < 0.94) return "storm_rain";
        if (r < 0.98) return "fog";
        return "snow";
    }
}

function applyWeatherToHUD() {
    const def = WEATHER_DEFS[currentWeatherId];
    if (!def) return;

    if (weatherLabelEl) {
        weatherLabelEl.textContent = def.label;
    }
    if (weatherIconEl) {
        weatherIconEl.src = WEATHER_ICON_PATH + def.icon;
        weatherIconEl.className = "weather-icon";
        if (def.animClass) {
            weatherIconEl.classList.add(def.animClass);
        }
    }

    updateWeatherAudio();
}

// ------------------------------------------------------------
// Sonido de clima
// ------------------------------------------------------------
function updateWeatherAudio() {
    const path = WEATHER_SOUNDS[currentWeatherId];
    if (!path) {
        if (currentWeatherAudio) {
            currentWeatherAudio.pause();
            currentWeatherAudio = null;
        }
        return;
    }

    if (currentWeatherAudio && currentWeatherAudio._id === path) return;

    if (currentWeatherAudio) {
        currentWeatherAudio.pause();
        currentWeatherAudio = null;
    }

    try {
        const audio = new Audio(path);
        audio.loop = true;
        audio.volume = 0.45;
        audio.play().catch(() => {});
        audio._id = path;
        currentWeatherAudio = audio;
    } catch (e) {
        // Ignorar errores silenciosamente
    }
}

// ------------------------------------------------------------
// Efectos del clima sobre los estados (cada hora)
// ------------------------------------------------------------
function applyWeatherHourlyEffects(totalHours) {
    const currentHour = Math.floor(totalHours);
    if (currentHour === lastWeatherEffectHour) return;
    lastWeatherEffectHour = currentHour;

    if (!currentWeatherId) return;

    let dSalud = 0, dBien = 0, dCord = 0;

    switch (currentWeatherId) {
        case "sunny":
        case "partly_day":
            dBien += 2;
            dCord += 1;
            break;
        case "cloudy":
            dBien -= 1;
            break;
        case "light_rain":
            dBien += 1;
            dCord -= 1;
            break;
        case "heavy_rain":
        case "storm_rain":
            dBien -= 2;
            dCord -= 2;
            break;
        case "storm":
        case "tornado":
            dBien -= 3;
            dCord -= 4;
            break;
        case "fog":
            dCord -= 2;
            break;
        case "snow":
        case "sleet":
        case "snow_storm":
            dSalud -= 1;
            dBien  -= 1;
            break;
        case "night_clear":
        case "partly_night":
            dCord += 1;
            break;
    }

    if (dSalud || dBien || dCord) {
        addLog(`El clima te afecta: Salud ${dSalud}, Bienestar ${dBien}, Cordura ${dCord}.`);
    }

    if (dSalud) adjustStat("salud", dSalud);
    if (dBien)  adjustStat("bienestar", dBien);
    if (dCord)  adjustStat("cordura", dCord);
}

// ------------------------------------------------------------
// Render visual del clima (lluvia/nieve/niebla)
// ------------------------------------------------------------
function resizeWeatherCanvas() {
    if (!weatherCanvas) return;
    weatherCanvas.width  = window.innerWidth;
    weatherCanvas.height = window.innerHeight;
}

function renderWeather() {
    if (!weatherCtx || !weatherCanvas) {
        requestAnimationFrame(renderWeather);
        return;
    }

    weatherCtx.clearRect(0, 0, weatherCanvas.width, weatherCanvas.height);

    // si estás en interior, no se “ve” el clima
    if (!isRoomOutdoor(getCurrentRoomId())) {
        requestAnimationFrame(renderWeather);
        return;
    }

    if (!currentWeatherId) {
        requestAnimationFrame(renderWeather);
        return;
    }

    if (["light_rain","heavy_rain","storm","storm_rain","freezing_rain"].includes(currentWeatherId)) {
        weatherCtx.fillStyle = "#8cc7ff";
        const factor = (currentWeatherId === "heavy_rain" || currentWeatherId === "storm_rain") ? 1.6 : 1;
        weatherDrops.forEach(d => {
            weatherCtx.fillRect(d.x, d.y, 2, 6);
            d.y += d.v * factor;
            if (d.y > weatherCanvas.height) d.y = -10;
        });
    }

    if (["snow","sleet","snow_storm"].includes(currentWeatherId)) {
        weatherCtx.fillStyle = "#ffffff";
        const factor = currentWeatherId === "snow_storm" ? 1.4 : 0.6;
        weatherDrops.forEach(d => {
            weatherCtx.fillRect(d.x, d.y, 2, 2);
            d.y += d.v * factor;
            if (d.y > weatherCanvas.height) d.y = -10;
        });
    }

    if (currentWeatherId === "fog") {
        weatherCtx.fillStyle = "rgba(200,210,220,0.11)";
        weatherCtx.fillRect(0, 0, weatherCanvas.width, weatherCanvas.height);
    }

    requestAnimationFrame(renderWeather);
}