<script setup>
import { computed, onMounted } from 'vue'

import AppHeader from '@/components/AppHeader.vue'
import CourseRecommendations from '@/components/CourseRecommendations.vue'
import UserInfoCard from '@/components/UserInfoCard.vue'
import { useMyPage } from '@/composables/useMyPage'

const {
  user,
  recommendation,
  isStudent,
  isProfileLoading,
  isRecommendationLoading,
  profileError,
  recommendationError,
  loadMyPage,
  loadRecommendations,
} = useMyPage()

const heroCopy = computed(() => {
  if (!user.value) return ''

  return isStudent.value
    ? '관심 분야를 바탕으로, 다음 성장을 위한 강의를 골랐어요.'
    : '배움의 가능성을 연결하는 여정을 함께하고 있어요.'
})

onMounted(loadMyPage)
</script>

<template>
  <div class="my-page">
    <AppHeader :user="user" />

    <main>
      <div v-if="isProfileLoading && !user" class="loading-view" aria-live="polite">
        <span class="brand-loader" aria-hidden="true"><i></i><i></i></span>
        <p>나의 배움 공간을 준비하고 있어요.</p>
      </div>

      <div v-else-if="profileError && !user" class="error-view">
        <span aria-hidden="true">!</span>
        <p class="section-kicker">CONNECTION ERROR</p>
        <h1>내 정보를 불러오지 못했어요.</h1>
        <p>{{ profileError }}</p>
        <button type="button" @click="loadMyPage">다시 시도하기</button>
      </div>

      <template v-else-if="user">
        <section class="hero" aria-labelledby="page-title">
          <div class="hero-copy">
            <p class="section-kicker">MY LEARNING JOURNEY</p>
            <h1 id="page-title">
              <strong>{{ user.name }}</strong
              >님, 반가워요.
            </h1>
            <p>{{ heroCopy }}</p>
          </div>

          <div class="hero-signature" aria-hidden="true">
            <span>{{ isStudent ? 'LEARNER' : 'INSTRUCTOR' }}</span>
            <svg viewBox="0 0 230 92">
              <path d="m4 18 74 66L151 9l75 67" />
              <path d="m4 4 74 66L151 0l75 63" />
            </svg>
          </div>
        </section>

        <svg
          class="chevron-rule"
          viewBox="0 0 1180 12"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0 2H545l45 8 45-8h545" />
        </svg>

        <div class="content" :class="{ 'content--profile-only': !isStudent }">
          <UserInfoCard :user="user" :wide="!isStudent" />
          <CourseRecommendations
            v-if="isStudent"
            :recommendation="recommendation"
            :loading="isRecommendationLoading"
            :error="recommendationError"
            @retry="loadRecommendations"
          />
        </div>
      </template>
    </main>

    <footer>
      <div>
        <span>SKILL BRIDGE</span>
        <p>배움과 가능성을 잇는 가장 단단한 연결.</p>
      </div>
      <small>LEARN · CONNECT · GROW</small>
    </footer>
  </div>
</template>

<style scoped>
.my-page {
  min-height: 100vh;
}

main,
footer {
  width: min(1180px, calc(100% - 48px));
  margin: 0 auto;
}

.hero {
  position: relative;
  display: flex;
  min-height: 285px;
  padding: 63px 0 52px;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  gap: 48px;
}

.section-kicker {
  margin: 0 0 10px;
  color: var(--muted);
  font-family: var(--f-mono);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.17em;
}

.hero h1 {
  margin: 0;
  font-size: clamp(34px, 4.5vw, 52px);
  font-weight: 300;
  line-height: 1.22;
  letter-spacing: -0.04em;
}

.hero h1 strong {
  color: var(--navy-900);
  font-weight: 700;
}

.hero-copy > p:last-child {
  margin: 16px 0 0;
  color: var(--muted);
  font-size: 15px;
  font-weight: 300;
}

.hero-signature {
  position: relative;
  width: 295px;
  height: 135px;
  flex: 0 0 auto;
  opacity: 0.9;
}

