import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import path from "path";
import fs from "fs";
import { BLOG_POSTS } from "./src/lib/blog-posts";

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

export default defineConfig({
  plugins: [
    TanStackRouterVite({ routesDirectory: "./src/routes", generatedRouteTree: "./src/routeTree.gen.ts" }),
    react(),
    tailwindcss(),
    exportBlogData(),
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
