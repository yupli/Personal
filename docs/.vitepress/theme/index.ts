import DefaultTheme from "vitepress/theme";
import { h } from "vue";
import "./custom.css";
import SecureContent from "./components/SecureContent.vue";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("SecureContent", SecureContent);
  },
};
