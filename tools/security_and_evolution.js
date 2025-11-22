import fs from "fs";
import path from "path";
import { BASE_PATH, scriptsToCheck, modulesToCheck, locales } from "./generateGraph.js";

export function generateSecurityEvolution() {
    const resultsDir = "tools";
    const outputDir = path.join(resultsDir, `Evolucion-${new Date().toISOString().replace(/[:.]/g, "-")}`);

    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const report = {
        currentGraph: {
            basePath: BASE_PATH,
            scripts: scriptsToCheck,
            modules: modulesToCheck,
            locales,
            timestamp: new Date().toISOString()
        }
    };

    const reportPath = path.join(outputDir, "security_and_evolution.json");
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log(`✅ Informe generado en ${outputDir}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
    generateSecurityEvolution();
}
