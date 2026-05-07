<template>
  <div class="home-page page-container">
    <div class="home-header">
      <h1 class="home-title">拼团特惠</h1>
      <p class="home-subtitle">超值优惠，一起拼团更划算！</p>
    </div>
    
    <div class="product-list">
      <div 
        class="product-item" 
        v-for="product in products" 
        :key="product.id"
        @click="goToProductDetail(product.id)"
      >
        <div class="product-image">
          <img :src="product.images[0]" :alt="product.name" />
          <div class="group-tag">{{ product.groupSize }}人团</div>
        </div>
        <div class="product-info">
          <h3 class="product-name">{{ product.name }}</h3>
          <p class="product-desc">{{ product.description }}</p>
          <div class="product-price-row">
            <span class="group-price">¥{{ product.groupPrice }}</span>
            <span class="original-price">¥{{ product.originalPrice }}</span>
            <span class="sales">已售{{ product.sales }}件</span>
          </div>
        </div>
        <div class="product-actions">
          <button class="action-btn create-btn" @click.stop="handleCreateGroup(product)">
            发起拼团
          </button>
          <button class="action-btn join-btn" @click.stop="viewExistingGroups(product.id)">
            去参团
          </button>
        </div>
      </div>
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

const store = useGroupBuyStore()
const router = useRouter()

const products = computed(() => store.products)
const groups = computed(() => store.groups)

const shareModalVisible = ref(false)
const shareUrl = ref('')
const shareTitle = ref('')
const shareDesc = ref('')

const goToProductDetail = (productId) => {
  const productGroups = groups.value.filter(g => g.productId === productId && g.status === 'ongoing')
  if (productGroups.length > 0) {
    router.push(`/group/${productGroups[0].id}`)
  }
}

const handleCreateGroup = (product) => {
  const newGroup = store.createGroup(product.id)
  if (newGroup) {
    shareUrl.value = `${window.location.origin}/group/${newGroup.id}`
    shareTitle.value = `快来和我一起拼${product.name}！`
    shareDesc.value = `仅需${product.groupPrice}元，${product.groupSize}人成团，超值优惠！`
    shareModalVisible.value = true
  }
}

const viewExistingGroups = (productId) => {
  const productGroups = groups.value.filter(g => g.productId === productId && g.status === 'ongoing')
  if (productGroups.length > 0) {
    router.push(`/group/${productGroups[0].id}`)
  } else {
    alert('暂无可参与的拼团，快来发起一个吧！')
  }
}
</script>

<style scoped>
.home-page {
  background-color: #f5f5f5;
}

.home-header {
  background: linear-gradient(135deg, #ff4d4f, #ff7875);
  padding: 30px 20px;
  text-align: center;
  color: #fff;
}

.home-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
}

.home-subtitle {
  font-size: 14px;
  opacity: 0.9;
}

.product-list {
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.product-item {
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
}

.product-image {
  position: relative;
  width: 100%;
  height: 200px;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.group-tag {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: #ff4d4f;
  color: #fff;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
}

.product-info {
  padding: 15px;
}

.product-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.product-desc {
  font-size: 13px;
  color: #666;
  margin-bottom: 12px;
  line-height: 1.5;
}

.product-price-row {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.group-price {
  font-size: 22px;
  font-weight: bold;
  color: #ff4d4f;
}

.original-price {
  font-size: 13px;
  color: #999;
  text-decoration: line-through;
}

.sales {
  margin-left: auto;
  font-size: 12px;
  color: #999;
}

.product-actions {
  display: flex;
  gap: 10px;
  padding: 0 15px 15px;
}

.action-btn {
  flex: 1;
  height: 36px;
  border-radius: 18px;
  font-size: 14px;
  font-weight: bold;
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
</style>
