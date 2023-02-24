import * as path from "path";

console.log("This log should come through to the original context.");

export const pathResolve = path.resolve(__dirname, "pathResolve");
export const processCwd = process.cwd();
export const filename = __filename;
export const dirname = __dirname;
