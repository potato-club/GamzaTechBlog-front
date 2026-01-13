import { defineConfig } from "orval";

export default defineConfig({
  gamzaTech: {
    input: "https://gamzatech.site/v3/api-docs/all",
    output: {
      mode: "tags-split",
      target: "src/generated/orval",
      schemas: "src/generated/orval/models",
      client: "react-query",
      baseUrl: "https://gamzatech.site",
      override: {
        mutator: {
          path: "./src/lib/orvalFetcher.ts",
          name: "orvalFetcher",
        },
        query: {
          useQuery: true,
          useMutation: true,
          signal: true,
        },
      },
    },
  },
});
