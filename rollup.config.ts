import typescript from "@rollup/plugin-typescript";

/**
 * @type {import('rollup').RollupOptions}
 */
export default {
    input: ["app.ts"],
    output: {
        dir: "public/dist",
        format: "iife"
    },
    plugins: [typescript()]
};
