import { signal, html, mount } from "@elurjs/core";
import type { ElurTemplate } from "@elurjs/core";

function App(): ElurTemplate {
    const count = signal<number>(0);

    return html`
        <main>
            <h1><img src="/elur-logo.png" alt="Elur Logo" /> Elur + Vite + TypeScript</h1>
            <button @click=${() => count.update((c: number) => c + 1)}>
                Clicks: ${() => count.value}
            </button>
        </main>
    `;
}

mount(App(), "#app");