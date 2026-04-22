<template>
  <div class="secure-content">
    <!-- 锁定状态 -->
    <div v-if="!decrypted" class="lock-screen">
      <div class="lock-icon">🔐</div>
      <h2>加密内容</h2>
      <p>此页面内容已加密，需要密码解锁</p>
      <div class="input-group">
        <input
          v-model="password"
          type="password"
          placeholder="输入密码"
          @keyup.enter="decryptContent"
        />
        <button @click="decryptContent">解锁</button>
      </div>
      <p v-if="error" class="error">密码错误或解密失败</p>
    </div>

    <!-- 解密后的内容 -->
    <div v-else class="decrypted-content" v-html="decryptedContent"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  // 加密后的内容 (Base64 格式)
  ciphertext: {
    type: String,
    required: true
  },
  // 盐值 (Base64 格式)
  salt: {
    type: String,
    required: true
  },
  // IV (Base64 格式)
  iv: {
    type: String,
    required: true
  }
})

const password = ref('')
const decrypted = ref(false)
const decryptedContent = ref('')
const error = ref(false)

// 从 sessionStorage 恢复解锁状态
onMounted(() => {
  const savedKey = sessionStorage.getItem('essays_key')
  const savedContent = sessionStorage.getItem('essays_content')
  if (savedKey && savedContent) {
    decryptedContent.value = savedContent
    decrypted.value = true
  }
})

async function decryptContent() {
  try {
    error.value = false

    // 1. 解码 Base64
    const saltBuffer = base64ToBuffer(props.salt)
    const ivBuffer = base64ToBuffer(props.iv)
    const combinedBuffer = base64ToBuffer(props.ciphertext)

    // 2. 分离密文和 authTag（最后16字节）
    const authTagLength = 16
    const cipherBuffer = combinedBuffer.slice(0, combinedBuffer.byteLength - authTagLength)
    const authTagBuffer = combinedBuffer.slice(combinedBuffer.byteLength - authTagLength)

    // 3. 重新组合：密文 + authTag（Web Crypto API 需要这种格式）
    const finalBuffer = new Uint8Array(cipherBuffer.byteLength + authTagBuffer.byteLength)
    finalBuffer.set(new Uint8Array(cipherBuffer), 0)
    finalBuffer.set(new Uint8Array(authTagBuffer), cipherBuffer.byteLength)

    // 4. 使用 PBKDF2 派生密钥
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password.value),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    )

    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: saltBuffer,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    )

    // 5. 解密
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: ivBuffer
      },
      key,
      finalBuffer
    )

    // 6. 解码内容
    const content = new TextDecoder().decode(decryptedBuffer)

    // 7. 保存到 sessionStorage（仅在当前会话有效）
    sessionStorage.setItem('essays_content', content)

    decryptedContent.value = content
    decrypted.value = true

  } catch (e) {
    console.error('解密失败:', e)
    error.value = true
    decrypted.value = false
  }
}

function base64ToBuffer(base64) {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}
</script>

<style scoped>
.secure-content {
  min-height: 400px;
}

.lock-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
  padding: 2rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 2px solid var(--vp-c-brand-2);
}

.lock-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.lock-screen h2 {
  margin: 0 0 0.5rem;
  color: var(--vp-c-text-1);
}

.lock-screen p {
  color: var(--vp-c-text-2);
  margin-bottom: 1.5rem;
  max-width: 300px;
}

.input-group {
  display: flex;
  gap: 0.5rem;
  max-width: 320px;
  width: 100%;
}

.input-group input {
  flex: 1;
  padding: 0.6rem 1rem;
  border: 2px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 1rem;
}

.input-group input:focus {
  outline: none;
  border-color: var(--vp-c-brand);
}

.input-group button {
  padding: 0.6rem 1.5rem;
  border: none;
  border-radius: 8px;
  background: var(--vp-c-brand);
  color: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;
}

.input-group button:hover {
  opacity: 0.9;
}

.error {
  color: #f56c6c !important;
  margin-top: 1rem;
}

.decrypted-content {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
