import type { PageDataLoad } from "@elurjs/kit";

export const load: PageDataLoad = async () => {
  return {
    title: "About — Elur Kit",
  };
};
