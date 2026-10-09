import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import path from "path";
import fs from "fs";
import { BLOG_POSTS } from "./src/lib/blog-posts";
import { PROMPT_GROUPS } from "./src/lib/blog-prompts";

function exportBlogData(): Plugin {
  return {
    name: "export-blog-data",
    apply: "build",
    closeBundle() {
      fs.writeFileSync(
        path.resolve(__dirname, "dist/blog-posts.json"),
        JSON.stringify(BLOG_POSTS)
      );
    },
  };
}

function exportPromptsData(): Plugin {
  return {
    name: "export-prompts-data",
    apply: "build",
    closeBundle() {
      fs.writeFileSync(
        path.resolve(__dirname, "dist/prompts-data.json"),
        JSON.stringify(PROMPT_GROUPS)
      );
    },
  };
}

export default defineConfig({
  plugins: [
    TanStackRouterVite({ routesDirectory: "./src/routes", generatedRouteTree: "./src/routeTree.gen.ts" }),
    react(),
    tailwindcss(),
    exportBlogData(),
    exportPromptsData(),
  ],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom"],
          "vendor-router": ["@tanstack/react-router"],
          "vendor-query": ["@tanstack/react-query"],
          "vendor-ui": ["sonner", "clsx", "tailwind-merge", "class-variance-authority", "lucide-react"],
        },
      },
    },
  },
});
