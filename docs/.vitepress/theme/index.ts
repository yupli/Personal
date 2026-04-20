import DefaultTheme from "vitepress/theme";
import { h } from "vue";
import "./custom.css";
import PasswordProtect from "./components/PasswordProtect.vue";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("PasswordProtect", PasswordProtect);
  },
};