.hero-signature span {
  position: absolute;
  z-index: 1;
  top: 5px;
  right: 10px;
  color: var(--navy-300);
  font-family: var(--f-mono);
  font-size: 9px;
  letter-spacing: 0.2em;
}

.hero-signature svg {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 230px;
  fill: none;
  stroke-linecap: square;
}

.hero-signature path:first-child {
  stroke: var(--navy-100);
  stroke-width: 22px;
}

.hero-signature path:last-child {
  stroke: var(--navy-700);
  stroke-width: 2px;
}

.chevron-rule {
  display: block;
  width: 100%;
  height: 12px;
  margin-bottom: 44px;
  fill: none;
  stroke: var(--navy-700);
  stroke-width: 1.5;
  vector-effect: non-scaling-stroke;
}

.content {
  display: grid;
  padding-bottom: 92px;
  grid-template-columns: 296px minmax(0, 1fr);
  align-items: start;
  gap: 38px;
}

.content--profile-only {
  display: block;
  padding-top: 4px;
}

footer {
  display: flex;
  padding: 27px 0 38px;
  align-items: flex-start;
  justify-content: space-between;
  border-top: 1px solid var(--line);
  color: var(--muted);
}

footer span,
footer small {
  font-family: var(--f-mono);
  font-size: 9px;
  letter-spacing: 0.16em;
}

footer span {
  color: var(--navy-700);
  font-weight: 500;
}

footer p {
  margin: 5px 0 0;
  font-size: 11px;
}

.loading-view,
.error-view {
  display: flex;
  min-height: calc(100vh - 160px);
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
}

.loading-view p {
  margin-top: 24px;
  color: var(--muted);
  font-size: 13px;
}

.brand-loader {
  position: relative;
  display: flex;
  width: 58px;
  height: 47px;
  justify-content: center;
  animation: pulse 1.3s infinite ease-in-out;
}

.brand-loader i {
  width: 30px;
  height: 42px;
  border: 5px solid var(--navy-700);
}

.brand-loader i:first-child {
  border-right: 2px solid var(--navy-700);
  clip-path: polygon(0 0, 100% 35%, 100% 100%, 0 64%);
}

.brand-loader i:last-child {
  border-left: 2px solid var(--navy-700);
  clip-path: polygon(0 35%, 100% 0, 100% 64%, 0 100%);
}

@keyframes pulse {
  50% {
    opacity: 0.45;
    transform: translateY(-3px);
  }
}

.error-view > span {
  display: grid;
  width: 50px;
  height: 50px;
  margin-bottom: 22px;
  place-items: center;
  border-radius: 50%;
  background: var(--alert-soft);
  color: var(--alert);
  font-family: var(--f-mono);
  font-weight: 700;
}

.error-view h1 {
  margin: 0;
  font-size: 27px;
}

.error-view h1 + p {
  margin: 10px 0 22px;
  color: var(--muted);
  font-size: 13px;
}

.error-view button {
  padding: 10px 18px;
  border: 0;
  border-radius: 6px;
  background: var(--navy-700);
  color: white;
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
}

@media (max-width: 860px) {
  .hero-signature {
    width: 220px;
    opacity: 0.7;
  }

  .content {
    grid-template-columns: 1fr;
    gap: 42px;
  }
}

@media (max-width: 640px) {
  main,
  footer {
    width: min(100% - 32px, 1180px);
  }

  .hero {
    min-height: 250px;
    padding: 48px 0 42px;
  }

  .hero h1 {
    font-size: 35px;
  }

  .hero-copy > p:last-child {
    max-width: 300px;
    font-size: 13px;
  }

  .hero-signature {
    position: absolute;
    right: -90px;
    bottom: 12px;
    opacity: 0.22;
  }

  .chevron-rule {
    margin-bottom: 34px;
  }

  .content {
    padding-bottom: 68px;
  }

  footer small {
    display: none;
  }
}
</style>
