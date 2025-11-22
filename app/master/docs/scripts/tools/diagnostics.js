#!/usr/bin/env node
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { spawnSync } from "child_process";

// --- Carpeta actual (dentro de /tools o /scripts) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// --- Mapeo de comandos ---
const scripts = {
    graph:  ["node", [join(__dirname, "generateGraph.js")]],
    diag:   ["node", [join(__dirname, "security_and_evolution.js")]],
    verify: ["node", [join(__dirname, "verifyBuildPaths.js")]],
    langs:  ["node", [join(__dirname, "checkLanguages.js")]],
    audit:  ["npm",  ["audit", "--audit-level=moderate"]]
};

// --- Argumento recibido ---
const arg = process.argv[2];

if (!arg || !scripts[arg]) {
    console.log("\nUso: node diagnostics.js [graph | diag | verify | langs | audit]\n");
    process.exit(1);
}

console.log(`\n🧪 Ejecutando análisis: ${arg}\n`);

// --- Ejecución segura ---
const [cmd, args] = scripts[arg];
const result = spawnSync(cmd, args, { stdio: "inherit", shell: true });

if (result.status !== 0) {
    console.error(`\n❌ Error ejecutando ${arg}.`);
    process.exit(result.status);
}

console.log(`\n✅ ${arg} completado sin errores.\n`);
