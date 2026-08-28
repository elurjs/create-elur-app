import { html } from "@elurjs/core";

export default () => html`
  <header>
    <nav>
      <a href="/" data-elur-link>Home</a>
      <a href="/about" data-elur-link>About</a>
      <a href="/blog/hello-world" data-elur-link>Blog</a>
    </nav>
  </header>
`;
