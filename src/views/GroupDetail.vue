<template>
  <div class="group-detail-page page-container">
    <div class="page-header">
      <div class="back-btn" @click="goBack">
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </div>
      <span class="page-title">拼团详情</span>
    </div>

    <div v-if="group" class="group-content">
      <ImageCarousel :images="group.product.images" />

      <ProductPrice
        :groupPrice="group.product.groupPrice"
        :originalPrice="group.product.originalPrice"
        :sales="group.product.sales"
        :stock="group.product.stock"
      />

      <div class="product-name-section">
        <h2 class="product-name">{{ group.product.name }}</h2>
        <p class="product-desc">{{ group.product.description }}</p>
      </div>

      <div class="status-card" :class="'status-' + group.status">
        <div class="status-top">
          <span class="status-badge" :class="'badge-' + group.status">
            {{ statusText }}
          </span>
          <CountdownTimer v-if="group.status === 'ongoing'" :endTime="group.endTime" />
        </div>

        <div class="stats-row">
          <div class="stat-item">
            <span class="stat-value">{{ group.currentSize }}</span>
            <span class="stat-label">已参团</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value highlight">{{ group.remainingSlots }}</span>
            <span class="stat-label">还差几人</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value">{{ group.groupSize }}</span>
            <span class="stat-label">目标人数</span>
          </div>
        </div>

        <div class="progress-bar-wrapper">
          <div class="progress-track">
            <div
              class="progress-fill"
              :style="{ width: progressPercent + '%' }"
              :class="{ complete: group.currentSize >= group.groupSize }"
            ></div>
          </div>
          <span class="progress-label">{{ group.currentSize }}/{{ group.groupSize }}</span>
        </div>
      </div>

      <GroupProgress
        :groupSize="group.groupSize"
        :currentSize="group.currentSize"
        :remainingSlots="group.remainingSlots"
        :status="group.status"
        :endTime="group.endTime"
        :members="group.members"
        :isCreator="group.isCreator"
      />

      <GroupRules :rules="group.product.rules" />

      <div class="result-card" v-if="group.status === 'success'">
        <div class="result-icon">🎉</div>
        <div class="result-title">拼团成功！</div>
        <div class="result-desc">拼团已成功，商品将尽快为您发货</div>
      </div>

      <div class="result-card failed" v-if="group.status === 'failed'">
        <div class="result-icon">😔</div>
        <div class="result-title">拼团失败</div>
        <div class="result-desc">未在规定时间内凑齐人数，将自动退款</div>
        <button class="retry-btn" @click="handleCreate">再拼一次</button>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">😕</div>
      <div class="empty-text">拼团不存在或已结束</div>
    </div>

    <div class="bottom-bar" v-if="group">
      <template v-if="group.status === 'ongoing' && !isMember">
        <button class="bottom-btn join-btn" @click="handleJoin">
          立即参团 · ¥{{ group.product.groupPrice }}
        </button>
      </template>
      <template v-else-if="group.status === 'ongoing' && isMember">
        <button class="bottom-btn share-btn" @click="handleShare">
          邀请好友参团
        </button>
      </template>
      <template v-else>
        <button class="bottom-btn create-btn" @click="handleCreate">
          我要开团 · ¥{{ group.product.groupPrice }}
        </button>
      </template>
    </div>

    <ShareModal
      :visible="shareModalVisible"
      :shareUrl="shareUrl"
      :shareTitle="shareTitle"
      :shareDesc="shareDesc"
      @close="shareModalVisible = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGroupBuyStore } from '../store'
import ImageCarousel from '../components/ImageCarousel.vue'
import ProductPrice from '../components/ProductPrice.vue'
import GroupProgress from '../components/GroupProgress.vue'
import GroupRules from '../components/GroupRules.vue'
import ShareModal from '../components/ShareModal.vue'
import CountdownTimer from '../components/CountdownTimer.vue'

const route = useRoute()
const router = useRouter()
const store = useGroupBuyStore()

const group = ref(null)
let statusTimer = null

const shareModalVisible = ref(false)
const shareUrl = ref('')
const shareTitle = ref('')
const shareDesc = ref('')

const progressPercent = computed(() => {
  if (!group.value) return 0
  return (group.value.currentSize / group.value.groupSize) * 100
})

const isMember = computed(() => {
  if (!group.value) return false
  return group.value.members.some(m => m.id === 'user_1')
})

