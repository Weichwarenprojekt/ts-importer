import esbuild from "esbuild";
import packageJson from "./package.json" assert { type: "json" };
import fs from "fs";

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
        outfile: "./dist/index.cjs",
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
