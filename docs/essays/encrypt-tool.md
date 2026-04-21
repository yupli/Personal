---
layout: doc
---

# 内容加密工具

用于加密"自白记录"页面的内容。

## 使用方法

1. 在下方输入要加密的 Markdown 内容
2. 输入密码（如：ZIYU）
3. 点击加密，复制生成的密文
4. 替换 `index.md` 中的内容

<div id="encrypt-app">
  <div class="encrypt-form">
    <h3>原文内容</h3>
    <textarea id="plaintext" rows="10" placeholder="# 自白记录

这里写你的私密内容..."># 自白记录

这里记录一些个人思考、心路历程和真实感悟。</textarea>

    <h3>密码</h3>
    <input type="password" id="password" value="ZIYU" />

    <button onclick="encrypt()">加密</button>

    <h3>加密结果</h3>
    <pre id="result"></pre>
  </div>
</div>

<script>
async function encrypt() {
  const plaintext = document.getElementById('plaintext').value;
  const password = document.getElementById('password').value;

  if (!plaintext || !password) {
    alert('请输入内容和密码');
    return;
  }

  try {
    // 生成盐值
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // PBKDF2 派生密钥
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    );

    // 加密
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      new TextEncoder().encode(plaintext)
    );

    // 转换为 Base64
    const ciphertext = btoa(String.fromCharCode(...new Uint8Array(encrypted)));
    const saltB64 = btoa(String.fromCharCode(...salt));
    const ivB64 = btoa(String.fromCharCode(...iv));

    // 显示结果
    const result = `<SecureContent\n  ciphertext="${ciphertext}"\n  salt="${saltB64}"\n  iv="${ivB64}"\n/>`;

    document.getElementById('result').textContent = result;

  } catch (e) {
    alert('加密失败: ' + e.message);
    console.error(e);
  }
}
</script>

<style>
.encrypt-form {
  max-width: 800px;
}

.encrypt-form h3 {
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--vp-c-brand-1);
}

.encrypt-form textarea,
.encrypt-form input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-mono);
  margin-bottom: 1rem;
}

.encrypt-form button {
  padding: 0.75rem 2rem;
  background: var(--vp-c-brand-2);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
}

.encrypt-form button:hover {
  background: var(--vp-c-brand-1);
}

#result {
  background: var(--vp-c-bg-soft);
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
