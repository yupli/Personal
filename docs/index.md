---
layout: home

hero:
  name: 个人知识库
  text: 运筹优化 · 人工智能
  tagline: Markdown 笔记，本地撰写、静态发布。
  actions:
    - theme: brand
      text: About
      link: /about/
    - theme: alt
      text: 运筹优化
      link: /or-opt/
    - theme: alt
      text: 人工智能
      link: /ai/

features:
  - icon: 📚
    title: 三个分区
    details: About、运筹优化、人工智能；新页面在 config 侧栏登记后出现。
  - icon: ✍️
    title: Markdown
    details: 正文均在 docs 目录，Git 版本管理。
  - icon: 🚀
    title: 发布
    details: 本地执行 npm run deploy:gh，Pages 指向 gh-pages 根目录。
---

新文章：在对应目录添加 `.md`，并在 `docs/.vitepress/config.mts` 的 `sidebar` 中增加链接。
