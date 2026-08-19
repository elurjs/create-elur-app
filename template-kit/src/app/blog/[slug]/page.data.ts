import type { PageDataLoad } from "@deijose/nix-js-kit";
import { getEntry } from "@deijose/nix-js-kit/content";

export const load: PageDataLoad = async ({ params }) => {
  const post = await getEntry("blog", params.slug as string);
  if (!post) {
    throw new Response("Not found", { status: 404 });
  }
  return { post };
};
