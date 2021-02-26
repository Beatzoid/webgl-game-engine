import { Engine } from "./core/engine";

const engine: Engine = new Engine();

// The main entry point for the app
window.onload = function () {
    engine.start();
};

window.onresize = function () {
    engine.resize();
};
