<template>
  <span class="countdown" v-if="status === 'ongoing'">
    <span class="time-unit">{{ display.hours }}</span>
    <span class="time-sep">:</span>
    <span class="time-unit">{{ display.minutes }}</span>
    <span class="time-sep">:</span>
    <span class="time-unit">{{ display.seconds }}</span>
  </span>
  <span class="countdown ended" v-else>已结束</span>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  endTime: {
    type: String,
    required: true
  }
})

const display = ref({ hours: '00', minutes: '00', seconds: '00' })
const status = ref('ongoing')
let timer = null

const tick = () => {
  const diff = new Date(props.endTime).getTime() - Date.now()
  if (diff <= 0) {
    display.value = { hours: '00', minutes: '00', seconds: '00' }
    status.value = 'ended'
    if (timer) clearInterval(timer)
    return
  }
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  display.value = {
    hours: String(h).padStart(2, '0'),
    minutes: String(m).padStart(2, '0'),
    seconds: String(s).padStart(2, '0')
  }
}

onMounted(() => {
  tick()
  timer = setInterval(tick, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.countdown {
  display: inline-flex;
  align-items: center;
  gap: 1px;
  font-size: 12px;
}

.time-unit {
  background-color: #333;
  color: #fff;
  padding: 1px 4px;
  border-radius: 2px;
  min-width: 20px;
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.time-sep {
  color: #333;
  font-weight: bold;
}

.countdown.ended {
  color: #999;
  font-size: 12px;
}
</style>
