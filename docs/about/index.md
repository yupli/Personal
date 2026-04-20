# 关于本站

欢迎来到个人知识库。本站将 **运筹优化** 与 **人工智能** 相关笔记集中托管，并采用接近 [SmilingWayne/me](https://github.com/SmilingWayne/me) 一类 **Material 文档站** 的阅读体验（霞鹜文楷、层级导航、提示块与宽屏正文）。

## 站点地图

```text
首页 /
├── About        → /about/
├── 运筹优化     → /or-opt/
└── 人工智能     → /ai/
```

## 本地预览

```bash
npm install
npm run dev
```

浏览器打开终端提示的本地地址即可（一般为 `http://localhost:5173`）。

## 发布（GitHub Pages）

构建产物由 GitHub Actions 推送到 **`gh-pages`** 分支。请在仓库 **Settings → Pages** 中选择：

- **Deploy from a branch**
- Branch：**`gh-pages`**
- Folder：**`/ (root)`**

并确保 **Settings → Actions → General → Workflow permissions** 为 **Read and write**，否则无法推送分支。

线上地址示例：<https://yupli.github.io/Personal/>（须与 `docs/.vitepress/config.mts` 中的 `base` 一致）。

## 如何新增页面

1. 在 `docs/about/`、`docs/or-opt/` 或 `docs/ai/` 中新建 `.md`。
2. 编辑 `docs/.vitepress/config.mts`，在对应 `sidebar` 分组下增加 `{ text: "标题", link: "/path/page" }`（`link` 不含 `.md`）。
3. 本地 `npm run dev` 检查无误后提交并推送 `main`。

::: info 与参考站的差异
[笑笑的站](https://smilingwayne.github.io/me/) 使用 **MkDocs** 与体量巨大的手写 `nav`；本站使用 **VitePress**，分区更精简，但同样以 Markdown 为唯一内容源、以侧栏组织结构。
:::
