# Personal

> **若浏览器里像「只有 README 文字、没有导航和首页」**：说明 GitHub Pages 还在从 **`main` 根目录**发布。请到 **Settings → Pages**，改为分支 **`gh-pages`**、目录 **`/ (root)`**，并确保 **Actions → Deploy VitePress** 已成功。根目录的 [`index.html`](./index.html) 也会在误配时提示同一说明。[笑笑的站](https://smilingwayne.github.io/me/) 能正常显示，是因为发布的是 **MkDocs 构建结果所在分支**，而不是仓库说明文件。

本仓库用于**记录个人知识积累**，正文全部为 **Markdown**，存放在 `docs/` 下。

## 链接

| 说明 | 地址 |
|------|------|
| **在线站点（GitHub Pages）** | <https://yupli.github.io/Personal/> |
| **本仓库** | <https://github.com/yupli/Personal> |

## 只有 `main` 分支？

这是正常现象：**代码始终在 `main`**；**`gh-pages` 不需要你本地新建**，也**不要**在 GitHub 上手动「Create branch」空分支。

1. 打开 **Settings → Actions → General**，翻到 **Workflow permissions**，选 **Read and write permissions**（并允许写入），保存。  
2. 打开 **Actions** → 左侧选 **Deploy VitePress** → 右上角 **Run workflow** → 选分支 **main** → **Run**。  
3. 等该次运行**全部绿色成功**后，回到仓库 **Code** 页，分支下拉里会出现 **`gh-pages`**（里面是构建好的静态文件，含 `index.html`）。  
4. 再打开 **Settings → Pages**：**Deploy from a branch** → **Branch: `gh-pages`** → **Folder: `/ (root)`** → Save。  

若第 2 步失败，点开红色任务查看日志（常见原因：权限未开、依赖安装失败）。以后每次推送 `main`，工作流也会自动再部署 `gh-pages`。

## 内容目录

| 区块 | 路径 |
|------|------|
| About | `docs/about/` |
| 运筹优化 | `docs/or-opt/` |
| 人工智能 | `docs/ai/` |


## 许可

个人使用；如需公开分享，请自行调整仓库可见性与版权声明。
