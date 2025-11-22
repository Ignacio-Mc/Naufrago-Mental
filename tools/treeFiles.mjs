import fs from "fs";
import path from "path";

const IGNORED_FOLDERS = [
    "node_modules",
    ".git",
    ".vscode",
    "dist",
    "build",
    ".cache",
    "temp",
    "tmp"
];

// Filtro seguro que considera coincidencias parciales
function shouldIgnore(name) {
    return IGNORED_FOLDERS.some(bad => name.toLowerCase().includes(bad.toLowerCase()));
}

export function generateTree(dir, depth = 0, maxDepth = 10) {
    if (depth > maxDepth) return "";

    let tree = "";
    let items;

    try {
        items = fs.readdirSync(dir);
    } catch {
        return ""; // Permite evitar errores por permisos
    }

    for (const item of items) {
        const fullPath = path.join(dir, item);
        let stats;

        try {
            stats = fs.statSync(fullPath);
        } catch {
            continue; // Evitar archivos corruptos o inaccesibles
        }

        if (stats.isDirectory() && shouldIgnore(item)) {
            continue;
        }

        tree += "  ".repeat(depth) + (stats.isDirectory() ? "📁 " : "📄 ") + item + "\n";

        if (stats.isDirectory()) {
            tree += generateTree(fullPath, depth + 1, maxDepth);
        }
    }

    return tree;
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const startDir = process.argv[2] || process.cwd();
    console.log(generateTree(startDir));
}