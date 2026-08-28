import { html } from "@elurjs/core";
import type { ContentEntry } from "@elurjs/kit/content";

export default ({ post }: { post: ContentEntry<{ title: string }> }) => html`
  <article>
    <h1>${post.data.title}</h1>
    <p>By Elur Kit</p>
    <div>${post.body}</div>
    <a href="/" data-elur-link>← Back home</a>
  </article>
`;
