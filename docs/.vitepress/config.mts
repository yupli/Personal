import { defineConfig } from "vitepress";

// 须与浏览器里的项目路径一致：https://<用户>.github.io/<仓库名>/
// 若实际 URL 为小写 /personal/，这里改为 "/personal/"
const BASE = "/Personal/";

export default defineConfig({
  title: "个人知识库",
  description: "运筹优化与人工智能相关笔记",
  lang: "zh-CN",
  base: BASE,

  themeConfig: {
    nav: [
      { text: "About", link: "/about/", activeMatch: "/about/" },
      { text: "运筹优化", link: "/or-opt/", activeMatch: "/or-opt/" },
      { text: "人工智能", link: "/ai/", activeMatch: "/ai/" },
    ],

    sidebar: {
      "/about/": [{ text: "关于", link: "/about/" }],
      "/or-opt/": [{ text: "运筹优化", link: "/or-opt/" }],
      "/ai/": [{ text: "人工智能", link: "/ai/" }],
    },

    search: { provider: "local" },

    socialLinks: [
      { icon: "github", link: "https://github.com/yupli/Personal" },
    ],

    footer: {
      message: "个人学习笔记",
      copyright: "Copyright © yupli",
    },
  },
});
