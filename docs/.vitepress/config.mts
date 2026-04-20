import { defineConfig } from "vitepress";

// 须与浏览器里的项目路径一致：https://<用户>.github.io/<仓库名>/
// 若实际 URL 为小写 /personal/，这里改为 "/personal/"
const BASE = "/Personal/";

export default defineConfig({
  title: "个人知识库",
  description: "运筹优化与人工智能 · 极简笔记站",
  lang: "zh-CN",
  base: BASE,

  appearance: true,

  markdown: {
    theme: {
      light: "github-light",
      dark: "github-dark",
    },
  },

  themeConfig: {
    logo: { src: "/logo.svg", alt: "知识库" },

    nav: [
      { text: "首页", link: "/" },
      { text: "About", link: "/about/", activeMatch: "/about/" },
      { text: "运筹优化", link: "/or-opt/", activeMatch: "/or-opt/" },
      { text: "人工智能", link: "/ai/", activeMatch: "/ai/" },
    ],

    sidebar: {
      "/about/": [{ text: "关于本站", link: "/about/" }],
      "/or-opt/": [{ text: "运筹优化", link: "/or-opt/" }],
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

    outline: {
      label: "本页目录",
      level: [2, 3],
    },

    docFooter: {
      prev: "上一篇",
      next: "下一篇",
    },

    returnToTopLabel: "回到顶部",
    sidebarMenuLabel: "目录菜单",
    darkModeSwitchLabel: "外观",
    lightModeSwitchTitle: "切换为浅色",
    darkModeSwitchTitle: "切换为深色",

    socialLinks: [
      { icon: "github", link: "https://github.com/yupli/Personal" },
    ],

    footer: {
      message: "运筹优化 · 人工智能 · 个人笔记",
      copyright: "Copyright © yupli",
    },
  },
});
