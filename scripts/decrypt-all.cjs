#!/usr/bin/env node
/**
 * 解密所有文章为明文
 */

const fs = require('fs');
const path = require('path');

const CONTENT_FILE = 'docs/essays/content.md';
const OUTPUT_DIR = 'docs/essays/articles';

function main() {
  console.log('🔓 解密所有文章');
  console.log('================');
  
  // 读取内容文件
  const content = fs.readFileSync(CONTENT_FILE, 'utf8');
  
  // 按 --- 分隔文章
  const articles = content.split(/^---$/m).filter(a => a.trim());
  
  // 删除现有文章文件
  const files = fs.readdirSync(OUTPUT_DIR).filter(f => f.startsWith('article-') && f.endsWith('.md'));
  files.forEach(f => fs.unlinkSync(path.join(OUTPUT_DIR, f)));
  
  articles.forEach((article, index) => {
    const articleId = `article-${String(index + 1).padStart(3, '0')}`;
    const trimmed = article.trim();
    const firstLine = trimmed.split('\n')[0];
    const title = firstLine.replace(/^# /, '');
    
    // 生成明文 MD 文件
    const mdContent = `---
layout: doc
---

${trimmed}
`;
    
    fs.writeFileSync(path.join(OUTPUT_DIR, `${articleId}.md`), mdContent);
    console.log(`✅ ${articleId} - ${title}`);
  });
  
  console.log('');
  console.log('🔓 全部解密完成！');
  console.log(`📁 位置: ${OUTPUT_DIR}`);
}

main();
