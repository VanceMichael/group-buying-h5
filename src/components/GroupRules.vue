<template>
  <div class="group-rules">
    <div class="rules-header">
      <span class="rules-title">拼团规则</span>
    </div>
    <div class="rules-content">
      <div class="rule-item" v-for="(rule, index) in rules" :key="index">
        <span class="rule-number">{{ index + 1 }}</span>
        <span class="rule-text">{{ rule }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  rules: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.group-rules {
  background-color: #fff;
  padding: 15px;
  margin-top: 10px;
}

.rules-header {
  margin-bottom: 10px;
}

.rules-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.rules-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.rule-item {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.rule-number {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: #ff4d4f;
  color: #fff;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}

.rule-text {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}
</style>
