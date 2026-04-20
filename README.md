# Personal

个人知识积累，正文为 Markdown，位于 `docs/`。

## 链接

| 说明 | 地址 |
|------|------|
| 站点 | <https://yupli.github.io/Personal/> |
| 仓库 | <https://github.com/yupli/Personal> |

## 内容放在哪

| 区块 | 路径 |
|------|------|
| 运筹优化 | `docs/or-opt/` |
| 人工智能 | `docs/ai/` |

## 日常维护（怎么改内容）

1. **写或改 Markdown**  
   - 运筹相关：放在 `docs/or-opt/`，例如 `docs/or-opt/某主题.md`。  
   - 人工智能相关：放在 `docs/ai/`。  
   - 用编辑器正常写标题、列表、代码块、表格即可。

2. **登记侧栏（否则新页面不会出现在导航里）**  
   打开 `docs/.vitepress/config.mts`，在 `themeConfig.sidebar` 里对应分组增加一项，例如：  
   `{ text: "显示名称", link: "/or-opt/文件名" }`  
   `link` 不要带 `.md`，路径与文件所在目录一致。

3. **本地看一眼（可选）**  
   在项目根目录执行：`npm install`（首次或依赖变了再做），然后 `npm run dev`，浏览器打开终端里提示的地址，检查排版与链接。

4. **保存到 GitHub**  
   `git add` → `git commit` → `git push origin main`（备份与协作）。

5. **更新线上站点**  
   在项目根目录执行：`npm run deploy:gh`  
   会把构建结果推到 **`gh-pages`** 分支；GitHub Pages 需仍指向该分支根目录（一般不用每次改设置）。

## 许可

个人使用；公开分享时请自行调整可见性与版权声明。
