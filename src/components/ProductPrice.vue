<template>
  <div class="product-price">
    <div class="price-row">
      <span class="group-price-label">拼团价</span>
      <span class="group-price">¥{{ groupPrice }}</span>
      <span class="original-price">¥{{ originalPrice }}</span>
    </div>
    <div class="price-info">
      <span class="sales">已售{{ sales }}件</span>
      <span class="stock" v-if="stock > 0">库存{{ stock }}件</span>
      <span class="stock out-of-stock" v-else>已售罄</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  groupPrice: {
    type: [Number, String],
    required: true
  },
  originalPrice: {
    type: [Number, String],
    required: true
  },
  sales: {
    type: Number,
    default: 0
  },
  stock: {
    type: Number,
    default: 0
  }
})
</script>

<style scoped>
.product-price {
  padding: 15px;
  background-color: #fff;
}

.price-row {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 10px;
}

.group-price-label {
  font-size: 14px;
  color: #ff4d4f;
  background-color: #fff1f0;
  padding: 2px 6px;
  border-radius: 2px;
}

.group-price {
  font-size: 28px;
  font-weight: bold;
  color: #ff4d4f;
}

.original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

.price-info {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #666;
}

.stock.out-of-stock {
  color: #ff4d4f;
}
</style>
