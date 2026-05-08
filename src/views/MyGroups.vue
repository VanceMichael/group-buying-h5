<template>
  <div class="my-groups-page page-container">
    <div class="page-header">
      <div class="back-btn" @click="goBack">
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </div>
      <span class="page-title">我的拼团</span>
    </div>
    
    <div class="tabs">
      <div 
        class="tab-item" 
        :class="{ active: activeTab === 'ongoing' }"
        @click="activeTab = 'ongoing'"
      >
        进行中
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeTab === 'success' }"
        @click="activeTab = 'success'"
      >
        已成团
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeTab === 'failed' }"
        @click="activeTab = 'failed'"
      >
        已失败
      </div>
    </div>
    
    <div v-if="filteredGroups.length > 0" class="group-list">
      <div 
        class="group-item" 
        v-for="group in filteredGroups" 
        :key="group.id"
        @click="goToGroupDetail(group.id)"
      >
        <div class="group-item-header">
          <span class="status-badge" :class="getStatusClass(group.status)">
            {{ getStatusText(group.status) }}
          </span>
          <span class="create-time">
            {{ formatDate(group.joinedAt) }}
          </span>
        </div>
        
        <div class="group-item-content">
          <img :src="group.product.images[0]" :alt="group.product.name" class="product-img" />
          <div class="product-info">
            <h3 class="product-name">{{ group.product.name }}</h3>
            <div class="price-row">
              <span class="group-price">¥{{ group.product.groupPrice }}</span>
              <span class="original-price">¥{{ group.product.originalPrice }}</span>
            </div>
            <div class="group-info">
              <span>{{ group.groupSize }}人团</span>
              <span>已{{ group.currentSize }}人</span>
            </div>
          </div>
        </div>
        
        <div class="group-item-footer">
          <div class="members-preview">
            <div class="avatar-list">
              <img 
                v-for="(member, index) in group.members.slice(0, 5)" 
                :key="member.id"
                :src="member.avatar" 
                :alt="member.name" 
                class="mini-avatar"
                :style="{ zIndex: 5 - index }"
              />
            </div>
            <span class="remaining" v-if="group.remainingSlots > 0">
              还差{{ group.remainingSlots }}人
            </span>
          </div>
          
          <div class="footer-actions">
            <button 
              v-if="group.status === 'ongoing' && group.remainingSlots > 0"
              class="action-btn share-btn"
              @click.stop="handleShare(group)"
            >
              邀请好友
            </button>
            <button 
              v-else-if="group.status === 'success' || group.status === 'failed'"
              class="action-btn create-btn"
              @click.stop="handleCreateAgain(group)"
            >
              再拼一次
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="empty-state">
      <div class="empty-icon">📋</div>
      <div class="empty-text">暂无拼团记录</div>
      <button class="go-home-btn" @click="goHome">去逛逛</button>
    </div>
    
    <ActionBar 
      :showCreateButton="false"
      :showJoinButton="false"
    />
    
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGroupBuyStore } from '../store'
import ActionBar from '../components/ActionBar.vue'
import ShareModal from '../components/ShareModal.vue'

const router = useRouter()
const store = useGroupBuyStore()

const activeTab = ref('ongoing')

const shareModalVisible = ref(false)
const shareUrl = ref('')
const shareTitle = ref('')
const shareDesc = ref('')

const filteredGroups = computed(() => {
  return store.myGroups.filter(g => g.status === activeTab.value)
})

const goBack = () => {
  router.back()
}

const goHome = () => {
  router.push('/')
}

const goToGroupDetail = (groupId) => {
  router.push(`/group/${groupId}`)
}

const getStatusClass = (status) => {
  switch (status) {
    case 'ongoing':
      return 'status-ongoing'
    case 'success':
      return 'status-success'
    case 'failed':
      return 'status-failed'
    default:
      return ''
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'ongoing':
      return '拼团中'
    case 'success':
      return '拼团成功'
    case 'failed':
      return '拼团失败'
    default:
      return ''
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}`
}

const handleShare = (group) => {
  shareUrl.value = `${window.location.origin}/group/${group.id}`
  shareTitle.value = `快来和我一起拼${group.product.name}！`
  shareDesc.value = `仅需${group.product.groupPrice}元，${group.groupSize}人成团，还差${group.remainingSlots}人！`
  shareModalVisible.value = true
}

const handleCreateAgain = (group) => {
  const newGroup = store.createGroup(group.productId)
  if (newGroup) {
    shareUrl.value = `${window.location.origin}/group/${newGroup.id}`
    shareTitle.value = `快来和我一起拼${newGroup.product.name}！`
    shareDesc.value = `仅需${newGroup.product.groupPrice}元，${newGroup.groupSize}人成团，超值优惠！`
    shareModalVisible.value = true
    router.push(`/group/${newGroup.id}`)
  }
}
</script>

<style scoped>
.my-groups-page {
  background-color: #f5f5f5;
}

.tabs {
  display: flex;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 60px;
  z-index: 40;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 12px 0;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  position: relative;
}

.tab-item.active {
  color: #ff4d4f;
  font-weight: bold;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 2px;
  background-color: #ff4d4f;
  border-radius: 1px;
}

.group-list {
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.group-item {
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
}

.group-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  border-bottom: 1px solid #f5f5f5;
}

.status-badge {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 2px;
}

.status-badge.status-ongoing {
  background-color: #e6f7ff;
  color: #1890ff;
}

.status-badge.status-success {
  background-color: #f6ffed;
  color: #52c41a;
}

.status-badge.status-failed {
  background-color: #fff2f0;
  color: #ff4d4f;
}

.create-time {
  font-size: 12px;
  color: #999;
}

.group-item-content {
  display: flex;
  padding: 15px;
  gap: 12px;
}

.product-img {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-name {
  font-size: 15px;
  font-weight: bold;
  color: #333;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.price-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.group-price {
  font-size: 18px;
  font-weight: bold;
  color: #ff4d4f;
}

.original-price {
  font-size: 12px;
  color: #999;
  text-decoration: line-through;
}

.group-info {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: #666;
}

.group-item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  border-top: 1px solid #f5f5f5;
}

.members-preview {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar-list {
  display: flex;
}

.mini-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #fff;
  margin-left: -8px;
  object-fit: cover;
}

.mini-avatar:first-child {
  margin-left: 0;
}

.remaining {
  font-size: 12px;
  color: #ff4d4f;
}

.footer-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  height: 32px;
  padding: 0 16px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: bold;
}

.share-btn {
  background: linear-gradient(135deg, #69c0ff, #1890ff);
  color: #fff;
}

.create-btn {
  background: linear-gradient(135deg, #ffa940, #fa8c16);
  color: #fff;
}

.go-home-btn {
  margin-top: 15px;
  padding: 10px 30px;
  background: linear-gradient(135deg, #ff4d4f, #ff7875);
  color: #fff;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
}
</style>
