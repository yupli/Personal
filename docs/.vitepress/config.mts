import { defineConfig } from "vitepress";

// GitHub Pages 项目站路径；若改用自定义域名或用户主页仓库，可改为 "/"
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
