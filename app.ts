import { Engine } from "./core/engine";

let engine: Engine;

// The main entry point for the app
window.onload = function () {
    engine = new Engine();
    engine.start();
};

window.onresize = function () {
    engine.resize();
};
