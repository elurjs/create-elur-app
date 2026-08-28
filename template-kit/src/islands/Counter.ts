import { signal } from "@elurjs/core";
import { html } from "@elurjs/core";

export default function Counter() {
  const count = signal(0);
  return html`
    <div>
      <p>Count: ${count}</p>
      <button onclick=${() => count.value++}>Increment</button>
    </div>
  `;
}
