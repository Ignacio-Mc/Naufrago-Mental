#!/usr/bin/env node
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { spawnSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Mapeo de herramientas disponibles
const scripts = {
    tree:    ["node", [join(__dirname, "treeFiles.mjs")]],
    paths:   ["node", [join(__dirname, "verifyPaths.js")]],
    langs:   ["node", [join(__dirname, "checkLanguages.js")]],
    graph:   ["node", [join(__dirname, "generateGraph.js")]],
    diag:    ["node", [join(__dirname, "security_and_evolution.js")]],
    summary: ["node", [join(__dirname, "summary.js")]],
};

const arg = process.argv[2];

// Mensaje de ayuda completo
if (!arg || !scripts[arg]) {
    console.log(`
Uso: node diagnostics.js <comando>

Comandos disponibles:
  tree      → Generar árbol de archivos
  paths     → Verificar estructura del proyecto
  langs     → Analizar idiomas
  graph     → Generar grafo de dependencias / módulos
  diag      → Informe de seguridad y evolución
  summary   → Resumen del último análisis

Ejemplo:
  node diagnostics.js tree
`);
    process.exit(1);
}

console.log(`\n🧪 Ejecutando análisis: ${arg}\n`);

const [cmd, args] = scripts[arg];
const result = spawnSync(cmd, args, { stdio: "inherit", shell: true });

if (result.status !== 0) {
    console.error(`\n❌ Error ejecutando ${arg}.`);
    process.exit(result.status);
}

console.log(`\n✅ ${arg} completado sin errores.\n`);