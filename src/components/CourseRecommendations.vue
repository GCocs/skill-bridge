<script setup>
import CourseCard from './CourseCard.vue'

defineProps({
  recommendation: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
})

defineEmits(['retry'])

const categoryLabels = {
  BACKEND: '백엔드',
  FRONTEND: '프론트엔드',
  DEVOPS: '데브옵스',
  DATA_SCIENCE: '데이터 사이언스',
  MOBILE: '모바일',
  SECURITY: '보안',
  DATABASE: '데이터베이스',
  OTHER: '전체 분야',
}
</script>

<template>
  <section class="recommendations" aria-labelledby="recommendation-title" aria-live="polite">
    <div class="section-heading">
      <div>
        <p class="section-kicker">FOR YOUR NEXT STEP</p>
        <h2 id="recommendation-title">추천 강의</h2>
      </div>

      <div v-if="recommendation" class="recommendation-basis">
        <span>추천 기준</span>
        <strong>{{ categoryLabels[recommendation.basedOnCategory] ?? '인기 강의' }}</strong>
      </div>
    </div>

    <p v-if="recommendation" class="recommendation-message">
      <span aria-hidden="true"></span>
      {{ recommendation.message }}
    </p>

    <div v-if="loading" class="course-list" aria-label="추천 강의를 불러오는 중">
      <div v-for="index in 4" :key="index" class="course-skeleton">
        <span></span>
        <div><i></i><i></i><i></i></div>
      </div>
    </div>

    <div v-else-if="error" class="state-panel state-panel--error">
      <span class="state-icon" aria-hidden="true">!</span>
      <div>
        <strong>추천 강의를 불러오지 못했어요.</strong>
        <p>{{ error }}</p>
      </div>
      <button type="button" @click="$emit('retry')">다시 불러오기</button>
    </div>

    <div v-else-if="recommendation?.recommendedCourses?.length" class="course-list">
      <CourseCard
        v-for="course in recommendation.recommendedCourses"
        :key="course.id"
        :course="course"
      />
    </div>

    <div v-else class="state-panel">
      <span class="state-icon" aria-hidden="true">✓</span>
      <div>
        <strong>새로운 추천을 준비하고 있어요.</strong>
        <p>학습 이력이 쌓이면 잘 맞는 강의를 소개해 드릴게요.</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.recommendations {
  min-width: 0;
}

.section-heading {
  display: flex;
  margin-bottom: 20px;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
}

.section-kicker {
  margin: 0 0 5px;
  color: var(--muted);
  font-family: var(--f-mono);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.16em;
}

h2 {
  margin: 0;
  font-size: 23px;
  line-height: 1.25;
  letter-spacing: -0.025em;
}

.recommendation-basis {
  text-align: right;
}

.recommendation-basis span,
.recommendation-basis strong {
  display: block;
}

.recommendation-basis span {
  margin-bottom: 1px;
  color: var(--muted);
  font-family: var(--f-mono);
  font-size: 9px;
  letter-spacing: 0.1em;
}

.recommendation-basis strong {
  color: var(--navy-500);
  font-size: 13px;
}

.recommendation-message {
  display: flex;
  margin: -7px 0 20px;
  align-items: center;
  color: var(--muted);
  font-size: 12px;
  gap: 8px;
}

.recommendation-message span {
  width: 18px;
  height: 1px;
  background: var(--teal);
}

.course-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.course-skeleton {
  display: grid;
  height: 192px;
  overflow: hidden;
  grid-template-columns: 142px 1fr;
  border: 1px solid var(--line);
  border-radius: 9px;
  background: var(--surface);
}

.course-skeleton > span,
.course-skeleton i {
  background: linear-gradient(90deg, var(--navy-50) 25%, var(--paper) 50%, var(--navy-50) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.3s infinite linear;
}

.course-skeleton > span {
  background-color: var(--navy-50);
}

.course-skeleton div {
  padding: 24px 20px;
}

.course-skeleton i {
  display: block;
  height: 10px;
  margin-bottom: 15px;
  border-radius: 4px;
}

.course-skeleton i:nth-child(2) {
  width: 85%;
  height: 28px;
}

.course-skeleton i:nth-child(3) {
  width: 60%;
}

@keyframes shimmer {
  to {
    background-position: -200% 0;
  }
}

.state-panel {
  display: flex;
  min-height: 150px;
  padding: 28px;
  align-items: center;
  border: 1px solid var(--line);
  border-radius: 9px;
  background: var(--surface);
  gap: 16px;
}

.state-icon {
  display: grid;
  width: 38px;
  height: 38px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 50%;
  background: var(--teal-soft);
  color: var(--teal-dark);
  font-family: var(--f-mono);
  font-weight: 700;
}

.state-panel strong {
  font-size: 14px;
}

.state-panel p {
  margin: 3px 0 0;
  color: var(--muted);
  font-size: 12px;
}

.state-panel button {
  margin-left: auto;
  padding: 9px 13px;
  border: 1px solid var(--navy-300);
  border-radius: 6px;
  background: transparent;
  color: var(--navy-700);
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  font-weight: 600;
}

.state-panel--error .state-icon {
  background: var(--alert-soft);
  color: var(--alert);
}

@media (max-width: 1120px) {
  .course-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 860px) {
  .course-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .course-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .section-heading {
    align-items: flex-start;
  }

  .recommendation-basis {
    padding-top: 3px;
  }

  .course-skeleton {
    grid-template-columns: 112px 1fr;
  }

  .state-panel {
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .state-panel button {
    width: 100%;
    margin-left: 54px;
  }
}
</style>
