const esbuild = require("esbuild");
const packageJson = require("./package.json");
const fs = require("fs");

// Delete the dist folder
const deleteDist = () => fs.rmSync("dist", { force: true, recursive: true });
deleteDist();

// Bundle the cli
const options = {
    entryPoints: ["./src/index.ts"],
    platform: "node",
    external: Object.keys(packageJson.dependencies),
    minify: true,
    bundle: true,
};
esbuild
    .build({
        ...options,
        outfile: "./dist/index.js",
        format: "cjs",
    })
    .catch(deleteDist);
esbuild
    .build({
        ...options,
        outfile: "./dist/index.mjs",
        format: "esm",
    })
    .catch(deleteDist);
