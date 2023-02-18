import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { loadModule } from "../src";
import path from "path";
import ts, { ModuleKind, ScriptTarget, TranspileOptions } from "typescript";

describe("loadModule(filePath: string)", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('throws if "filePath" is relative', () => {
        expect(() => loadModule("relativePath.js")).toThrow(new Error("The path to the module has to be absolute!"));
    });

    it("loads typescript module", () => {
        const exports = loadModule(path.resolve(__dirname, "simple-typescript.ts"));
        expect(exports).toEqual({ simpleTypescript: "Simple Typescript" });
    });

    it("loads javascript module", () => {
        const exports = loadModule(path.resolve(__dirname, "simple-javascript.js"));
        expect(exports).toEqual({ simpleJavascript: "Simple Javascript" });
    });

    it("forwards the global object", () => {
        const consoleLog = jest.spyOn(console, "log").mockImplementation(() => {});
        const exports = loadModule(path.resolve(__dirname, "complex.ts"));
        expect(consoleLog).toHaveBeenCalledTimes(1);
        expect(consoleLog).toHaveBeenCalledWith("This log should come through to the original context.");
        expect(exports).toEqual({
            dirname: __dirname,
            filename: path.resolve(__dirname, "complex.ts"),
            processCwd: process.cwd(),
        });
        consoleLog.mockRestore();
    });

    it("sets the correct file- and dirname", () => {
        const exports = loadModule(path.resolve(__dirname, "nested/filename.ts"));
        expect(exports).toEqual({
            dirname: path.resolve(__dirname, "nested"),
            filename: path.resolve(__dirname, "nested", "filename.ts"),
        });
    });

    it('provides "require" method that works with relative paths', () => {
        const exports = loadModule(path.resolve(__dirname, "nested/import.ts"));
        expect(exports).toEqual({
            filename: {
                dirname: path.resolve(__dirname, "nested"),
                filename: path.resolve(__dirname, "nested", "filename.ts"),
            },
        });
    });

    it("overrides transpileOptions if given", () => {
        const transpileOptions: TranspileOptions = {
            compilerOptions: { allowJs: true, target: ScriptTarget.ES2016, module: ModuleKind.CommonJS },
            fileName: "whatever",
        };
        const tsTranspile = jest.spyOn(ts, "transpileModule");
        const exports = loadModule(path.resolve(__dirname, "simple-typescript.ts"), transpileOptions);
        expect(exports).toEqual({ simpleTypescript: "Simple Typescript" });
        expect(tsTranspile).toHaveBeenCalledWith(
            'export const simpleTypescript = "Simple Typescript";',
            transpileOptions,
        );
    });
});
