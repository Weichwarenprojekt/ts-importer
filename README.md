<div align="center">
    <br>
    <img src="assets/logo.png" width="350" alt=""/>
</div>

# Quickstart

Ts importer is a small library that allows you to load typescript files at runtime.

**Installation**

```
npm i --save-dev @weichwarenprojekt/ts-importer
```

**Usage**

The library only offers the "loadModule" function.
You can simply call it like this:

```javascript
loadModule("/absolute/path/to/the/module.ts");
```

In case you have special requirements you can also override the transpileOptions for the typescript transpiler by
providing the TranspileOptions as second parameter:

```javascript
loadModule("/absolute/path/to/the/module.ts", {
    compilerOptions: { target: ScriptTarget.ES2016, module: ModuleKind.CommonJS },
    fileName: "whatever",
});
```
