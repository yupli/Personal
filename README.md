# Personal

日常学习笔记，用 Markdown 记录。

**站点：** <https://yupli.github.io/Personal/>

使用 `npm run dev` 在本地预览。使用 `npm run deploy:gh` 构建站点并发布到 `gh-pages` 分支。发布脚本会保留上一版静态资源 24 小时，方便已打开的页面继续加载资源。

源文件提交到 `main`。GitHub Actions 的 **Build knowledge base** 在提交 Pull Request 或手动运行时执行。网站发布由 `npm run deploy:gh` 及 GitHub Pages 处理。

