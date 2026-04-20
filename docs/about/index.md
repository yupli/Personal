# About

本仓库用于整理个人知识，站点由 **VitePress** 将 `docs/` 下的 Markdown 构建为静态页。

## 本地预览

```bash
npm install
npm run dev
```

## 发布（GitHub Pages）

工作流在同一 job 内执行 **configure-pages → 上传构建产物 → deploy-pages**（与 GitHub 官方静态站模板一致）。请在 **Settings → Pages** 将 **Source** 设为 **GitHub Actions**；部署 job 使用 **github-pages** 环境，若首次卡在审批，请到 **Settings → Environments** 处理。访问项目站请使用 `https://<用户>.github.io/<仓库名>/`，与 `config.mts` 里 `base` 一致。

项目站示例：`https://yupli.github.io/Personal/`（与 `docs/.vitepress/config.mts` 中的 `base` 一致）。

## 维护方式

1. 在 `docs/about/`、`docs/or-opt/` 或 `docs/ai/` 中编辑或新建 `.md`。
2. 新文件需要在 `docs/.vitepress/config.mts` 的 `themeConfig.sidebar` 中增加对应链接，才会出现在侧栏。
