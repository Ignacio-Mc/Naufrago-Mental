import fs from "fs";
import path from "path";

export function runSummary() {
    const scriptsDir = "tools";

    console.log("\n🧾 Resumen final de diagnósticos\n");

    // --- Buscar carpeta Evolucion- más reciente ---
    const evolutions = fs.readdirSync(scriptsDir).filter(f =>
        f.startsWith("Evolucion-") && fs.statSync(path.join(scriptsDir, f)).isDirectory()
    );

    if (!evolutions.length) {
        console.log("⚠️ No hay reportes de evolución.");
        return;
    }

    const evolDir = evolutions.sort((a, b) =>
        fs.statSync(path.join(scriptsDir, b)).mtime - fs.statSync(path.join(scriptsDir, a)).mtime
    )[0];

    const reportPath = path.join(scriptsDir, evolDir, "security_and_evolution.json");

    if (!fs.existsSync(reportPath)) {
        console.log("⚠️ Falta security_and_evolution.json");
        return;
    }

    const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));

    console.log("\n📊 Scripts y módulos:");
    console.log(`  Scripts: ${report.currentGraph.scripts.every(Boolean) ? "✅ OK" : "⚠️ Faltan"}`);
    console.log(`  Módulos: ${report.currentGraph.modules.every(Boolean) ? "✅ OK" : "⚠️ Faltan"}`);

    console.log("\n🌍 Locales:");
    Object.keys(report.currentGraph.locales).forEach(lang => {
        console.log(`  - ${lang}`);
    });

    console.log("\n✅ Resumen completado\n");
}

if (import.meta.url === `file://${process.argv[1]}`) {
    runSummary();
}
