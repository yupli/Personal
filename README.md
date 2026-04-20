# Personal

本仓库用于**记录个人知识积累**，正文全部为 **Markdown**，存放在 `docs/` 下。

## 内容目录

| 区块 | 路径 |
|------|------|
| About | `docs/about/` |
| 运筹优化 | `docs/or-opt/` |
| 人工智能 | `docs/ai/` |

新增页面后，在 `docs/.vitepress/config.mts` 的 `sidebar` 里补充链接。

## 本地预览

```bash
npm install
npm run dev
```

## 在线站点

仓库 `yupli/Personal` 时地址一般为：<https://yupli.github.io/Personal/>

**若出现 404**，请按 [GitHub Pages 文档](https://docs.github.com/en/pages) 检查：

1. **Settings → Pages → Build and deployment**：**Source** 必须选 **GitHub Actions**（本仓库工作流使用官方 `deploy-pages`，不再依赖向 `gh-pages` 分支推送）。若仍选「从分支发布」且指向 `main` / `(root)`，根目录没有构建后的 `index.html`，会 404。说明见：[配置发布来源](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)、[排查 404](https://docs.github.com/en/pages/getting-started-with-github-pages/troubleshooting-404-errors-for-github-pages-sites)。
2. 推送 `main` 后打开 **Actions**，确认 **Deploy VitePress** 已成功；首次启用 Pages 有时需几分钟生效。
3. 项目站请使用带仓库名的路径访问（如上链接），并尽量使用站点内相对链接。

## 许可

个人使用；如需公开分享，请自行调整仓库可见性与版权声明。
