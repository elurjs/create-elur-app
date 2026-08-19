import { html } from "@deijose/nix-js";

export default () => html`
  <header>
    <nav>
      <a href="/" data-nix-js-link>Home</a>
      <a href="/about" data-nix-js-link>About</a>
      <a href="/blog/hello-world" data-nix-js-link>Blog</a>
    </nav>
  </header>
`;
