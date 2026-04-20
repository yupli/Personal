import { defineConfig } from "vitepress";

// 须与浏览器里的项目路径一致：https://<用户>.github.io/<仓库名>/
const BASE = "/Personal/";

export default defineConfig({
  title: "个人知识库",
  titleTemplate: ":title · 知识库",
  description: "运筹优化与人工智能笔记 · 可视化文档站",
  lang: "zh-CN",
  base: BASE,

  appearance: true,
  lastUpdated: true,

  head: [
    ["link", { rel: "icon", href: "/logo.svg", type: "image/svg+xml" }],
    [
      "meta",
      {
        name: "theme-color",
        content: "#0d9488",
        media: "(prefers-color-scheme: light)",
      },
    ],
    [
      "meta",
      {
        name: "theme-color",
        content: "#0f172a",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  ],

  markdown: {
    theme: {
      light: "github-light",
      dark: "github-dark",
    },
    lineNumbers: true,
  },

  themeConfig: {
    logo: { src: "/logo.svg", alt: "知识库" },
    externalLinkIcon: true,

    editLink: {
      pattern:
        "https://github.com/yupli/Personal/edit/main/docs/:path",
      text: "在 GitHub 上编辑此页",
    },

    lastUpdated: {
      text: "更新于",
      formatOptions: {
        dateStyle: "medium",
        timeStyle: "short",
      },
    },

    nav: [
      { text: "首页", link: "/" },
      { text: "About", link: "/about/", activeMatch: "/about/" },
      { text: "运筹优化", link: "/or-opt/", activeMatch: "/or-opt/" },
      { text: "人工智能", link: "/ai/", activeMatch: "/ai/" },
      {
        text: "参考",
        items: [
          {
            text: "笑笑的站（MkDocs 范例）",
            link: "https://smilingwayne.github.io/me/",
          },
          {
            text: "SmilingWayne/me 仓库",
            link: "https://github.com/SmilingWayne/me",
          },
        ],
      },
    ],

    sidebar: {
      "/about/": [
        {
          text: "关于本站",
          items: [{ text: "概览与维护", link: "/about/" }],
        },
      ],
      "/or-opt/": [
        {
          text: "运筹优化",
          items: [{ text: "分区说明", link: "/or-opt/" }],
        },
      ],
      "/ai/": [
        {
          text: "人工智能",
          items: [{ text: "分区说明", link: "/ai/" }],
        },
      ],
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
      message:
        "视觉与信息架构参考 SmilingWayne/me（MkDocs Material）· 本站为 VitePress",
      copyright: "Copyright © yupli",
    },
  },
});
