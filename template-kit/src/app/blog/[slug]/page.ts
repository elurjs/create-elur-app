import { html } from "@deijose/nix-js";
import type { ContentEntry } from "@deijose/nix-js-kit/content";

export default ({ post }: { post: ContentEntry<{ title: string }> }) => html`
  <article>
    <h1>${post.data.title}</h1>
    <p>By Nix.js Kit</p>
    <div>${post.body}</div>
    <a href="/" data-nix-js-link>← Back home</a>
  </article>
`;