const statusText = computed(() => {
  if (!group.value) return ''
  switch (group.value.status) {
    case 'ongoing': return '拼团中'
    case 'success': return '已成团'
    case 'failed': return '已失败'
    default: return ''
  }
})

const goBack = () => {
  router.back()
}

const refreshGroup = () => {
  if (!group.value) return
  const fresh = store.getGroupById(group.value.id)
  if (fresh) {
    group.value = fresh
  }
}

const handleJoin = () => {
  if (!group.value) return
  const result = store.joinGroup(group.value.id)
  if (result.success) {
    refreshGroup()
  } else {
    alert(result.message)
  }
}

const handleCreate = () => {
  if (!group.value) return
  const newGroup = store.createGroup(group.value.productId)
  if (newGroup) {
    shareUrl.value = `${window.location.origin}/group/${newGroup.id}`
    shareTitle.value = `快来和我一起拼${newGroup.product.name}！`
    shareDesc.value = `仅需${newGroup.product.groupPrice}元，${newGroup.groupSize}人成团，超值优惠！`
    shareModalVisible.value = true
    router.push(`/group/${newGroup.id}`)
  }
}

const handleShare = () => {
  if (!group.value) return
  shareUrl.value = `${window.location.origin}/group/${group.value.id}`
  shareTitle.value = `快来和我一起拼${group.value.product.name}！`
  shareDesc.value = `仅需${group.value.product.groupPrice}元，${group.value.groupSize}人成团，还差${group.value.remainingSlots}人！`
  shareModalVisible.value = true
}

onMounted(() => {
  store.updateGroupStatus()
  const groupId = route.params.id
  if (groupId) {
    group.value = store.getGroupById(groupId)
  }
  statusTimer = setInterval(() => {
    store.updateGroupStatus()
    refreshGroup()
  }, 1000)
})

onUnmounted(() => {
  if (statusTimer) clearInterval(statusTimer)
})
</script>

<style scoped>
.group-detail-page {
  background-color: #f5f5f5;
}

.product-name-section {
  background-color: #fff;
  padding: 15px;
  margin-top: 10px;
}

.product-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.product-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.status-card {
  background-color: #fff;
  margin-top: 10px;
  padding: 15px;
}

.status-card.status-ongoing {
  border-left: 4px solid #1890ff;
}

.status-card.status-success {
  border-left: 4px solid #52c41a;
}

.status-card.status-failed {
  border-left: 4px solid #ff4d4f;
}

.status-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.status-badge {
  font-size: 14px;
  font-weight: bold;
  padding: 4px 10px;
  border-radius: 4px;
}

.badge-ongoing {
  background-color: #e6f7ff;
  color: #1890ff;
}

.badge-success {
  background-color: #f6ffed;
  color: #52c41a;
}

.badge-failed {
  background-color: #fff2f0;
  color: #ff4d4f;
}

.stats-row {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 15px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.stat-value.highlight {
  color: #ff4d4f;
}

.stat-label {
  font-size: 12px;
  color: #999;
}

.stat-divider {
  width: 1px;
  height: 30px;
  background-color: #f0f0f0;
}

.progress-bar-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-track {
  flex: 1;
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff4d4f, #ff7875);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-fill.complete {
  background: linear-gradient(90deg, #52c41a, #73d13d);
}

.progress-label {
  font-size: 12px;
  color: #666;
  white-space: nowrap;
}

.result-card {
  background-color: #fff;
  margin-top: 10px;
  padding: 30px 15px;
  text-align: center;
  border-radius: 0;
}

.result-card.failed {
  background-color: #fff;
}

.result-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.result-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.result-desc {
  font-size: 14px;
  color: #999;
  margin-bottom: 15px;
}

.retry-btn {
  padding: 10px 30px;
  background: linear-gradient(135deg, #ffa940, #fa8c16);
  color: #fff;
  border-radius: 20px;
  font-size: 15px;
  font-weight: bold;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 15px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.bottom-btn {
  width: 100%;
  height: 40px;
  border-radius: 20px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
}

.bottom-btn.join-btn {
  background: linear-gradient(135deg, #ff7875, #ff4d4f);
}

.bottom-btn.share-btn {
  background: linear-gradient(135deg, #69c0ff, #1890ff);
}

.bottom-btn.create-btn {
  background: linear-gradient(135deg, #ffa940, #fa8c16);
}
</style>
