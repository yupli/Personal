---
layout: home

hero:
  name: 个人知识库
  text: 运筹优化 · 人工智能
  tagline: Markdown 笔记，本地撰写、静态发布。
  actions:
    - theme: brand
      text: 运筹优化
      link: /or-opt/
    - theme: alt
      text: 人工智能
      link: /ai/

features:
  - icon: 📚
    title: 两个分区
    details: 运筹优化、人工智能；新页面在 config 侧栏登记后出现。
  - icon: ✍️
    title: Markdown
    details: 正文在 docs/or-opt 与 docs/ai，Git 版本管理。
  - icon: 🚀
    title: 发布
    details: 本地执行 npm run deploy:gh，Pages 指向 gh-pages 根目录。
---

新文章：在 `docs/or-opt/` 或 `docs/ai/` 添加 `.md`，并在 `docs/.vitepress/config.mts` 的 `sidebar` 中增加链接。
