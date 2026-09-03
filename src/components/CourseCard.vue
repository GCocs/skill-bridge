<script setup>
import { computed } from 'vue'

const props = defineProps({
  course: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
})

const categoryLabels = {
  BACKEND: '백엔드',
  FRONTEND: '프론트엔드',
  DEVOPS: '데브옵스',
  DATA_SCIENCE: '데이터 사이언스',
  MOBILE: '모바일',
  SECURITY: '보안',
  DATABASE: '데이터베이스',
  OTHER: '기타',
}

const categoryLabel = computed(() => categoryLabels[props.course.category] ?? props.course.category)
const cardIndex = computed(() => String(props.index + 1).padStart(2, '0'))
const formattedPrice = computed(() => `${Number(props.course.price).toLocaleString('ko-KR')}원`)
const formattedEnrollment = computed(() =>
  Number(props.course.enrollmentCount).toLocaleString('ko-KR'),
)
</script>

<template>
  <RouterLink
    class="course-card"
    :to="`/courses/${course.id}`"
    :aria-label="`${course.title} 강의 상세 보기`"
  >
    <div class="course-visual" :data-category="course.category">
      <span class="course-index">{{ cardIndex }}</span>
      <span class="visual-label">{{ categoryLabel }}</span>
      <svg viewBox="0 0 152 88" aria-hidden="true">
        <path class="path-back" d="M13 72 67 18l31 31 41-40" />
        <path class="path-front" d="m20 79 48-47 30 30 38-38" />
        <circle cx="68" cy="32" r="4" />
        <circle cx="98" cy="62" r="4" />
      </svg>
    </div>

    <div class="course-body">
      <div class="course-meta">
        <span>{{ categoryLabel }}</span>
        <span aria-hidden="true">·</span>
        <span>수강생 {{ formattedEnrollment }}명</span>
      </div>
      <h3>{{ course.title }}</h3>
      <p>{{ course.description || '강의 소개가 곧 업데이트됩니다.' }}</p>
      <div class="course-footer">
        <strong>{{ formattedPrice }}</strong>
        <span v-if="course.status === 'PUBLISHED'" class="status">
          <i aria-hidden="true"></i>
          수강 가능
        </span>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped>
.course-card {
  display: grid;
  min-width: 0;
  overflow: hidden;
  grid-template-columns: 142px minmax(0, 1fr);
  border: 1px solid var(--line);
  border-radius: 9px;
  background: var(--surface);
  color: inherit;
  box-shadow: 0 1px 2px rgba(10, 31, 54, 0.025);
  text-decoration: none;
  transition:
    transform 180ms ease,
    border-color 180ms ease,
    box-shadow 180ms ease;
}

.course-card:hover {
  border-color: var(--navy-300);
  box-shadow: var(--shadow-strong);
  transform: translateY(-2px);
}

.course-visual {
  position: relative;
  min-height: 190px;
  overflow: hidden;
  background: var(--navy-900);
  color: white;
}

.course-visual::before {
  position: absolute;
  top: 0;
  right: 0;
  width: 72%;
  height: 48%;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  content: '';
  transform: skewY(-27deg) translateY(-20px);
}

.course-visual[data-category='BACKEND'] {
  background: #11345a;
}

.course-index,
.visual-label {
  position: absolute;
  z-index: 1;
  left: 17px;
  font-family: var(--f-mono);
}

.course-index {
  top: 15px;
  color: var(--navy-300);
  font-size: 10px;
  letter-spacing: 0.12em;
}

.visual-label {
  bottom: 17px;
  color: var(--navy-100);
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.course-visual svg {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 135px;
  fill: var(--teal);
  transform: translate(-43%, -51%);
}

.course-visual path {
  fill: none;
  stroke-linecap: square;
  stroke-linejoin: bevel;
  stroke-width: 2;
}

.path-back {
  stroke: rgba(201, 214, 228, 0.2);
}

.path-front {
  stroke: var(--teal);
}

.course-body {
  display: flex;
  min-width: 0;
  padding: 20px 21px;
  flex-direction: column;
}

.course-meta {
  display: flex;
  align-items: center;
  color: var(--muted);
  font-size: 10.5px;
  gap: 6px;
}

.course-meta span:first-child {
  color: var(--navy-500);
  font-weight: 700;
}

h3 {
  display: -webkit-box;
  margin: 11px 0 7px;
  overflow: hidden;
  font-size: 16px;
  line-height: 1.42;
  letter-spacing: -0.018em;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

p {
  display: -webkit-box;
  margin: 0 0 19px;
  overflow: hidden;
  color: var(--muted);
  font-size: 12px;
  font-weight: 400;
  line-height: 1.55;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.course-footer {
  display: flex;
  margin-top: auto;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
}

.course-footer strong {
  font-size: 15px;
  letter-spacing: -0.02em;
}

.status {
  display: flex;
  align-items: center;
  color: var(--muted);
  font-size: 10px;
  gap: 5px;
  white-space: nowrap;
}

.status i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--teal);
}

@media (max-width: 600px) {
  .course-card {
    grid-template-columns: 112px minmax(0, 1fr);
  }

  .course-visual {
    min-height: 184px;
  }

  .course-visual svg {
    width: 116px;
  }

  .course-body {
    padding: 18px;
  }
}

@media (max-width: 390px) {
  .course-card {
    grid-template-columns: 1fr;
  }

  .course-visual {
    min-height: 102px;
  }

  .course-visual svg {
    width: 130px;
  }
}
</style>
