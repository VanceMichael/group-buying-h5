<template>
  <div class="product-detail-page page-container">
    <div class="page-header">
      <div class="back-btn" @click="goBack">
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </div>
      <span class="page-title">商品详情</span>
      <div class="right-btn" @click="goToMyGroups">
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      </div>
    </div>
    
    <div v-if="product" class="product-content">
      <ImageCarousel :images="product.images" />
      
      <ProductPrice 
        :groupPrice="product.groupPrice"
        :originalPrice="product.originalPrice"
        :sales="product.sales"
        :stock="product.stock"
      />
      
      <div class="product-info-section">
        <h2 class="product-name">{{ product.name }}</h2>
        <p class="product-desc">{{ product.description }}</p>
      </div>
      
      <div class="group-actions-section">
        <h3 class="section-title">拼团活动</h3>
        
        <div class="action-card create-card" @click="handleCreateGroup">
          <div class="action-icon create-icon">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </div>
          <div class="action-content">
            <h4 class="action-title">我要开团</h4>
            <p class="action-desc">发起新拼团，邀请好友一起拼</p>
            <div class="action-tag">{{ product.groupSize }}人团</div>
          </div>
          <div class="action-arrow">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </div>
        </div>
        
        <div class="section-divider" v-if="ongoingGroups.length > 0"></div>
        
        <div class="join-section" v-if="ongoingGroups.length > 0">
          <h4 class="join-title">拼单中</h4>
          <p class="join-subtitle">以下拼团正在进行中，点击即可参团</p>
          
          <div 
            class="group-item" 
            v-for="group in ongoingGroups" 
            :key="group.id"
            @click="goToGroupDetail(group.id)"
          >
            <div class="group-left">
              <div class="avatar-list">
                <img 
                  v-for="(member, index) in group.members.slice(0, 3)" 
                  :key="member.id"
                  :src="member.avatar" 
                  :alt="member.name" 
                  class="mini-avatar"
                  :style="{ zIndex: 3 - index }"
                />
                <div class="empty-avatar" v-if="group.members.length < 3">
                  <span>+</span>
                </div>
              </div>
              <div class="group-info">
                <span class="group-size">{{ group.currentSize }}/{{ group.groupSize }}人</span>
                <span class="group-time">
                  <svg viewBox="0 0 24 24" width="12" height="12">
                    <path fill="currentColor" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                  </svg>
                  {{ getTimeRemaining(group.endTime) }}
                </span>
              </div>
            </div>
            <div class="group-right">
              <span class="remaining">还差{{ group.remainingSlots }}人</span>
              <button class="join-btn-small">去参团</button>
            </div>
          </div>
        </div>
        
        <div class="empty-groups" v-else>
          <div class="empty-icon">🙋</div>
          <p class="empty-text">暂无进行中的拼团</p>
          <p class="empty-hint">快来发起一个吧！</p>
        </div>
      </div>
      
      <GroupRules :rules="product.rules" />
    </div>
    
    <div v-else class="empty-state">
      <div class="empty-icon">😕</div>
      <div class="empty-text">商品不存在</div>
    </div>
    
    <div class="bottom-actions">
      <button class="action-btn create-btn" @click="handleCreateGroup">
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        </svg>
        我要开团
      </button>
      <button 
        class="action-btn join-btn" 
        :class="{ disabled: ongoingGroups.length === 0 }"
        @click="quickJoinGroup"
        :disabled="ongoingGroups.length === 0"
      >
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
        拼单中
      </button>
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
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGroupBuyStore } from '../store'
import ImageCarousel from '../components/ImageCarousel.vue'
import ProductPrice from '../components/ProductPrice.vue'
import GroupRules from '../components/GroupRules.vue'
import ShareModal from '../components/ShareModal.vue'

const route = useRoute()
const router = useRouter()
const store = useGroupBuyStore()

const product = ref(null)
const shareModalVisible = ref(false)
const shareUrl = ref('')
const shareTitle = ref('')
const shareDesc = ref('')

const ongoingGroups = computed(() => {
  if (!product.value) return []
  return store.groups.filter(
    g => g.productId === product.value.id && g.status === 'ongoing'
  )
})

const goBack = () => {
  router.back()
}

const goToMyGroups = () => {
  router.push('/my-groups')
}

