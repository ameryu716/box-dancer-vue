import { createApp } from "vue";
import "./style.scss";
import "./base.scss";
import App from "./App.vue";
import naive from "naive-ui";

const app = createApp(App);
app.use(naive).mount("#app");
