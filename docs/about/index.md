# 关于本站

运筹优化与人工智能相关笔记，由 **VitePress** 从 `docs/` 构建。

## 结构

- [运筹优化](/or-opt/)
- [人工智能](/ai/)

## 本地

```bash
npm install
npm run dev
```

## 发布

```bash
npm run deploy:gh
```

仓库 **Settings → Pages**：分支 **`gh-pages`**，目录 **`/ (root)`**。站点：<https://yupli.github.io/Personal/>

## 新增页面

在 `docs/about/`、`docs/or-opt/` 或 `docs/ai/` 新建 `.md`，在 `docs/.vitepress/config.mts` 的对应 `sidebar` 中加入 `{ text, link }`（`link` 不含 `.md`）。
