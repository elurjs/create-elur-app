import { html } from "@deijose/nix-js";

export default ({ title }: { title: string }) => html`
  <main>
    <h1>${title}</h1>
    <p>This is the about page, rendered with server-side data.</p>
    <a href="/" data-nix-js-link>← Back home</a>
  </main>
`;
