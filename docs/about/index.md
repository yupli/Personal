# About

本仓库用于整理个人知识，站点由 **VitePress** 将 `docs/` 下的 Markdown 构建为静态页。

## 本地预览

```bash
npm install
npm run dev
```

## 发布（GitHub Pages）

工作流会把构建结果推到 **`gh-pages` 分支**。请到 **Settings → Pages**：**Source** 选 **Deploy from a branch**，分支 **gh-pages**，目录 **/**。不要用「GitHub Actions」作为 Source，否则不会发布该分支上的 `index.html`。站点路径须与 `config.mts` 中的 `base` 一致。

项目站示例：`https://yupli.github.io/Personal/`（与 `docs/.vitepress/config.mts` 中的 `base` 一致）。

## 维护方式

1. 在 `docs/about/`、`docs/or-opt/` 或 `docs/ai/` 中编辑或新建 `.md`。
2. 新文件需要在 `docs/.vitepress/config.mts` 的 `themeConfig.sidebar` 中增加对应链接，才会出现在侧栏。
