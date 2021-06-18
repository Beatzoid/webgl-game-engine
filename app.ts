let engine: TSE.Engine;

// The main entry point for the app
window.onload = function () {
    engine = new TSE.Engine();
    engine.start();
};

window.onresize = function () {
    engine.resize();
};
