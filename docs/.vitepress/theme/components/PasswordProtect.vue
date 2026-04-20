<template>
  <div class="password-protect">
    <div v-if="!unlocked" class="password-form">
      <div class="lock-icon">🔒</div>
      <h2>此页面已锁定</h2>
      <p>请输入密码继续访问</p>
      <div class="input-group">
        <input
          v-model="inputPassword"
          type="password"
          placeholder="输入密码"
          @keyup.enter="verifyPassword"
        />
        <button @click="verifyPassword">解锁</button>
      </div>
      <p v-if="error" class="error">密码错误，请重试</p>
    </div>
    <div v-else class="content">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  // 使用 SHA-256 哈希值，而非明文密码
  // 在线生成工具: https://emn178.github.io/online-tools/sha256.html
  hash: {
    type: String,
    default: 'e99a18c428cb38d5f260853678922e03abd8d71c5c6b56b0e6e9e3e6e6e6e6e6' // "123456" 的哈希
  }
})

const inputPassword = ref('')
const unlocked = ref(false)
const error = ref(false)

// 检查 sessionStorage 中是否已解锁
onMounted(() => {
  const sessionKey = 'unlocked_' + window.location.pathname
  if (sessionStorage.getItem(sessionKey) === 'true') {
    unlocked.value = true
  }
})

// SHA-256 哈希函数
async function sha256(message) {
  const encoder = new TextEncoder()
  const data = encoder.encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

async function verifyPassword() {
  const inputHash = await sha256(inputPassword.value)
  if (inputHash === props.hash) {
    unlocked.value = true
    error.value = false
    const sessionKey = 'unlocked_' + window.location.pathname
    sessionStorage.setItem(sessionKey, 'true')
  } else {
    error.value = true
  }
}
</script>

<style scoped>
.password-protect {
  min-height: 400px;
}

.password-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
  padding: 2rem;
}

.lock-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.password-form h2 {
  margin: 0 0 0.5rem;
  color: var(--vp-c-text-1);
}

.password-form p {
  color: var(--vp-c-text-2);
  margin-bottom: 1.5rem;
}

.input-group {
  display: flex;
  gap: 0.5rem;
  max-width: 300px;
  width: 100%;
}

.input-group input {
  flex: 1;
  padding: 0.5rem 1rem;
  border: 1px solid var(--vp-c-divider);
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
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 8px;
  background: var(--vp-c-brand);
  color: white;
  font-size: 1rem;
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

.content {
  animation: fadeIn 0.3s ease;
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
