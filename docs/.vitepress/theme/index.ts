import { h } from "vue";
import DefaultTheme from "vitepress/theme";
import SiteSearch from "./components/SiteSearch.vue";
import ReadingToolbar from "./components/ReadingToolbar.vue";
import ReadingShelf from "./components/ReadingShelf.vue";
import DocumentTools from "./components/DocumentTools.vue";
import "./custom.css";
import "./site-tools.css";

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {
    "nav-bar-content-before": () => h(SiteSearch),
    "doc-before": () => h(ReadingToolbar),
    "home-features-after": () => h(ReadingShelf),
    "layout-bottom": () => h(DocumentTools),
  }),
};
