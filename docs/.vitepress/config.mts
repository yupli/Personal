import { defineConfig } from "vitepress";
import mathjax3 from "markdown-it-mathjax3";
import container from "markdown-it-container";

const BASE = "/Personal/";

export default defineConfig({
  title: "个人知识库",
  description: "运筹优化与人工智能笔记",
  lang: "zh-CN",
  base: BASE,

  appearance: true,
  lastUpdated: true,

  head: [
    ["link", { rel: "icon", href: "/logo.svg", type: "image/svg+xml" }],
    ["meta", { name: "theme-color", content: "#00897b" }],
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
    logo: { src: "/logo.svg", alt: "知识库" },

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
      { text: "自白记录", link: "/essays/", activeMatch: "/essays/" },
    ],

    sidebar: {
      "/or-opt/": [
        { text: "运筹优化", link: "/or-opt/" },
        { text: "分支定界", link: "/or-opt/branch-and-bound" },
        { text: "分支切割", link: "/or-opt/branch-and-cut" },
        { text: "列生成", link: "/or-opt/column-generation" },
        { text: "拉格朗日", link: "/or-opt/lagrangian" },
      ],
      "/ai/": [{ text: "人工智能", link: "/ai/" }],
      "/essays/": [{ text: "自白记录", link: "/essays/" }],
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

    outline: { label: "本页目录", level: [2, 3] },

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
