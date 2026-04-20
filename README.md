# Personal

本仓库用于**记录个人知识积累**，正文全部为 **Markdown**，存放在 `docs/` 下。

## 链接

| 说明 | 地址 |
|------|------|
| **在线站点（GitHub Pages）** | <https://yupli.github.io/Personal/> |
| **本仓库** | <https://github.com/yupli/Personal> |

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

## 在线站点（GitHub Pages）

### 为什么 [SmilingWayne/me](https://github.com/SmilingWayne/me) 能打开？

对方也是 **peaceiris/actions-gh-pages** 把静态文件推到 **`gh-pages`**，**MkDocs** 构建目录是仓库里配置的 `site_dir: site`，所以 `publish_dir: ./site`。你这边是 **VitePress**，产物在 **`docs/.vitepress/dist`**，逻辑相同，只是输出路径不同。对方公开仓库 **Settings → Pages** 会从 **`gh-pages` 分支根目录** 发布，才有 `https://smilingwayne.github.io/me/`。

### 你需要对齐的检查项

1. **仓库为公开**：免费账号下私有仓库的 Pages 规则见 [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)；不满足时会出现「没有站点」类现象。
2. **Settings → Actions → General → Workflow permissions**：**Read and write**，否则无法推送 `gh-pages`。
3. **Settings → Pages**：**Deploy from a branch** → 分支 **`gh-pages`** → 文件夹 **`/ (root)`**。不要选 GitHub Actions（除非改用 `deploy-pages` 另一套流程）。
4. **访问 URL**：项目站必须是 `https://<用户>.github.io/<仓库名>/`，与 `docs/.vitepress/config.mts` 里 `base`（如 `/Personal/`）一致。

更多：[配置发布来源](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)、[排查 404](https://docs.github.com/en/pages/getting-started-with-github-pages/troubleshooting-404-errors-for-github-pages-sites)。

## 许可

个人使用；如需公开分享，请自行调整仓库可见性与版权声明。
