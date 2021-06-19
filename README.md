# rafsort

Demonstration of various sorting algorithms, in JavaScript and C (compiled to WASM).

![raf](https://cdn.discordapp.com/avatars/218965601903706113/9a672cff7729f94a5ce72de35b143ed5.webp)

## Development

After installing all dependencies with yarn, you can start the development server:

```
$ yarn start
yarn run v1.22.10
$ (snowpack dev &); node server.js
Listening on port 8081
[12:11:44] [snowpack] Ready!
[12:11:44] [snowpack] Server started in 39ms.
[12:11:44] [snowpack] Local: http://localhost:8080
[12:11:44] [snowpack] Network: http://192.168.0.1:8080
[12:11:45] [@snowpack/plugin-typescript] 11:10:45 AM - Starting compilation in watch mode...
[12:11:51] [@snowpack/plugin-typescript] 11:10:51 AM - Found 0 errors. Watching for file changes.
⠏ watching for file changes...
```

Open `http://localhost:8081` in a browser to view it.

Why does it run on ports 8080 and 8081? Port 8080 is the Snowpack development server. Unfortunately, it does not allow you to set custom response headers ([yet!](https://github.com/snowpackjs/snowpack/pull/3413)), so `yarn start` also starts a tiny Node.js proxy server on port 8081 which adds two headers that are required for `SharedArrayBuffer` to work.

### C compilation

If you want to change or recompile the C source files, you need:

- clang 8 or newer
- lld
- GNU make

Inside the `c` folder, you can use several Make targets:

- `make` or `make install` will compile all C files into a single WebAssembly module and copy it into `public`, where it can be seen by JavaScript code.
- `make sorts.wasm` will only compile this file, without copying it.
- `make clean` will delete all object files and the final module from the source directory (but not from the `public` directory).
