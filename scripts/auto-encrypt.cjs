#!/usr/bin/env node
/**
 * 自动化加密工具
 * 用法: node auto-encrypt.cjs [文件路径] [密码]
 * 默认: 加密 docs/essays/content.md，密码 ZIYU
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// 默认配置
const DEFAULT_FILE = 'docs/essays/content.md';
const DEFAULT_PASSWORD = 'ZIYU';
const OUTPUT_FILE = 'docs/essays/index.md';

function encrypt(text, password) {
  // 生成随机盐值 (16字节)
  const salt = crypto.randomBytes(16);
  
  // 使用 PBKDF2 派生密钥
  const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
  
  // 生成随机 IV (12字节)
  const iv = crypto.randomBytes(12);
  
  // 创建 cipher
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  
  // 获取认证标签
  const authTag = cipher.getAuthTag();
  
  // 将 authTag 附加到密文末尾
  const ciphertext = Buffer.from(encrypted + '.' + authTag.toString('base64')).toString('base64');
  
  return {
    ciphertext: ciphertext,
    salt: salt.toString('base64'),
    iv: iv.toString('base64')
  };
}

function main() {
  // 获取参数
  const inputFile = process.argv[2] || DEFAULT_FILE;
  const password = process.argv[3] || DEFAULT_PASSWORD;
  
  console.log('🔐 自动加密工具');
  console.log('================');
  console.log(`📄 输入文件: ${inputFile}`);
  console.log(`🔑 密码: ${password.replace(/./g, '*')}`);
  console.log('');
  
  try {
    // 读取文件
    if (!fs.existsSync(inputFile)) {
      console.error(`❌ 文件不存在: ${inputFile}`);
      process.exit(1);
    }
    
    const content = fs.readFileSync(inputFile, 'utf8');
    console.log(`✅ 读取成功，共 ${content.length} 字符`);
    
    // 加密
    console.log('🔒 正在加密...');
    const result = encrypt(content, password);
    
    // 生成输出内容
    const output = `---
layout: doc
---

<SecureContent
  ciphertext="${result.ciphertext}"
  salt="${result.salt}"
  iv="${result.iv}"
/>`;
    
    // 写入文件
    fs.writeFileSync(OUTPUT_FILE, output);
    
    console.log('');
    console.log('✅ 加密完成！');
    console.log(`📝 输出文件: ${OUTPUT_FILE}`);
    console.log(`📊 密文长度: ${result.ciphertext.length} 字符`);
    console.log('');
    console.log('💡 提示: 运行 npm run deploy:gh 部署到网站');
    
  } catch (e) {
    console.error('❌ 加密失败:', e.message);
    process.exit(1);
  }
}

main();