const goToGroupDetail = (groupId) => {
  router.push(`/group/${groupId}`)
}

const handleCreateGroup = () => {
  if (!product.value) return
  
  const newGroup = store.createGroup(product.value.id)
  if (newGroup) {
    shareUrl.value = `${window.location.origin}/group/${newGroup.id}`
    shareTitle.value = `快来和我一起拼${product.value.name}！`
    shareDesc.value = `仅需${product.value.groupPrice}元，${product.value.groupSize}人成团，超值优惠！`
    shareModalVisible.value = true
    router.push(`/group/${newGroup.id}`)
  }
}

const quickJoinGroup = () => {
  if (ongoingGroups.value.length > 0) {
    router.push(`/group/${ongoingGroups.value[0].id}`)
  }
}

const getTimeRemaining = (endTime) => {
  const now = new Date().getTime()
  const end = new Date(endTime).getTime()
  const diff = end - now
  
  if (diff <= 0) return '已结束'
  
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  if (hours > 0) {
    return `剩余${hours}小时${minutes}分钟`
  }
  return `剩余${minutes}分钟`
}

onMounted(() => {
  const productId = route.params.id
  if (productId) {
    product.value = store.getProductById(productId)
  }
})
</script>

<style scoped>
.product-detail-page {
  background-color: #f5f5f5;
  padding-bottom: 70px;
}

.page-header {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  background-color: #fff;
  padding: 0 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.back-btn,
.right-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  cursor: pointer;
}

.page-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.product-content {
  padding-bottom: 20px;
}

.product-info-section {
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

.group-actions-section {
  background-color: #fff;
  margin-top: 10px;
  padding: 15px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
}

.action-card {
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.create-card {
  background: linear-gradient(135deg, #fff7e6, #fff1f0);
  border: 1px solid #ffd591;
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.create-icon {
  background: linear-gradient(135deg, #ffa940, #ff7875);
  color: #fff;
}

.action-content {
  flex: 1;
}

.action-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.action-desc {
  font-size: 12px;
  color: #666;
  margin-bottom: 6px;
}

.action-tag {
  display: inline-block;
  font-size: 11px;
  color: #ff4d4f;
  background-color: #fff1f0;
  padding: 2px 8px;
  border-radius: 10px;
}

.action-arrow {
  color: #ccc;
}

.section-divider {
  height: 1px;
  background-color: #f0f0f0;
  margin: 20px 0;
}

.join-section {
  margin-top: 5px;
}

.join-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.join-subtitle {
  font-size: 12px;
  color: #999;
  margin-bottom: 15px;
}

.group-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: #fafafa;
  border-radius: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.group-item:last-child {
  margin-bottom: 0;
}

.group-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar-list {
  display: flex;
}

.mini-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #fff;
  margin-left: -10px;
  object-fit: cover;
}

.mini-avatar:first-child {
  margin-left: 0;
}

.empty-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px dashed #ddd;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -10px;
  color: #ccc;
  font-size: 18px;
}

.group-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.group-size {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.group-time {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #999;
}

.group-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.remaining {
  font-size: 13px;
  color: #ff4d4f;
  font-weight: bold;
}

.join-btn-small {
  padding: 6px 15px;
  background: linear-gradient(135deg, #ff7875, #ff4d4f);
  color: #fff;
  border-radius: 15px;
  font-size: 12px;
  font-weight: bold;
  border: none;
}

.empty-groups {
  text-align: center;
  padding: 20px;
}

.empty-icon {
  font-size: 40px;
  margin-bottom: 10px;
}

.empty-text {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.empty-hint {
  font-size: 12px;
  color: #999;
}

.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 10px;
  padding: 10px 15px;
  background-color: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.action-btn {
  flex: 1;
  height: 44px;
  border-radius: 22px;
  font-size: 15px;
  font-weight: bold;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.create-btn {
  background: linear-gradient(135deg, #ffa940, #fa8c16);
  color: #fff;
}

.join-btn {
  background: linear-gradient(135deg, #ff7875, #ff4d4f);
  color: #fff;
}

.join-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
}

.empty-icon {
  font-size: 60px;
  margin-bottom: 15px;
}

.empty-text {
  font-size: 16px;
  color: #666;
}
</style>
