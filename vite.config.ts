import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, ssrBuild }) => {
    const env = loadEnv(mode, process.cwd(), "");
    console.log(command);
    console.log(mode);
    if (command === "serve") {
        return {
            plugins: [vue()],
        };
    } else {
        return {
            plugins: [vue()],
            base: env.BUILD_BASE_URL,
        };
    }
});
