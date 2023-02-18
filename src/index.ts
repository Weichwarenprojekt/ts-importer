import fs from "fs";
import ts, { ScriptTarget, TranspileOptions } from "typescript";
import vm from "vm";
import path from "path";
import { createRequire } from "module";

/**
 * Creates a copy of the global object
 */
function getGlobalCopy(): typeof global {
    const globalCopy = {} as typeof global;
    const globalProps = Object.getOwnPropertyNames(global);
    const globalSymbols = Object.getOwnPropertySymbols(global);
    globalProps.forEach((prop) => {
        // @ts-ignore
        globalCopy[prop] = global[prop];
    });
    globalSymbols.forEach((symbol) => {
        // @ts-ignore
        globalCopy[symbol] = global[symbol];
    });
    return globalCopy;
}

/**
 * Loads a module (either js or ts) and transpiles it if necessary
 * @param filePath The absolute path to the source file
 * @param transpileOptions The options for the typescript transpiler
 */
export function loadModule<T>(filePath: string, transpileOptions?: TranspileOptions) {
    // Only allow absolute paths to avoid confusion
    if (!path.isAbsolute(filePath)) throw new Error("The path to the module has to be absolute!");

    // Read in the file and transpile if necessary
    const tsCode = fs.readFileSync(filePath, "utf8");
    const jsCode = ts.transpileModule(
        tsCode,
        transpileOptions ?? {
            compilerOptions: { module: ts.ModuleKind.CommonJS, target: ScriptTarget.ES2015 },
        },
    ).outputText;
    const exports = {} as T;
    const globalObject = getGlobalCopy();
    vm.runInNewContext(
        jsCode,
        vm.createContext(
            Object.assign(globalObject, {
                module: {
                    exports,
                },
                exports,
                __dirname: path.dirname(filePath),
                __filename: filePath,
                require: createRequire(filePath),
            }),
        ),
    );
    return exports;
}
