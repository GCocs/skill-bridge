<script setup>
import { computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import CourseCard from '@/components/CourseCard.vue'
import { useAuthStore } from '@/store/auth.js'
import { useCourseStore } from '@/store/course.js'

const route = useRoute()
const auth = useAuthStore()
const courseStore = useCourseStore()
const { categories, courses, error, loading, selectedCategory, searchQuery } =
  storeToRefs(courseStore)

// role별로 안내 문구를 다르게 — 강사한테 "학습을 시작하세요"는 어색해서
const pageDescription = computed(() =>
  auth.user?.role === 'INSTRUCTOR'
    ? '등록한 과정을 확인하고, 팀에 필요한 새로운 과정을 준비해보세요.'
    : '필요한 역량을 선택하고 다음 학습을 시작하세요.'
)

const filteredCourses = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return courses.value.filter((course) => {
    const matchesCategory =
      selectedCategory.value === '전체' || course.category === selectedCategory.value
    const matchesQuery =
      !query ||
      course.title?.toLowerCase().includes(query) ||
      course.description?.toLowerCase().includes(query)
    return matchesCategory && matchesQuery
  })
})

function syncQuery() {
  const query = typeof route.query.q === 'string' ? route.query.q : ''
  courseStore.setSearchQuery(query)
}

watch(() => route.query.q, syncQuery)
onMounted(() => {
  syncQuery()
  if (!courses.value.length) courseStore.fetchCourses()
})
</script>

<template>
  <main class="route-page">
    <header class="route-page__header">
      <div>
        <p class="route-page__eyebrow">LEARNING PATHS</p>
        <h1 class="route-page__title">강의 목록</h1>
        <p class="route-page__description">{{ pageDescription }}</p>
      </div>
      <router-link
        v-if="auth.user?.role === 'INSTRUCTOR'"
        :to="{ name: 'CourseCreate' }"
        class="primary-button"
      >
        새 강의 등록
      </router-link>
    </header>

    <div class="filter-bar" aria-label="강의 카테고리">
      <button
        v-for="category in categories"
        :key="category"
        type="button"
        :class="['filter-button', { active: selectedCategory === category }]"
        @click="courseStore.setCategory(category)"
      >
        {{ category }}
      </button>
    </div>

    <div v-if="loading" class="state-message" aria-live="polite">강의를 불러오고 있습니다.</div>
    <div v-else-if="error" class="state-message state-message--error" role="alert">
      <p>{{ error }}</p>
      <button class="secondary-button" type="button" @click="courseStore.fetchCourses">
        다시 시도
      </button>
    </div>
    <div v-else-if="filteredCourses.length" class="course-grid">
      <CourseCard v-for="course in filteredCourses" :key="course.id" :course="course" />
    </div>
    <div v-else class="state-message">
      {{ searchQuery ? `'${searchQuery}'에 맞는 강의가 없습니다.` : '등록된 강의가 없습니다.' }}
    </div>
  </main>
</template>

<style scoped>
.filter-bar {
  display: flex;
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-button {
  padding: 8px 15px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--surface);
  color: var(--muted);
}

.filter-button.active {
  border-color: var(--navy-700);
  background: var(--navy-700);
  color: white;
}

.course-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.state-message p {
  margin-top: 0;
}

@media (max-width: 900px) {
  .course-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .course-grid {
    grid-template-columns: 1fr;
  }
}
</style>
