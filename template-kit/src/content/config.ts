import { defineCollection } from "@deijose/nix-js-kit/content";

export const collections = {
  blog: defineCollection({
    schema: undefined, // Add zod schema for validation
  }),
};
