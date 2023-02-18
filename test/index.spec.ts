import { describe, expect, it } from "@jest/globals";

describe("Index E2E", () => {
    it("exports all members", () => {
        const exports = require("../dist/index.js");
        expect(Object.keys(exports).length).toEqual(1);
        expect(exports.loadModule).toEqual(expect.any(Function));
    });
});
