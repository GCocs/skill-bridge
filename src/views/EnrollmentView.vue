<script setup>
import { onMounted, ref } from 'vue'
import { enrollmentApi } from '@/api/enrollment.js'

const enrollments = ref([])
const loading = ref(true)
const error = ref('')

function extractList(payload) {
  const data = payload?.data ?? payload
  if (Array.isArray(data)) return data
  return data?.content ?? data?.enrollments ?? data?.items ?? []
}

function courseIdOf(enrollment) {
  return enrollment.course?.id ?? enrollment.courseId
}

function courseTitleOf(enrollment) {
  const courseId = courseIdOf(enrollment)
  return (
    enrollment.course?.title ??
    enrollment.courseTitle ??
    (courseId ? `강의 #${courseId}` : '강의 정보')
  )
}

function courseLinkOf(enrollment) {
  const courseId = courseIdOf(enrollment)
  return courseId ? { name: 'CourseDetail', params: { id: courseId } } : { name: 'CourseList' }
}

async function loadEnrollments() {
  loading.value = true
  error.value = ''
  try {
    const response = await enrollmentApi.getMine()
    enrollments.value = extractList(response.data)
  } catch (requestError) {
    error.value =
      requestError.response?.data?.message ||
      requestError.message ||
      '수강 현황을 불러오지 못했습니다.'
  } finally {
    loading.value = false
  }
}

onMounted(loadEnrollments)
</script>

<template>
  <main class="route-page">
    <header class="route-page__header">
      <div>
        <p class="route-page__eyebrow">MY LEARNING</p>
        <h1 class="route-page__title">내 성장 현황</h1>
        <p class="route-page__description">신청한 강의와 학습 상태를 확인하세요.</p>
      </div>
    </header>

    <div v-if="loading" class="state-message" aria-live="polite">
      수강 현황을 불러오고 있습니다.
    </div>
    <div v-else-if="error" class="state-message state-message--error" role="alert">
      <p>{{ error }}</p>
      <button class="secondary-button" type="button" @click="loadEnrollments">다시 시도</button>
    </div>
    <section v-else-if="enrollments.length" class="enrollment-list" aria-label="수강 강의 목록">
      <router-link
        v-for="enrollment in enrollments"
        :key="enrollment.id ?? courseIdOf(enrollment)"
        :to="courseLinkOf(enrollment)"
        class="panel enrollment-row"
      >
        <div>
          <span>{{ enrollment.course?.category ?? enrollment.category ?? 'LEARNING' }}</span>
          <h2>{{ courseTitleOf(enrollment) }}</h2>
        </div>
        <div class="enrollment-status">
          <strong>{{ enrollment.status ?? 'ENROLLED' }}</strong>
          <small v-if="enrollment.progress != null">진행률 {{ enrollment.progress }}%</small>
        </div>
      </router-link>
    </section>
    <div v-else class="state-message">
      <p>아직 신청한 강의가 없습니다.</p>
      <router-link :to="{ name: 'CourseList' }" class="primary-button">강의 둘러보기</router-link>
    </div>
  </main>
</template>

<style scoped>
.enrollment-list {
  display: grid;
  gap: 14px;
}
.enrollment-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  transition: transform 0.15s ease;
}
.enrollment-row:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-strong);
}
.enrollment-row span {
  color: var(--navy-500);
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: 0.12em;
}
.enrollment-row h2 {
  margin: 6px 0 0;
  font-size: 20px;
}
.enrollment-status {
  display: grid;
  justify-items: end;
  gap: 5px;
  color: var(--teal-dark);
}
.enrollment-status small {
  color: var(--muted);
}
.state-message p {
  margin-top: 0;
}
@media (max-width: 560px) {
  .enrollment-row {
    align-items: flex-start;
    flex-direction: column;
  }
  .enrollment-status {
    justify-items: start;
  }
}
</style>
