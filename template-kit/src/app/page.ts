import { html } from "@elurjs/core";

export default () => html`
  <main>
    <h1>Welcome to Elur Kit</h1>
    <p>A full-stack meta-framework built on Elur.</p>
    <nav>
      <a href="/" data-elur-link>Home</a>
      <a href="/about" data-elur-link>About</a>
      <a href="/blog/hello-world" data-elur-link>Blog</a>
    </nav>
  </main>
`;
