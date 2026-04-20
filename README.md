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

**若出现 404（There isn't a GitHub Pages site here）**，请逐项确认：

1. **访问地址**必须是项目站：`https://yupli.github.io/Personal/`（带仓库名 `/Personal/`）。打开 `https://yupli.github.io/` 且未建 `username/username.github.io` 仓库时，也会出现同类提示。
2. **Settings → Pages → Build and deployment**：**Source** 选 **GitHub Actions** 并保存。若仍是 **Deploy from a branch**，本仓库的 Actions 部署不会生效。
3. 打开 **Actions → Deploy VitePress**，确认最新运行**绿色成功**。若卡在 **deploy** 步骤：到 **Settings → Environments → github-pages**，关闭需人工审批的 protection，或完成首次审批。
4. **私有仓库**：免费账号下私有库的 Pages 规则以 [GitHub 文档](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) 为准，未开通时可能无法公开访问。

更多说明：[配置发布来源](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)、[排查 404](https://docs.github.com/en/pages/getting-started-with-github-pages/troubleshooting-404-errors-for-github-pages-sites)。

## 许可

个人使用；如需公开分享，请自行调整仓库可见性与版权声明。
