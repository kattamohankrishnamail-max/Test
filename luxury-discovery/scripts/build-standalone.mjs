// Builds dist/luxury-discovery.html: one self-contained file (React app, matching engine,
// Excel reader and styles inlined) that opens by double-click, with no server.
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "dist");
mkdirSync(out, { recursive: true });

const swap = {
  name: "standalone-swaps",
  setup(build) {
    // Local data instead of API routes; browser build of ExcelJS instead of the Node one.
    build.onResolve({ filter: /^@\/lib\/client-api$/ }, () => ({ path: path.join(root, "standalone/client-api.ts") }));
    build.onResolve({ filter: /^exceljs$/ }, () => ({ path: path.join(root, "node_modules/exceljs/dist/exceljs.min.js") }));
  },
};

const js = await esbuild.build({
  entryPoints: [path.join(root, "standalone/main.tsx")],
  bundle: true,
  write: false,
  minify: true,
  format: "iife",
  target: "es2020",
  jsx: "automatic",
  tsconfig: path.join(root, "tsconfig.json"),
  define: { "process.env.NODE_ENV": '"production"' },
  plugins: [swap],
  logLevel: "warning",
});

const cssFile = path.join(out, ".standalone.css");
execFileSync(path.join(root, "node_modules/.bin/tailwindcss"), ["-i", "app/globals.css", "-o", cssFile, "--minify"], {
  cwd: root,
  stdio: "inherit",
});
const css = readFileSync(cssFile, "utf8");

const script = js.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Floors &amp; Pillars — Find a Home That Fits Your Life</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@400;500&display=swap">
<style>:root{--font-cormorant:"Cormorant Garamond";--font-inter:"Inter"}</style>
<style>${css}</style>
</head>
<body class="min-h-screen">
<div id="root"></div>
<script>${script}</script>
</body>
</html>
`;
writeFileSync(path.join(out, "luxury-discovery.html"), html);
console.log(`dist/luxury-discovery.html  ${(html.length / 1024).toFixed(0)} KB`);
