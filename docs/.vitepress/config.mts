import { defineConfig } from "vitepress";
import mathjax3 from "markdown-it-mathjax3";
import container from "markdown-it-container";

const BASE = "/Personal/";
/** 与换色/换标后递增，破 favicon/导航 logo 的强缓存 */
const LOGO_ASSET = `${BASE}logo.svg?v=2`;

export default defineConfig({
  title: "个人知识库",
  description: "运筹优化与人工智能笔记",
  lang: "zh-CN",
  base: BASE,

  appearance: true,
  lastUpdated: true,

  head: [
    ["link", { rel: "icon", href: LOGO_ASSET, type: "image/svg+xml" }],
    ["link", { rel: "apple-touch-icon", href: LOGO_ASSET }],
    ["meta", { name: "theme-color", content: "#1976d2" }],
  ],

  markdown: {
    theme: { light: "github-light", dark: "github-dark" },
    lineNumbers: true,
    config: (md) => {
      md.use(mathjax3);
      // 自定义 algorithm 容器
      md.use(container, "algorithm", {
        render(tokens, idx, _options, env) {
          const token = tokens[idx];
          const info = token.info.trim().slice("algorithm".length).trim();
          if (token.nesting === 1) {
            const title = info || "算法流程";
            return `<div class="custom-block algorithm"><p class="custom-block-title">▶ ${title}</p>\n`;
          } else {
            return `</div>\n`;
          }
        },
      });
    },
  },

  themeConfig: {
    logo: { src: "/logo.svg?v=2", alt: "知识库" },

    editLink: {
      pattern: "https://github.com/yupli/Personal/edit/main/docs/:path",
      text: "在 GitHub 上编辑此页",
    },

    lastUpdated: {
      text: "更新于",
      formatOptions: { dateStyle: "medium", timeStyle: "short" },
    },

    nav: [
      { text: "首页", link: "/" },
      { text: "运筹优化", link: "/or-opt/", activeMatch: "/or-opt/" },
      { text: "人工智能", link: "/ai/", activeMatch: "/ai/" },
    ],

    sidebar: {
      "/or-opt/": [
        { text: "运筹优化", link: "/or-opt/" },
        {
          text: "建模方法",
          collapsed: false,
          items: [
            { text: "整数规划建模技巧", link: "/or-opt/integer-modeling-techniques" },
          ],
        },
        {
          text: "精确算法",
          link: "/or-opt/exact-algorithms",
          collapsed: false,
          items: [
            { text: "分支定界（Branch and Bound）", link: "/or-opt/branch-and-bound" },
            { text: "分支切割（Branch and Cut）", link: "/or-opt/branch-and-cut" },
            { text: "列生成（Column Generation）", link: "/or-opt/column-generation" },
            { text: "分支定价（Branch-and-Price）", link: "/or-opt/branch-and-price" },
            { text: "分支定价切割（Branch-Price-and-Cut）", link: "/or-opt/branch-price-and-cut" },
            { text: "Dantzig-Wolfe分解（Dantzig–Wolfe Decomposition）", link: "/or-opt/dantzig-wolfe" },
            { text: "Benders分解（Benders Decomposition）", link: "/or-opt/benders" },
            { text: "拉格朗日（Lagrangian Relaxation）", link: "/or-opt/lagrangian" },
          ],
        },
        {
          text: "启发式算法",
          link: "/or-opt/heuristic-algorithms",
          collapsed: false,
          items: [
            { text: "基础启发式（Simple Heuristics）", link: "/or-opt/simple-heuristics" },
            { text: "元启发式（Metaheuristics）", link: "/or-opt/metaheuristics" },
            { text: "超启发式（Hyper-heuristics）", link: "/or-opt/hyper-heuristics" },
          ],
        },
        {
          text: "图算法",
          collapsed: false,
          items: [
            { text: "Dijkstra", link: "/or-opt/dijkstra" },
            { text: "Bellman-Ford", link: "/or-opt/bellman-ford" },
          ],
        },
      ],
      "/ai/": [{ text: "人工智能", link: "/ai/" }],
    },

    search: {
      provider: "local",
      options: {
        locales: {
          root: {
            translations: {
              button: { buttonText: "搜索", buttonAriaLabel: "搜索文档" },
              modal: {
                noResultsText: "未找到结果",
                resetButtonTitle: "清除",
                footer: {
                  selectText: "选择",
                  navigateText: "切换",
                  closeText: "关闭",
                },
              },
            },
          },
        },
      },
    },

    /* h2–h4 纳入侧栏目录，长文好跳转 */
    outline: { label: "本页目录", level: [2, 4] },

    docFooter: { prev: "上一篇", next: "下一篇" },

    returnToTopLabel: "回到顶部",
    sidebarMenuLabel: "菜单",
    darkModeSwitchLabel: "外观",
    lightModeSwitchTitle: "浅色",
    darkModeSwitchTitle: "深色",

    socialLinks: [
      { icon: "github", link: "https://github.com/yupli/Personal" },
    ],

    footer: {
      message: "个人笔记",
      copyright: "Copyright © yupli",
    },
  },
});
