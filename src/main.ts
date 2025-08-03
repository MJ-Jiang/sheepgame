import { createApp } from 'vue'
import 'uno.css'
import './style.css'
import App from './App.vue'
document.addEventListener('touchstart', function (e) {
  if (e.touches.length > 1) {
    e.preventDefault(); // 禁止双指放大
  }
}, { passive: false });

let lastTouchEnd = 0
document.addEventListener('touchend', function (e) {
  const now = Date.now()
  if (now - lastTouchEnd <= 300) {
    e.preventDefault() // 禁止双击放大
  }
  lastTouchEnd = now
}, false)

createApp(App).mount('#app')
