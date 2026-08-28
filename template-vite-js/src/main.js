import { signal, html, mount } from "@elurjs/core";

function App() {
    const count = signal(0);

    return html`
        <main>
            <h1><img src="/elur-logo.png" alt="Elur Logo" /> Elur + Vite</h1>
            <p>Sin compilador. Sin bundler. Solo la web nativa.</p>
            <button @click=${() => count.update((c) => c + 1)}>
                Clicks: ${() => count.value}
            </button>
        </main>
    `;
}

mount(App(), "#app");