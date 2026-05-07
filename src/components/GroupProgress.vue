<template>
  <div class="group-progress">
    <div class="progress-header">
      <span class="status-badge" :class="statusClass">
        {{ statusText }}
      </span>
      <span class="progress-text">{{ currentSize }}/{{ groupSize }}人团</span>
    </div>
    
    <div class="progress-bar-container">
      <div class="progress-bar" :style="{ width: progressPercent + '%' }"></div>
    </div>
    
    <div class="progress-info">
      <div class="info-item">
        <span class="info-label">已参团</span>
        <span class="info-value">{{ currentSize }}人</span>
      </div>
      <div class="info-item">
        <span class="info-label">剩余名额</span>
        <span class="info-value">{{ remainingSlots }}人</span>
      </div>
      <div class="info-item countdown" v-if="status === 'ongoing'">
        <span class="info-label">剩余时间</span>
        <span class="info-value countdown-value">
          <span class="time-box">{{ countdown.hours }}</span>:
          <span class="time-box">{{ countdown.minutes }}</span>:
          <span class="time-box">{{ countdown.seconds }}</span>
        </span>
      </div>
    </div>
    
    <div class="members-container" v-if="members && members.length > 0">
      <div class="members-header">
        <span>参团成员</span>
        <span class="creator-tag" v-if="isCreator">我是团长</span>
      </div>
      <div class="members-list">
        <div class="member-item" v-for="member in members" :key="member.id">
          <img :src="member.avatar" :alt="member.name" class="member-avatar" />
          <span class="member-name">{{ member.name }}</span>
          <span class="member-tag" v-if="member.id === members[0].id">团长</span>
        </div>
        <div class="member-item empty-slot" v-for="i in remainingSlots" :key="'empty-' + i">
          <div class="empty-avatar">
            <span>+</span>
          </div>
          <span class="empty-text">虚位以待</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  groupSize: {
    type: Number,
    required: true
  },
  currentSize: {
    type: Number,
    required: true
  },
  remainingSlots: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    default: 'ongoing'
  },
  endTime: {
    type: String,
    default: ''
  },
  members: {
    type: Array,
    default: () => []
  },
  isCreator: {
    type: Boolean,
    default: false
  }
})

const countdown = ref({
  hours: '00',
  minutes: '00',
  seconds: '00'
})

let countdownTimer = null

const progressPercent = computed(() => {
  return (props.currentSize / props.groupSize) * 100
})

const statusClass = computed(() => {
  switch (props.status) {
    case 'ongoing':
      return 'status-ongoing'
    case 'success':
      return 'status-success'
    case 'failed':
      return 'status-failed'
    default:
      return 'status-ongoing'
  }
})

const statusText = computed(() => {
  switch (props.status) {
    case 'ongoing':
      return '拼团中'
    case 'success':
      return '拼团成功'
    case 'failed':
      return '拼团失败'
    default:
      return '拼团中'
  }
})

const updateCountdown = () => {
  if (!props.endTime || props.status !== 'ongoing') return
  
  const now = new Date().getTime()
  const end = new Date(props.endTime).getTime()
  const diff = end - now
  
  if (diff <= 0) {
    countdown.value = { hours: '00', minutes: '00', seconds: '00' }
    if (countdownTimer) {
      clearInterval(countdownTimer)
    }
    return
  }
  
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  
  countdown.value = {
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0')
  }
}

onMounted(() => {
  if (props.status === 'ongoing' && props.endTime) {
    updateCountdown()
    countdownTimer = setInterval(updateCountdown, 1000)
  }
})

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})
</script>

<style scoped>
.group-progress {
  background-color: #fff;
  padding: 15px;
  margin-top: 10px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.status-badge {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 2px;
}

.status-ongoing {
  background-color: #e6f7ff;
  color: #1890ff;
}

.status-success {
  background-color: #f6ffed;
  color: #52c41a;
}

.status-failed {
  background-color: #fff2f0;
  color: #ff4d4f;
}

.progress-text {
  font-size: 14px;
  color: #333;
  font-weight: bold;
}

.progress-bar-container {
  height: 6px;
  background-color: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 15px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #ff4d4f, #ff7875);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.info-item {
  text-align: center;
}

.info-label {
  display: block;
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.info-value {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.countdown-value {
  display: flex;
  align-items: center;
  gap: 2px;
}

.time-box {
  background-color: #333;
  color: #fff;
  padding: 2px 6px;
  border-radius: 2px;
  font-size: 14px;
  min-width: 20px;
  text-align: center;
}

.members-container {
  border-top: 1px solid #f0f0f0;
  padding-top: 15px;
}

.members-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;
  color: #333;
}

.creator-tag {
  font-size: 12px;
  color: #ff4d4f;
  background-color: #fff1f0;
  padding: 2px 6px;
  border-radius: 2px;
}

.members-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.member-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  min-width: 60px;
}

.member-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.member-name {
  font-size: 12px;
  color: #333;
  max-width: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.member-tag {
  font-size: 10px;
  color: #ff4d4f;
  background-color: #fff1f0;
  padding: 1px 4px;
  border-radius: 2px;
}

.empty-slot {
  opacity: 0.6;
}

.empty-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #ddd;
}

.empty-avatar span {
  font-size: 24px;
  color: #ccc;
}

.empty-text {
  font-size: 12px;
  color: #999;
}
</style>
