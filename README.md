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

### Run workflow 失败时怎么排查

1. 打开失败的那一次运行 → 展开**第一个变红**的步骤，把日志**最后约 30 行**（含 `Error` / `npm ERR` / `ENOENT` 等）复制下来搜索或求助。  
2. **Deploy / 推送失败**（含 `remote: Permission denied`、`Resource not accessible`）：多半是 **Workflow permissions** 仍是只读，或组织策略禁止 `GITHUB_TOKEN` 写仓库；需在仓库或组织设置里允许 **Read and write**。  
3. **Build / vitepress 失败**：本地安装 Node 20+ 后执行 `npm install` 与 `npx vitepress build docs`，看是否复现；若本地能通过而 CI 失败，把 CI 完整构建日志与本地 Node 版本一并对照。  
4. **npm install 失败**：多为网络/registry 超时，可在 Actions 里 **Re-run failed jobs** 重试。  
5. **提示 *account is locked due to a billing issue***：属于 **GitHub 账号/组织账单**问题（欠费、付款方式失效、需验证等），与代码无关。请到 **Settings → Billing and plans**（或组织的 **Billing**）处理；恢复前 **Actions 不会执行**。可先本地 `npm install` + `npx vitepress build docs`，再将 `docs/.vitepress/dist` 内容手动推到 **`gh-pages`** 分支根目录，或改用 Netlify / Cloudflare Pages 等托管。

## 不用 GitHub Actions 的发布方式

账单未恢复、或不想用 CI 时，可以用下面任一方式。

### A. 本机构建并推到 `gh-pages`（仍是 GitHub Pages）

1. 安装 **Node 20+**、**Git**，本仓库已配置 `origin` 指向 GitHub。  
2. 执行：`npm install`，再执行 **`npm run deploy:gh`**（会先 `vitepress build`，再用 [gh-pages](https://www.npmjs.com/package/gh-pages) 把 `docs/.vitepress/dist` 推到远程 **`gh-pages`** 分支）。  
3. 首次若提示登录，按 GitHub 要求用 **HTTPS + PAT** 或 **SSH** 完成推送。  
4. **Settings → Pages** 仍为：**Deploy from a branch** → **`gh-pages`** → **`/ (root)`**。

与 Actions 的区别：只有在你本机执行命令时才更新线上，不会自动随 `main` 推送。

### B. Netlify / Cloudflare Pages（免费额度通常够用）

在平台新建站点，连接同一 Git 仓库或上传构建产物目录 **`docs/.vitepress/dist`**：

- **构建命令**：`npm install && npx vitepress build docs`  
- **发布目录**：`docs/.vitepress/dist`  

若站点挂在**子路径**（少见），需把 `docs/.vitepress/config.mts` 里的 **`base`** 改成平台文档要求的路径；若域名在**根路径**（如 `xxx.netlify.app`），一般要把 **`base` 改成 `'/'`**，否则资源 404。

### C. 其它

也可使用 **Vercel**、**阿里云 OSS / 腾讯云 COS 静态网站**等：本质都是上传 **`vitepress build` 后的 `dist` 目录**；换托管时同样注意 **`base`** 与最终 URL 是否一致。

## 内容目录

| 区块 | 路径 |
|------|------|
| About | `docs/about/` |
| 运筹优化 | `docs/or-opt/` |
| 人工智能 | `docs/ai/` |


## 许可

个人使用；如需公开分享，请自行调整仓库可见性与版权声明。
