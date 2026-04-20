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



## 在线站点（GitHub Pages）



0. **Settings → Actions → General → Workflow permissions**：选 **Read and write permissions**（并勾选允许写入）。若为只读，`GITHUB_TOKEN` 无法推送 `gh-pages`，部署会失败。
1. 推送 `main` 后，等待 **Actions → Deploy VitePress** 成功；在仓库 **Branches** 里应出现 **`gh-pages`**，其**根目录**须有 `index.html` 与 `.nojekyll`。

2. 打开 **Settings → Pages → Build and deployment**：**Source 选 Deploy from a branch**，**Branch 选 `gh-pages`**，**Folder 选 `/ (root)`**，保存。（若选 **GitHub Actions**，则不会读 `gh-pages` 上的静态文件，容易一直 404。）

3. 项目站地址一般为：`https://yupli.github.io/Personal/`（路径须与 `docs/.vitepress/config.mts` 里 `base` 一致；若仓库名大小写不同，以浏览器打开仓库 **Code** 页时地址栏里的名为准。）



若仍提示 *There isn't a GitHub Pages site here*：多半是 **Pages 未指向 `gh-pages`**，或访问了 `https://yupli.github.io/` 却没有用户主页仓库。说明见 [配置发布来源](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)、[排查 404](https://docs.github.com/en/pages/getting-started-with-github-pages/troubleshooting-404-errors-for-github-pages-sites)。



## 许可



个人使用；如需公开分享，请自行调整仓库可见性与版权声明。


