#!/usr/bin/env node
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ROOT = carpeta raíz del proyecto
const ROOT = join(__dirname, "..");

// --- Carpetas base ---
const DOCS = join(ROOT, "app", "master", "docs");
const ASSETS = join(DOCS, "assets");
const SCRIPTS = join(DOCS, "scripts");
const STYLE = join(DOCS, "style");

console.log("\n🧩 Verificando estructura de 'Náufrago Mental'...\n");

const CHECKS = [
    { name: "📄 index.html", path: join(DOCS, "index.html") },
    { name: "📁 /scripts/", path: SCRIPTS },
    { name: "📁 /style/", path: STYLE },
    { name: "📁 assets/images/", path: join(ASSETS, "images") },
    { name: "📁 assets/sounds/", path: join(ASSETS, "sounds") },
    { name: "📁 assets/fonts/", path: join(ASSETS, "fonts") }
];

let allOk = true;

for (const item of CHECKS) {
    const ok = existsSync(item.path);
    console.log(`${ok ? "✅" : "⚠️"} ${item.name} → ${ok ? "Encontrado" : "No encontrado"}`);
    if (!ok) allOk = false;
}

console.log("\n🧾 Resultado final:");
console.log(allOk ? "✅ Todo está en orden.\n" : "⚠️ Faltan elementos importantes en el proyecto.\n");
