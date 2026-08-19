import { html } from "@deijose/nix-js";

export default () => html`
  <main>
    <h1>Welcome to Nix.js Kit</h1>
    <p>A full-stack meta-framework built on Nix.js.</p>
    <nav>
      <a href="/" data-nix-js-link>Home</a>
      <a href="/about" data-nix-js-link>About</a>
      <a href="/blog/hello-world" data-nix-js-link>Blog</a>
    </nav>
  </main>
`;
