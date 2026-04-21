#!/usr/bin/env node
/**
 * 内容加密工具
 * 用法: node encrypt.js "要加密的内容" "密码"
 * 输出: ciphertext, salt, iv (Base64)
 */

const crypto = require('crypto')

function encrypt(text, password) {
  // 生成随机盐值 (16字节)
  const salt = crypto.randomBytes(16)

  // 使用 PBKDF2 派生密钥
  const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256')

  // 生成随机 IV (12字节，AES-GCM 推荐)
  const iv = crypto.randomBytes(12)

  // 创建 cipher
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)

  // 加密
  let encrypted = cipher.update(text, 'utf8', 'base64')
  encrypted += cipher.final('base64')

  // 获取认证标签
  const authTag = cipher.getAuthTag()

  // 将 authTag 附加到密文末尾
  const ciphertext = encrypted + '.' + authTag.toString('base64')

  return {
    ciphertext: Buffer.from(ciphertext).toString('base64'),
    salt: salt.toString('base64'),
    iv: iv.toString('base64')
  }
}

// 命令行参数
const content = process.argv[2]
const password = process.argv[3]

if (!content || !password) {
  console.log('用法: node encrypt.js "要加密的内容" "密码"')
  console.log('示例: node encrypt.js "# 自白记录\\n\\n这是私密内容" "your-password"')
  process.exit(1)
}

const result = encrypt(content, password)

console.log('\n=== 加密结果 ===\n')
console.log('ciphertext:', result.ciphertext)
console.log('salt:', result.salt)
console.log('iv:', result.iv)
console.log('\n=== 使用方式 ===\n')
console.log('<SecureContent')
console.log(`  ciphertext="${result.ciphertext}"`)
console.log(`  salt="${result.salt}"`)
console.log(`  iv="${result.iv}"`)
console.log('/>')
