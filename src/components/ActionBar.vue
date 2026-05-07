<template>
  <div class="action-bar">
    <div class="action-left">
      <div class="action-item" @click="goToMyGroups">
        <div class="action-icon">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>
        <span class="action-text">我的拼团</span>
      </div>
    </div>
    <div class="action-right">
      <button 
        v-if="showJoinButton" 
        class="action-btn join-btn" 
        @click="handleJoin"
        :disabled="!canJoin"
      >
        立即参团
      </button>
      <button 
        v-if="showCreateButton" 
        class="action-btn create-btn" 
        @click="handleCreate"
        :disabled="!canCreate"
      >
        发起拼团
      </button>
      <button 
        v-if="showShareButton" 
        class="action-btn share-btn" 
        @click="handleShare"
      >
        邀请好友
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  showJoinButton: {
    type: Boolean,
    default: false
  },
  showCreateButton: {
    type: Boolean,
    default: false
  },
  showShareButton: {
    type: Boolean,
    default: false
  },
  canJoin: {
    type: Boolean,
    default: true
  },
  canCreate: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['join', 'create', 'share'])

const router = useRouter()

const goToMyGroups = () => {
  router.push('/my-groups')
}

const handleJoin = () => {
  emit('join')
}

const handleCreate = () => {
  emit('create')
}

const handleShare = () => {
  emit('share')
}
</script>

<style scoped>
.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.action-left {
  display: flex;
  gap: 20px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  color: #666;
}

.action-icon {
  color: #666;
}

.action-text {
  font-size: 10px;
  margin-top: 2px;
}

.action-right {
  display: flex;
  gap: 10px;
}

.action-btn {
  height: 36px;
  padding: 0 20px;
  border: none;
  border-radius: 18px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.join-btn {
  background: linear-gradient(135deg, #ff7875, #ff4d4f);
  color: #fff;
}

.join-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.create-btn {
  background: linear-gradient(135deg, #ffa940, #fa8c16);
  color: #fff;
}

.create-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.share-btn {
  background: linear-gradient(135deg, #69c0ff, #1890ff);
  color: #fff;
}

.share-btn:hover {
  opacity: 0.9;
}
</style>
