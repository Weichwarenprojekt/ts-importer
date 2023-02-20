const esbuild = require("esbuild");

esbuild.build({
    entryPoints: ["./src/index.ts"],
    minify: true,
    bundle: true,
    outfile: "./dist/index.js",
    platform: "node",
    external: ["pnpapi"]
});
