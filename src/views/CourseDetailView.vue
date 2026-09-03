<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { courseApi } from '@/api/course.js'
import { enrollmentApi } from '@/api/enrollment.js'
import { useAuthStore } from '@/store/auth.js'
import { useCourseStore } from '@/store/course.js'

const route = useRoute()
const auth = useAuthStore()
const courseStore = useCourseStore()
const course = ref(null)
const loading = ref(true)
const error = ref('')
const enrolling = ref(false)
const enrollmentMessage = ref('')
const enrollmentError = ref('')

const category = computed(() => courseStore.normalizeCategory(course.value?.category) || '기타')
const price = computed(() => Number(course.value?.price ?? 0).toLocaleString('ko-KR'))
const isStudent = computed(() => auth.user?.role === 'STUDENT')

async function loadCourse() {
  loading.value = true
  error.value = ''
  course.value = null

  try {
    const response = await courseApi.getById(route.params.id)
    course.value = courseStore.normalizeCourse(response.data?.data ?? response.data)
    if (!course.value) throw new Error('강의 정보를 확인할 수 없습니다.')
  } catch (requestError) {
    error.value =
      requestError.response?.status === 404
        ? '존재하지 않는 강의입니다.'
        : requestError.response?.data?.message ||
          requestError.message ||
          '강의를 불러오지 못했습니다.'
  } finally {
    loading.value = false
  }
}

async function enroll() {
  if (!isStudent.value) {
    enrollmentError.value = '강사 계정은 수강 신청을 할 수 없습니다.'
    return
  }

  enrolling.value = true
  enrollmentError.value = ''
  enrollmentMessage.value = ''

  try {
    await enrollmentApi.create(Number(route.params.id))
    enrollmentMessage.value = '수강 신청이 완료되었습니다.'
  } catch (requestError) {
    enrollmentError.value =
      requestError.response?.status === 409
        ? '이미 신청한 강의입니다.'
        : requestError.response?.data?.message ||
          requestError.message ||
          '수강 신청을 완료하지 못했습니다.'
  } finally {
    enrolling.value = false
  }
}

watch(() => route.params.id, loadCourse)
onMounted(loadCourse)
</script>

<template>
  <main class="route-page">
    <div v-if="loading" class="state-message" aria-live="polite">
      강의 정보를 불러오고 있습니다.
    </div>
    <div v-else-if="error" class="state-message state-message--error" role="alert">
      <p>{{ error }}</p>
      <button class="secondary-button" type="button" @click="loadCourse">다시 시도</button>
    </div>
    <article v-else-if="course" class="detail-layout">
      <section class="detail-main panel">
        <p class="route-page__eyebrow">{{ category }}</p>
        <h1>{{ course.title }}</h1>
        <p class="description">{{ course.description || '등록된 강의 설명이 없습니다.' }}</p>
        <dl>
          <div>
            <dt>강사 ID</dt>
            <dd>{{ course.instructorId ?? '-' }}</dd>
          </div>
          <div>
            <dt>수강생</dt>
            <dd>{{ Number(course.enrollmentCount ?? 0).toLocaleString('ko-KR') }}명</dd>
          </div>
          <div>
            <dt>상태</dt>
            <dd>{{ course.status ?? 'PUBLISHED' }}</dd>
          </div>
        </dl>
      </section>
      <aside class="panel enroll-panel">
        <span>수강료</span>
        <strong>₩{{ price }}</strong>
        <button
          class="primary-button"
          type="button"
          :disabled="enrolling || !isStudent"
          @click="enroll"
        >
          {{ !isStudent ? '강사 계정은 신청 불가' : enrolling ? '신청 중…' : '수강 신청' }}
        </button>
        <p v-if="!isStudent" class="role-notice">수강 신청은 학생 계정만 가능합니다.</p>
        <p v-if="enrollmentMessage" class="success-message" role="status">
          {{ enrollmentMessage }}
        </p>
        <p v-if="enrollmentError" class="error-message" role="alert">{{ enrollmentError }}</p>
        <router-link v-if="isStudent" :to="{ name: 'Enrollment' }">
          내 수강 현황 보기 →
        </router-link>
      </aside>
    </article>
  </main>
</template>

<style scoped>
.detail-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 24px;
}
.detail-main {
  min-height: 360px;
  padding: 42px;
}
.detail-main h1 {
  margin: 0;
  font-size: clamp(30px, 5vw, 48px);
  letter-spacing: -0.04em;
}
.description {
  max-width: 70ch;
  margin: 24px 0 40px;
  color: var(--muted);
  line-height: 1.8;
  white-space: pre-wrap;
}
dl {
  display: flex;
  margin: 0;
  padding-top: 22px;
  border-top: 1px solid var(--line);
  gap: 36px;
}
dl div {
  display: grid;
  gap: 5px;
}
dt {
  color: var(--muted);
  font-size: 12px;
}
dd {
  margin: 0;
  font-weight: 700;
}
.enroll-panel {
  align-self: start;
  display: grid;
  gap: 14px;
  position: sticky;
  top: 100px;
}
.enroll-panel > span {
  color: var(--muted);
  font-size: 13px;
}
.enroll-panel > strong {
  margin-bottom: 10px;
  color: var(--navy-700);
  font-family: var(--f-mono);
  font-size: 28px;
}
.enroll-panel > a {
  color: var(--navy-500);
  font-size: 13px;
  text-align: center;
}
.success-message,
.error-message,
.role-notice {
  margin: 0;
  font-size: 13px;
  text-align: center;
}
.role-notice {
  color: var(--muted);
}
.success-message {
  color: var(--teal-dark);
}
.error-message {
  color: var(--alert);
}
@media (max-width: 800px) {
  .detail-layout {
    grid-template-columns: 1fr;
  }
  .enroll-panel {
    position: static;
  }
  .detail-main {
    padding: 28px;
  }
}
</style>
