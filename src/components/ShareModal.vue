<template>
  <div class="share-modal" v-if="visible" @click.self="handleClose">
    <div class="share-content">
      <div class="share-header">
        <span class="share-title">分享给好友</span>
        <span class="share-close" @click="handleClose">×</span>
      </div>
      
      <div class="share-tips" v-if="isWechat">
        <div class="tips-icon">
          <svg viewBox="0 0 24 24" width="40" height="40">
            <path fill="#1AAD19" d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18z"/>
            <path fill="#1AAD19" d="M23.943 14.986c0-3.25-3.182-5.884-7.104-5.884-3.923 0-7.104 2.634-7.104 5.884s3.181 5.883 7.104 5.883c.838 0 1.64-.118 2.388-.338a.722.722 0 0 1 .598.082l1.584.927a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.49.49 0 0 1 .177-.554c1.527-1.124 2.343-2.782 2.343-4.383zm-9.409-.583a.975.975 0 1 1 0-1.95.975.975 0 0 1 0 1.95zm4.614 0a.975.975 0 1 1 0-1.95.975.975 0 0 1 0 1.95z"/>
          </svg>
        </div>
        <div class="tips-text">
          <p>请点击右上角</p>
          <p>选择「分享给朋友」或「分享到朋友圈」</p>
        </div>
      </div>
      
      <div class="share-options" v-else>
        <div class="share-option" @click="shareToWechat">
          <div class="share-icon wechat">
            <svg viewBox="0 0 24 24" width="30" height="30">
              <path fill="#fff" d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348z"/>
              <path fill="#fff" d="M23.943 14.986c0-3.25-3.182-5.884-7.104-5.884-3.923 0-7.104 2.634-7.104 5.884s3.181 5.883 7.104 5.883c.838 0 1.64-.118 2.388-.338a.722.722 0 0 1 .598.082l1.584.927a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.49.49 0 0 1 .177-.554c1.527-1.124 2.343-2.782 2.343-4.383z"/>
            </svg>
          </div>
          <span class="share-name">微信好友</span>
        </div>
        
        <div class="share-option" @click="shareToMoments">
          <div class="share-icon moments">
            <svg viewBox="0 0 24 24" width="30" height="30">
              <circle cx="12" cy="12" r="10" fill="#07C160"/>
              <circle cx="8" cy="8" r="3" fill="#fff"/>
              <circle cx="16" cy="8" r="3" fill="#fff"/>
              <circle cx="12" cy="14" r="4" fill="#fff"/>
            </svg>
          </div>
          <span class="share-name">朋友圈</span>
        </div>
        
        <div class="share-option" @click="shareToQQ">
          <div class="share-icon qq">
            <svg viewBox="0 0 24 24" width="30" height="30">
              <path fill="#fff" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
          </div>
          <span class="share-name">QQ</span>
        </div>
        
        <div class="share-option" @click="copyLink">
          <div class="share-icon link">
            <svg viewBox="0 0 24 24" width="30" height="30">
              <path fill="#fff" d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
            </svg>
          </div>
          <span class="share-name">复制链接</span>
        </div>
      </div>
      
      <div class="share-cancel" @click="handleClose">
        取消
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  shareUrl: {
    type: String,
    default: ''
  },
  shareTitle: {
    type: String,
    default: '快来一起拼团吧！'
  },
  shareDesc: {
    type: String,
    default: '超值优惠，一起拼团更划算！'
  }
})

const emit = defineEmits(['close'])

const isWechat = computed(() => {
  const ua = navigator.userAgent.toLowerCase()
  return ua.includes('micromessenger')
})

const handleClose = () => {
  emit('close')
}

const shareToWechat = () => {
  if (typeof window !== 'undefined' && window.WeixinJSBridge) {
    window.WeixinJSBridge.invoke('sendAppMessage', {
      title: props.shareTitle,
      desc: props.shareDesc,
      link: props.shareUrl,
      img_url: ''
    })
  } else {
    alert('请在微信中打开分享')
  }
}

const shareToMoments = () => {
  if (typeof window !== 'undefined' && window.WeixinJSBridge) {
    window.WeixinJSBridge.invoke('shareTimeline', {
      title: props.shareTitle,
      link: props.shareUrl,
      img_url: ''
    })
  } else {
    alert('请在微信中打开分享')
  }
}

const shareToQQ = () => {
  const url = `https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(props.shareUrl)}&title=${encodeURIComponent(props.shareTitle)}&desc=${encodeURIComponent(props.shareDesc)}`
  window.open(url, '_blank')
}

const copyLink = () => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(props.shareUrl)
      .then(() => {
        alert('链接已复制到剪贴板')
      })
      .catch(() => {
        fallbackCopyText(props.shareUrl)
      })
  } else {
    fallbackCopyText(props.shareUrl)
  }
}

const fallbackCopyText = (text) => {
  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.style.position = 'fixed'
  textArea.style.left = '-9999px'
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()
  try {
    document.execCommand('copy')
    alert('链接已复制到剪贴板')
  } catch (err) {
    alert('复制失败，请手动复制')
  }
  document.body.removeChild(textArea)
}
</script>

<style scoped>
.share-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1000;
}

.share-content {
  width: 100%;
  background-color: #fff;
  border-radius: 12px 12px 0 0;
  padding-bottom: env(safe-area-inset-bottom, 20px);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.share-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.share-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.share-close {
  font-size: 24px;
  color: #999;
  cursor: pointer;
  line-height: 1;
}

.share-tips {
  padding: 30px 20px;
  text-align: center;
}

.tips-icon {
  margin-bottom: 15px;
}

.tips-text p {
  margin: 5px 0;
  color: #666;
  font-size: 14px;
}

.share-options {
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
  gap: 20px;
}

.share-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(25% - 15px);
  cursor: pointer;
}

.share-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.share-icon.wechat {
  background-color: #07C160;
}

.share-icon.moments {
  background-color: #07C160;
}

.share-icon.qq {
  background-color: #12B7F5;
}

.share-icon.link {
  background-color: #999;
}

.share-name {
  font-size: 12px;
  color: #333;
}

.share-cancel {
  text-align: center;
  padding: 15px;
  border-top: 1px solid #f0f0f0;
  font-size: 16px;
  color: #666;
  cursor: pointer;
}
</style>
