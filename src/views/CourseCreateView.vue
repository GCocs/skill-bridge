<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { courseApi } from '@/api/course.js'

const router = useRouter()
const submitting = ref(false)
const error = ref('')
const form = reactive({ title: '', description: '', category: 'BACKEND', price: 0 })

const categoryOptions = [
  ['BACKEND', '백엔드 개발'],
  ['FRONTEND', '프론트엔드 개발'],
  ['DEVOPS', 'DevOps · 인프라'],
  ['DATA_SCIENCE', '데이터 · AI'],
  ['SECURITY', '보안'],
]

async function submitCourse() {
  submitting.value = true
  error.value = ''

  try {
    const response = await courseApi.create({
      title: form.title.trim(),
      description: form.description.trim() || null,
      category: form.category,
      price: Number(form.price),
    })
    const course = response.data?.data ?? response.data
    if (course?.id) await router.push({ name: 'CourseDetail', params: { id: course.id } })
    else await router.push({ name: 'CourseList' })
  } catch (requestError) {
    error.value =
      requestError.response?.data?.message || requestError.message || '강의를 등록하지 못했습니다.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <main class="route-page create-page">
    <header class="route-page__header">
      <div>
        <p class="route-page__eyebrow">INSTRUCTOR</p>
        <h1 class="route-page__title">새 강의 등록</h1>
        <p class="route-page__description">학습자가 만나게 될 강의의 기본 정보를 입력하세요.</p>
      </div>
    </header>

    <form class="panel course-form" @submit.prevent="submitCourse">
      <label>
        <span>강의명</span>
        <input v-model.trim="form.title" required maxlength="100" placeholder="예: 실전 Vue 3" />
      </label>
      <label>
        <span>카테고리</span>
        <select v-model="form.category" required>
          <option v-for="[value, label] in categoryOptions" :key="value" :value="value">
            {{ label }}
          </option>
        </select>
      </label>
      <label>
        <span>가격</span>
        <input v-model.number="form.price" type="number" required min="0" step="1000" />
      </label>
      <label>
        <span>강의 설명</span>
        <textarea
          v-model.trim="form.description"
          rows="7"
          maxlength="1000"
          placeholder="학습 내용과 기대 효과를 소개해 주세요."
        ></textarea>
      </label>

      <p v-if="error" class="form-error" role="alert">{{ error }}</p>
      <div class="form-actions">
        <router-link :to="{ name: 'CourseList' }" class="secondary-button">취소</router-link>
        <button class="primary-button" type="submit" :disabled="submitting">
          {{ submitting ? '등록 중…' : '강의 등록' }}
        </button>
      </div>
    </form>
  </main>
</template>

<style scoped>
.create-page {
  max-width: 820px;
}
.course-form {
  display: grid;
  gap: 22px;
}
.course-form label {
  display: grid;
  gap: 8px;
}
.course-form label > span {
  font-size: 13px;
  font-weight: 700;
}
.course-form input,
.course-form select,
.course-form textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: white;
  color: var(--text);
}
.course-form textarea {
  resize: vertical;
}
.form-error {
  margin: 0;
  color: var(--alert);
  font-size: 13px;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
