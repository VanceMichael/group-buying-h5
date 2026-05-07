<template>
  <div class="image-carousel">
    <div class="carousel-container" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
      <div
        v-for="(image, index) in images"
        :key="index"
        class="carousel-slide"
      >
        <img :src="image" :alt="`商品图片${index + 1}`" class="carousel-image" />
      </div>
    </div>
    <div class="carousel-indicators">
      <span
        v-for="(_, index) in images"
        :key="index"
        class="indicator"
        :class="{ active: index === currentIndex }"
        @click="goToSlide(index)"
      ></span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    required: true
  },
  autoPlay: {
    type: Boolean,
    default: true
  },
  interval: {
    type: Number,
    default: 3000
  }
})

const currentIndex = ref(0)
let autoPlayTimer = null

const goToSlide = (index) => {
  currentIndex.value = index
}

const nextSlide = () => {
  if (currentIndex.value < props.images.length - 1) {
    currentIndex.value++
  } else {
    currentIndex.value = 0
  }
}

onMounted(() => {
  if (props.autoPlay && props.images.length > 1) {
    autoPlayTimer = setInterval(nextSlide, props.interval)
  }
})

onUnmounted(() => {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
  }
})
</script>

<style scoped>
.image-carousel {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.carousel-container {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.carousel-slide {
  min-width: 100%;
  box-sizing: border-box;
}

.carousel-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  display: block;
}

.carousel-indicators {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background-color: #fff;
  width: 20px;
  border-radius: 4px;
}
</style>
