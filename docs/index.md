---
layout: home

hero:
  name: 个人知识库
  text: 笔记 · 运筹 · 智能
  tagline: 面向长期积累的知识站点：Markdown 撰写、清晰导航、深浅色与全文搜索。版式与阅读节奏参考「笑笑的站」，引擎采用 VitePress。
  actions:
    - theme: brand
      text: 关于本站
      link: /about/
    - theme: alt
      text: 运筹优化
      link: /or-opt/
    - theme: alt
      text: 人工智能
      link: /ai/

features:
  - icon: 📚
    title: 分区清晰
    details: About / 运筹优化 / 人工智能 三大板块，侧栏与顶栏一致可达，便于日后扩展子页面。
  - icon: ✍️
    title: Markdown 优先
    details: 正文全部在 docs 下维护，Git 管理版本；支持代码高亮、表格、提示块等常用语法。
  - icon: 🎨
    title: 阅读向排版
    details: 霞鹜文楷屏幕阅读版字体 + Material Teal 强调色 + 留白与圆角卡片，降低长文疲劳。
  - icon: 🌗
    title: 深浅色
    details: 一键切换浅色 / 深色，系统偏好自动匹配，代码主题同步。
  - icon: 🔎
    title: 本地搜索
    details: 无需第三方服务，构建时生成索引，离线预览同样可用。
  - icon: 🚀
    title: GitHub Pages
    details: 推送 main 自动构建并发布静态资源，适合个人公开知识库。
---

## 快速入口

| 入口 | 说明 |
|------|------|
| [About](/about/) | 站点说明、本地预览与发布、维护约定 |
| [运筹优化](/or-opt/) | 规划、优化、仿真等笔记入口 |
| [人工智能](/ai/) | 机器学习 / 深度学习 / 应用笔记入口 |
| [GitHub 仓库](https://github.com/yupli/Personal) | 源码与 Actions |

## 致谢与参考

本站视觉与信息架构受到 [SmilingWayne/me](https://github.com/SmilingWayne/me)（线上：[笑笑的站](https://smilingwayne.github.io/me/)）的启发：对方使用 **MkDocs Material** 与手写导航构建大型个人站点；本站用 **VitePress** 实现相近的「文档站」体验，并保留你的三栏内容结构。

::: tip 小提示
新增任意 `.md` 后，记得在 `docs/.vitepress/config.mts` 的 `sidebar` 里登记链接，侧栏才会出现对应条目。
:::
