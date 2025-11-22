// treeFiles.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// === RESOLVER RUTAS ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Raíz del proyecto → sube dos niveles desde /tools/
const ROOT_DIR = path.resolve(__dirname, '../../');

// === CONFIGURACIÓN ===
const ESSENTIAL_EXTENSIONS = ['.js', '.mjs', '.cjs', '.json', '.ico', '.html', '.css', '.md'];
const IGNORE_FOLDERS = ['.git', '.vscode', 'node_modules', '.cache'];
const MAX_FILES_IN_FOLDER = 50;

// ======================
//    SCAN FOLDER
// ======================
export function scanFolder(dir) {
    let result = [];
    let items;

    try {
        items = fs.readdirSync(dir).sort((a, b) => {
            const aIsDir = fs.statSync(path.join(dir, a)).isDirectory();
            const bIsDir = fs.statSync(path.join(dir, b)).isDirectory();
            return aIsDir === bIsDir ? a.localeCompare(b) : aIsDir ? -1 : 1;
        });
    } catch {
        return { folders: [], files: [] };
    }

    const children = [];

    items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
            if (IGNORE_FOLDERS.includes(item)) return;

            const scanned = scanFolder(fullPath);
            const totalInside = scanned.files.length + scanned.folders.length;

            if (totalInside > MAX_FILES_IN_FOLDER) {
                children.push({
                    name: item,
                    type: 'folder',
                    omit: true,
                    total: totalInside
                });
            } else {
                children.push({
                    name: item,
                    type: 'folder',
                    children: scanned.folders.concat(scanned.files)
                });
            }
        } else if (ESSENTIAL_EXTENSIONS.includes(path.extname(item))) {
            children.push({
                name: item,
                type: 'file',
                size: stats.size,
                mtime: stats.mtime.toISOString().split("T")[0]
            });
        }
    });

    return {
        folders: children.filter(c => c.type === 'folder'),
        files: children.filter(c => c.type === 'file')
    };
}

// ======================
//      PRINT TREE
// ======================
export function printTree(node, prefix = '') {
    node.forEach((item, idx) => {
        const isLast = idx === node.length - 1;
        const connector = isLast ? '└─ ' : '├─ ';

        if (item.type === 'folder') {
            if (item.omit) {
                console.log(`${prefix}${connector}${item.name}/ (omitida, ${item.total} archivos)`);
            } else {
                console.log(`${prefix}${connector}${item.name}/`);
                printTree(item.children, prefix + (isLast ? '   ' : '│  '));
            }
        } else if (item.type === 'file') {
            const sizeKB = (item.size / 1024).toFixed(1) + " KB";
            console.log(`${prefix}${connector}${item.name}  (${sizeKB}, ${item.mtime})`);
        }
    });
}

// ======================
//   MODO EJECUTABLE
// ======================
if (import.meta.url === process.argv[1] || import.meta.url === `file://${process.argv[1]}`) {
    console.log(`\n📂 Estructura completa del proyecto: ${path.basename(ROOT_DIR)}\n`);

    const scanned = scanFolder(ROOT_DIR);
    printTree(scanned.folders.concat(scanned.files));

    console.log(`\n✅ Árbol de archivos generado correctamente.\n`);
}
