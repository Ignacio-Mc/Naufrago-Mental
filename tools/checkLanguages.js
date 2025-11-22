import fs from "fs";
import path from "path";

const BASE_PATH = path.join(process.cwd(), "app", "master", "docs");
const LOCALES_DIR = path.join(BASE_PATH, "locales");

function scanLanguage(langPath) {
    const files = fs.readdirSync(langPath).filter(f => f.endsWith(".json"));
    const output = {};

    for (const file of files) {
        const full = path.join(langPath, file);
        const data = JSON.parse(fs.readFileSync(full, "utf8"));
        output[file] = {
            keys: Object.keys(data),
            missingCount: 0,
            extraCount: 0
        };
    }
    return output;
}

function compare(reference, target) {
    const missing = reference.filter(key => !target.includes(key));
    const extra = target.filter(key => !reference.includes(key));
    return { missing, extra };
}

export function runCheckLanguages() {
    if (!fs.existsSync(LOCALES_DIR)) {
        console.log("⚠️ No existe carpeta locales/");
        return;
    }

    const languages = fs.readdirSync(LOCALES_DIR).filter(d =>
        fs.statSync(path.join(LOCALES_DIR, d)).isDirectory()
    );

    const results = {};
    const timestamp = new Date().toISOString();

    let referenceLang = languages.includes("en") ? "en" : languages[0];
    let refFiles = scanLanguage(path.join(LOCALES_DIR, referenceLang));

    for (const lang of languages) {
        const langPath = path.join(LOCALES_DIR, lang);
        const files = scanLanguage(langPath);
        results[lang] = {};

        for (const file of Object.keys(refFiles)) {
            if (!files[file]) {
                results[lang][file] = {
                    missing: refFiles[file].keys,
                    extra: [],
                    missingCount: refFiles[file].keys.length,
                    extraCount: 0
                };
                continue;
            }

            const comparison = compare(refFiles[file].keys, files[file].keys);
            results[lang][file] = {
                missing: comparison.missing,
                extra: comparison.extra,
                missingCount: comparison.missing.length,
                extraCount: comparison.extra.length
            };
        }
    }

    const outDir = path.join("tools", `Evolucion-Langs`);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    const outFile = path.join(outDir, `langs-${timestamp.replace(/[:.]/g, "-")}.json`);
    fs.writeFileSync(outFile, JSON.stringify(results, null, 2));

    console.log(`🌐 Informe de idiomas generado: ${outFile}`);
}

// ejecución directa
if (import.meta.url === `file://${process.argv[1]}`) {
    runCheckLanguages();
}
