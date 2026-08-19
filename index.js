#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import prompts from 'prompts';
import { blue, green, yellow, reset } from 'kolorist';

const cwd = process.cwd();

async function init() {
    console.log(blue('\n❄️ ¡Bienvenido a Nix.js!\n'));

    const response = await prompts([
        {
            type: 'text',
            name: 'projectName',
            message: 'Nombre de tu proyecto:',
            initial: 'nix-app'
        },
        {
            type: 'select',
            name: 'variant',
            message: '¿Qué variante quieres usar?',
            choices: [
                { title: green('Nix.js Kit (Full-stack)'), value: 'kit', description: 'SSR/SSG, routing, islands, actions, content — meta-framework completo' },
                { title: yellow('Vite + TypeScript'), value: 'vite-ts', description: 'Recomendado para DX rápida y tipado estricto' },
                { title: yellow('Vite + JavaScript'), value: 'vite-js', description: 'Vite sin compilación de TS' },
                { title: blue('Ionic + Nix.js (Capacitor)'), value: 'nix-ionic', description: 'Template oficial con nix-ionic (Nix.js + Ionic + Capacitor)' },
                { title: blue('Ionic + Nix.js + Tabs'), value: 'nix-ionic-tabs', description: 'Template completo con IonRouterOutlet + createBottomTabBar + guards' },
                { title: blue('Vanilla TypeScript'), value: 'vanilla-ts', description: 'Sin bundler, puro TSC' },
                { title: blue('Vanilla JavaScript'), value: 'vanilla-js', description: 'Cero build, import maps directo en navegador' }
            ]
        }
    ]);

    if (!response.projectName || !response.variant) {
        console.log('\nOperación cancelada. ¡Hasta pronto!');
        return;
    }

    const targetDir = response.projectName;
    const templateName = `template-${response.variant}`;
    const root = path.join(cwd, targetDir);

    if (!fs.existsSync(root)) {
        fs.mkdirSync(root, { recursive: true });
    }

    const templateDir = path.resolve(
        fileURLToPath(import.meta.url),
        `../${templateName}`
    );

    const copy = (src, dest) => {
        const stat = fs.statSync(src);
        if (stat.isDirectory()) {
            if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
            for (const file of fs.readdirSync(src)) {
                if (file === 'node_modules') continue;
                copy(path.resolve(src, file), path.resolve(dest, file));
            }
        } else {
            const targetFile = path.basename(dest) === '_gitignore'
                ? dest.replace('_gitignore', '.gitignore')
                : dest;
            fs.copyFileSync(src, targetFile);
        }
    };

    copy(templateDir, root);

    const pkgPath = path.join(root, 'package.json');
    if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        pkg.name = targetDir;
        fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    }

    // 6. Mensajes de éxito
    console.log(green(`\n¡Proyecto creado con éxito en ./${targetDir}!`));
    console.log(`Variante seleccionada: ${reset(response.variant)}`);
    console.log(`\nSiguientes pasos:`);
    console.log(`  cd ${targetDir}`);
    console.log(`  npm install`);
    console.log(`  npm run dev\n`);
}

init().catch((e) => {
    console.error(e);
});