#!/usr/bin/env node
/**
 * 将 content.md 中的文章分离并分别加密
 * 用法: node split-and-encrypt.cjs
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// 配置
const CONTENT_FILE = 'docs/essays/content.md';
const OUTPUT_DIR = 'docs/essays/articles';
const PASSWORD = 'ZIYU';

function encrypt(text, password) {
  const salt = crypto.randomBytes(16);
  const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  let encrypted = cipher.update(text, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  const authTag = cipher.getAuthTag();
  const ciphertext = Buffer.concat([encrypted, authTag]).toString('base64');
  
  return {
    ciphertext: ciphertext,
    salt: salt.toString('base64'),
    iv: iv.toString('base64')
  };
}

function extractTitle(content) {
  const match = content.match(/^# (.+)$/m);
  return match ? match[1] : '无标题';
}

function extractDate(content) {
  const match = content.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
  if (match) {
    return `${match[1]}年${match[2].padStart(2, '0')}月${match[3].padStart(2, '0')}日`;
  }
  return '未知日期';
}

function main() {
  console.log('🔐 文章分离加密工具');
  console.log('====================');
  
  // 创建输出目录
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // 读取内容文件
  const content = fs.readFileSync(CONTENT_FILE, 'utf8');
  
  // 按 --- 分隔文章
  const articles = content.split(/^---$/m).filter(a => a.trim());
  
  console.log(`📄 发现 ${articles.length} 篇文章`);
  console.log('');
  
  const articleList = [];
  
  articles.forEach((article, index) => {
    const articleId = `article-${String(index + 1).padStart(3, '0')}`;
    const title = extractTitle(article);
    const date = extractDate(article);
    
    console.log(`🔒 加密 [${articleId}] ${title}`);
    
    // 加密
    const encrypted = encrypt(article.trim(), PASSWORD);
    
    // 生成 MD 文件
    const mdContent = `---
layout: doc
---

# ${title}

> ${date}

<SecureContent
  ciphertext="${encrypted.ciphertext}"
  salt="${encrypted.salt}"
  iv="${encrypted.iv}"
/>`;
    
    fs.writeFileSync(path.join(OUTPUT_DIR, `${articleId}.md`), mdContent);
    
    articleList.push({
      id: index + 1,
      articleId,
      title,
      date,
      link: `/essays/articles/${articleId}`
    });
  });
  
  console.log('');
  console.log('✅ 全部加密完成！');
  console.log(`📁 输出目录: ${OUTPUT_DIR}`);
  console.log('');
  
  // 生成文章列表数据文件
  const listData = `export const articles = ${JSON.stringify(articleList, null, 2)}`;
  fs.writeFileSync(path.join(OUTPUT_DIR, 'list-data.js'), listData);
  
  console.log('💡 提示: 更新侧边栏配置后部署');
}

main();
