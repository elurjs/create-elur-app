import { defineCollection } from "@elurjs/kit/content";

export const collections = {
  blog: defineCollection({
    schema: undefined, // Add zod schema for validation
  }),
};
