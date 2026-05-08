<template>
  <div class="product-detail-page page-container">
    <div class="page-header">
      <div class="back-btn" @click="goBack">
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </div>
      <span class="page-title">商品详情</span>
    </div>

    <div v-if="product" class="product-content">
      <ImageCarousel :images="product.images" />

      <ProductPrice
        :groupPrice="product.groupPrice"
        :originalPrice="product.originalPrice"
        :sales="product.sales"
        :stock="product.stock"
      />

      <div class="product-name-section">
        <h2 class="product-name">{{ product.name }}</h2>
        <p class="product-desc">{{ product.description }}</p>
      </div>

      <GroupRules :rules="product.rules" />

      <div class="section-card ongoing-section">
        <div class="section-title">
          <span class="title-icon">🔥</span>
          <span>拼单中</span>
          <span class="ongoing-count">{{ ongoingGroups.length }}个团进行中</span>
        </div>

        <div v-if="ongoingGroups.length > 0" class="ongoing-list">
          <div
            class="ongoing-item"
            v-for="group in ongoingGroups"
            :key="group.id"
            @click="goToGroupDetail(group.id)"
          >
            <div class="ongoing-left">
              <div class="avatar-stack">
                <img
                  v-for="(m, i) in group.members.slice(0, 3)"
                  :key="m.id"
                  :src="m.avatar"
                  :alt="m.name"
                  class="stacked-avatar"
                  :style="{ zIndex: 3 - i }"
                />
              </div>
              <div class="ongoing-info">
                <span class="ongoing-leader">{{ group.members[0]?.name }} 发起的拼团</span>
                <span class="ongoing-slots">还差{{ group.remainingSlots }}人成团</span>
              </div>
            </div>
            <div class="ongoing-right">
              <CountdownTimer :endTime="group.endTime" />
              <button class="join-group-btn" @click.stop="handleJoinGroup(group)">去参团</button>
            </div>
          </div>
        </div>

        <div v-else class="no-ongoing">
          <span>暂无进行中的拼团，快来开团吧！</span>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">😕</div>
      <div class="empty-text">商品不存在</div>
    </div>

    <div class="bottom-bar" v-if="product">
      <button class="bottom-btn create-btn" @click="handleCreateGroup">
        我要开团
      </button>
      <button
        class="bottom-btn join-btn"
        :disabled="ongoingGroups.length === 0"
        @click="handleJoinFirst"
      >
        去参团
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
import CountdownTimer from '../components/CountdownTimer.vue'

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

const handleJoinGroup = (group) => {
  const result = store.joinGroup(group.id)
  if (result.success) {
    router.push(`/group/${group.id}`)
  } else {
    alert(result.message)
  }
}

const handleJoinFirst = () => {
  if (ongoingGroups.value.length > 0) {
    handleJoinGroup(ongoingGroups.value[0])
  }
}

onMounted(() => {
  store.updateGroupStatus()
  const productId = route.params.id
  if (productId) {
    product.value = store.getProductById(productId)
  }
})
</script>

<style scoped>
.product-detail-page {
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

.section-card {
  background-color: #fff;
  margin-top: 10px;
  padding: 15px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 12px;
}

.title-icon {
  font-size: 18px;
}

.ongoing-count {
  font-size: 12px;
  color: #ff4d4f;
  font-weight: normal;
  margin-left: auto;
}

.ongoing-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ongoing-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: #fafafa;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.ongoing-item:hover {
  background-color: #f0f0f0;
}

.ongoing-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar-stack {
  display: flex;
}

.stacked-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #fff;
  margin-left: -8px;
  object-fit: cover;
}

.stacked-avatar:first-child {
  margin-left: 0;
}

.ongoing-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ongoing-leader {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.ongoing-slots {
  font-size: 12px;
  color: #ff4d4f;
}

.ongoing-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.join-group-btn {
  padding: 6px 14px;
  background: linear-gradient(135deg, #ff7875, #ff4d4f);
  color: #fff;
  border-radius: 15px;
  font-size: 13px;
  font-weight: bold;
  white-space: nowrap;
}

.no-ongoing {
  text-align: center;
  padding: 20px 0;
  color: #999;
  font-size: 14px;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background-color: #fff;
  display: flex;
  gap: 10px;
  padding: 0 15px;
  align-items: center;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.bottom-btn {
  flex: 1;
  height: 38px;
  border-radius: 19px;
  font-size: 15px;
  font-weight: bold;
  color: #fff;
}

.bottom-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.bottom-btn.create-btn {
  background: linear-gradient(135deg, #ffa940, #fa8c16);
}

.bottom-btn.join-btn {
  background: linear-gradient(135deg, #ff7875, #ff4d4f);
}
</style>
