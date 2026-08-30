#!/usr/bin/env node
/**
 * Sincroniza versions.json con las últimas versiones publicadas en npm.
 * Respeta el estilo de rango existente: ^, ~ o "latest".
 * Usa `npm view` (respeta proxy y registry configurados) en vez de fetch directo.
 *
 * Uso: npm run sync:deps
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const catalogPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../versions.json");
const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf-8"));

let updated = 0;

for (const [pkg, range] of Object.entries(catalog)) {
    if (range === "latest") continue; // "latest" se mantiene tal cual

    const result = spawnSync("npm", ["view", pkg, "version"], { encoding: "utf-8" });
    const version = result.status === 0 ? result.stdout.trim() : null;
    if (!version) {
        console.warn(`⚠ ${pkg}: no se pudo consultar el registry, se omite`);
        continue;
    }

    const prefix = range.startsWith("~") ? "~" : range.startsWith("^") ? "^" : "";
    const next = prefix ? prefix + version : version;

    if (next !== range) {
        console.log(`↑ ${pkg}: ${range} → ${next}`);
        catalog[pkg] = next;
        updated++;
    }
}

fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2) + "\n");
console.log(updated === 0 ? "Todo al día ✓" : `${updated} paquete(s) actualizados en versions.json`);
