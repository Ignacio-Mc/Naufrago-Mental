// Tiempo de juego: 24 min reales = 24h ingame (1 min = 1h)

let gameStartTime = Date.now();

export function resetGameTime() {
    gameStartTime = Date.now();
}

export function getGameTime() {
    const now = Date.now();
    const elapsedMinutes = (now - gameStartTime) / 60000; // 1 min real = 1 hora ingame
    const totalHours = elapsedMinutes;
    const dayHours = totalHours % 24;
    const hour = Math.floor(dayHours);
    const minute = Math.floor((dayHours % 1) * 60);
    return { hour, minute, dayHours, totalHours };
}