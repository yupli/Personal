# About

本仓库用于整理个人知识，站点由 **VitePress** 将 `docs/` 下的 Markdown 构建为静态页。

## 本地预览

```bash
npm install
npm run dev
```

## 发布（GitHub Pages）

工作流会把构建结果交给 GitHub Pages 部署（见仓库 **Actions**）。在仓库 **Settings → Pages** 中，**Source** 请选择 **GitHub Actions**，否则不会部署构建产物，容易出现 [404 说明](https://docs.github.com/en/pages/getting-started-with-github-pages/troubleshooting-404-errors-for-github-pages-sites) 里提到的「发布根目录没有 `index.html`」一类问题。

项目站示例：`https://yupli.github.io/Personal/`（与 `docs/.vitepress/config.mts` 中的 `base` 一致）。

## 维护方式

1. 在 `docs/about/`、`docs/or-opt/` 或 `docs/ai/` 中编辑或新建 `.md`。
2. 新文件需要在 `docs/.vitepress/config.mts` 的 `themeConfig.sidebar` 中增加对应链接，才会出现在侧栏。
