import { defineConfig } from "vitepress";

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
    ],

    sidebar: {
      "/or-opt/": [
        { text: "运筹优化", link: "/or-opt/" },
        { text: "列生成", link: "/or-opt/column-generation" },
        { text: "拉格朗日", link: "/or-opt/lagrangian" },
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
