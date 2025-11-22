import fs from "fs";
import path from "path";

export const BASE_PATH = path.join(process.cwd(), "app", "master", "docs");

export const scriptsToCheck = [
    "scripts/game.js",
    "scripts/core/dialog.js",
    "scripts/core/logbook.js",
    "scripts/core/rooms.js",
    "scripts/core/stats.js"
].map(f => path.join(BASE_PATH, f));

export const modulesToCheck = [
    "assets/images",
    "assets/sounds",
    "assets/fonts"
].map(f => path.join(BASE_PATH, f));

export const locales = (() => {
    const dir = path.join(BASE_PATH, "locales");
    const langs = {};

    if (fs.existsSync(dir)) {
        fs.readdirSync(dir).forEach(lang => {
            const full = path.join(dir, lang);
            if (fs.statSync(full).isDirectory()) {
                langs[lang] = {
                    files: fs.readdirSync(full).filter(f => f.endsWith(".json")),
                    missing: [],
                    extra: []
                };
            }
        });
    }

    return langs;
})();

export function generateGraphOutput() {
    const graph = {
        basePath: BASE_PATH,
        scripts: scriptsToCheck.map(p => fs.existsSync(p)),
        modules: modulesToCheck.map(p => fs.existsSync(p)),
        locales,
        timestamp: new Date().toISOString()
    };

    const resultsDir = path.join("tools", `Evolucion-${graph.timestamp.replace(/[:.]/g, "-")}`);
    fs.mkdirSync(resultsDir, { recursive: true });

    const out = path.join(resultsDir, "graph.json");
    fs.writeFileSync(out, JSON.stringify(graph, null, 2));

    console.log(`📊 Archivo generado: ${out}`);
}

// ejecución directa
if (import.meta.url === `file://${process.argv[1]}`) {
    generateGraphOutput();
}
