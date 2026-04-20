# About

本仓库用于整理个人知识，站点由 **VitePress** 将 `docs/` 下的 Markdown 构建为静态页。

## 本地预览

```bash
npm install
npm run dev
```

## 发布

推送 `main` 分支后，GitHub Actions 会构建并发布到 `gh-pages`。若仓库名为 `yupli/Personal`，访问地址一般为 `https://yupli.github.io/Personal/`。

## 维护方式

1. 在 `docs/about/`、`docs/or-opt/` 或 `docs/ai/` 中编辑或新建 `.md`。
2. 新文件需要在 `docs/.vitepress/config.mts` 的 `themeConfig.sidebar` 中增加对应链接，才会出现在侧栏。
