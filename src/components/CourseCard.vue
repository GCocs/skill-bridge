<template>
  <router-link :to="`/courses/${course.id}`" class="course-card" :style="{ '--accent': categoryColor }">
    <div class="card-thumb">
      <svg class="thumb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" v-html="categoryIconPath"></svg>
      <span v-if="enrolled" class="enrolled-badge">신청함</span>
    </div>
    <div class="card-body">
      <span class="cat-pill" :style="{ background: categoryColor }">{{ course.category }}</span>
      <h3 class="card-title">{{ course.title }}</h3>
      <p class="card-desc">{{ course.description || '설명이 없습니다.' }}</p>
      <div class="card-meta">
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true">
          <path d="M10 10c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3Z" />
          <path d="M4.5 17c0-2.8 2.5-5 5.5-5s5.5 2.2 5.5 5" />
        </svg>
        <span>수강생 {{ enrollmentCountLabel }}명</span>
      </div>
      <div class="card-divider"></div>
      <div class="card-footer">
        <span class="price">₩{{ formattedPrice }}</span>
        <span class="view-btn">
          자세히 보기
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h9M8 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'
import { useCourseStore } from '@/store/course.js'

const props = defineProps({
  course: { type: Object, required: true },
  // 로그인(signIn 브랜치) merge 전까지는 항상 false. merge 후 실제 수강 여부로 연결 예정.
  enrolled: { type: Boolean, default: false }
})

const courseStore = useCourseStore()

const categoryColor = computed(() => courseStore.categoryColorMap[props.course.category] || '#5C6673')
const categoryIconPath = computed(() => courseStore.categoryIconPathMap[props.course.category] || '')
const formattedPrice = computed(() => Number(props.course.price ?? 0).toLocaleString())
const enrollmentCountLabel = computed(() => Number(props.course.enrollmentCount ?? 0).toLocaleString())
</script>

<style scoped>
.course-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: #FFFFFF;
  border: 1px solid #DDE3EB;
  border-radius: 16px;
  overflow: hidden;
  text-decoration: none;
  transition: transform .15s ease, box-shadow .15s ease;
  font-family: "IBM Plex Sans KR", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
.course-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 1px 2px rgba(10,31,54,.06), 0 8px 24px rgba(10,31,54,.08);
}
.card-thumb {
  position: relative;
  height: 112px;
  background-color: var(--accent, #5C6673);
  background-image: linear-gradient(135deg, rgba(255,255,255,.22) 0%, rgba(255,255,255,0) 55%);
  display: flex;
  align-items: center;
  justify-content: center;
}
.thumb-icon {
  width: 36px;
  height: 36px;
  color: #fff;
  filter: drop-shadow(0 2px 6px rgba(0,0,0,.15));
}
.enrolled-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #14B88A;
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 100px;
  z-index: 1;
}
.card-body {
  padding: 18px 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.cat-pill {
  align-self: flex-start;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 11px;
  border-radius: 100px;
}
.card-title {
  margin: 2px 0 0;
  font-size: 16px;
  font-weight: 600;
  color: #0E1B2A;
  line-height: 1.4;
}
.card-desc {
  margin: 0;
  font-size: 13px;
  color: #5C6673;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card-meta {
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #5C6673;
  font-size: 12px;
}
.card-meta svg {
  width: 15px;
  height: 15px;
  flex: none;
}
.card-divider {
  margin-top: 10px;
  height: 1px;
  background: #EDF2F7;
}
.card-footer {
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.price {
  font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 15px;
  font-weight: 600;
  color: #11345A;
}
.view-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12.5px;
  font-weight: 600;
  color: #1F5F92;
}
.view-btn svg {
  width: 14px;
  height: 14px;
  transition: transform .15s ease;
}
.course-card:hover .view-btn svg {
  transform: translateX(2px);
}
</style>
