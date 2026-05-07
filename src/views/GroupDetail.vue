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
    </div>
    
    <div v-else class="empty-state">
      <div class="empty-icon">😕</div>
      <div class="empty-text">拼团不存在或已结束</div>
    </div>
    
    <ActionBar 
      :showJoinButton="canJoin"
      :showCreateButton="canCreate"
      :showShareButton="canShare"
      :canJoin="group && group.status === 'ongoing' && group.remainingSlots > 0"
      @join="handleJoin"
      @create="handleCreate"
      @share="handleShare"
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
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGroupBuyStore } from '../store'
import ImageCarousel from '../components/ImageCarousel.vue'
import ProductPrice from '../components/ProductPrice.vue'
import GroupProgress from '../components/GroupProgress.vue'
import GroupRules from '../components/GroupRules.vue'
import ActionBar from '../components/ActionBar.vue'
import ShareModal from '../components/ShareModal.vue'

const route = useRoute()
const router = useRouter()
const store = useGroupBuyStore()

const group = ref(null)

const shareModalVisible = ref(false)
const shareUrl = ref('')
const shareTitle = ref('')
const shareDesc = ref('')

const canJoin = computed(() => {
  return group.value && group.value.status === 'ongoing' && group.value.remainingSlots > 0
})

const canCreate = computed(() => {
  return group.value && (group.value.status === 'success' || group.value.status === 'failed')
})

const canShare = computed(() => {
  return group.value && group.value.status === 'ongoing' && (group.value.isCreator || isMember.value)
})

const isMember = computed(() => {
  if (!group.value) return false
  return group.value.members.some(m => m.id === 'user_1')
})

const goBack = () => {
  router.back()
}

const handleJoin = () => {
  if (!group.value) return
  
  const result = store.joinGroup(group.value.id)
  if (result.success) {
    alert('参团成功！')
    group.value = store.getGroupById(group.value.id)
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
  const groupId = route.params.id
  if (groupId) {
    group.value = store.getGroupById(groupId)
  }
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
</style>
