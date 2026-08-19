import { signal } from "@deijose/nix-js";
import { html } from "@deijose/nix-js";

export default function Counter() {
  const count = signal(0);
  return html`
    <div>
      <p>Count: ${count}</p>
      <button onclick=${() => count.value++}>Increment</button>
    </div>
  `;
}
