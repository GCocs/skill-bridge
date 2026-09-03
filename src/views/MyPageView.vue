<script setup>
import { computed, onMounted } from 'vue'

import CourseRecommendations from '@/components/CourseRecommendations.vue'
import UserInfoCard from '@/components/UserInfoCard.vue'
import { useMyPage } from '@/composables/useMyPage'
import heroIllustration from '@/assets/hero-illustration.png'

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
    ? '관심 분야를 바탕으로 다음에 들을 강의를 확인해 보세요.'
    : '강사 계정을 확인하고 새로운 강의를 등록해 보세요.'
})

onMounted(loadMyPage)
</script>

<template>
  <div class="my-page">
    <main>
      <div v-if="isProfileLoading && !user" class="loading-view" aria-live="polite">
        <span class="brand-loader" aria-hidden="true"><i></i><i></i></span>
        <p>나의 배움 공간을 준비하고 있어요.</p>
      </div>

      <div v-else-if="profileError && !user" class="error-view">
        <span aria-hidden="true">!</span>
        <p class="error-label">연결 오류</p>
        <h1>내 정보를 불러오지 못했어요.</h1>
        <p>{{ profileError }}</p>
        <button type="button" @click="loadMyPage">다시 시도하기</button>
      </div>

      <template v-else-if="user">
        <section class="hero" aria-labelledby="page-title">
          <div class="hero-decor" aria-hidden="true">
            <span></span>
            <span></span>
          </div>

          <div class="hero-copy">
            <p class="hero-eyebrow">SkillBridge 마이페이지</p>
            <h1 id="page-title">
              <strong>{{ user.name }}</strong
              >님, 반가워요
            </h1>
            <p class="hero-description">{{ heroCopy }}</p>
            <div class="hero-actions">
              <router-link
                :to="{ name: isStudent ? 'CourseList' : 'CourseCreate' }"
                class="primary-link"
              >
                {{ isStudent ? '강의 둘러보기' : '강의 등록하기' }}
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M4 10h12M11 5l5 5-5 5" />
                </svg>
              </router-link>
              <router-link v-if="isStudent" :to="{ name: 'Enrollment' }" class="secondary-link">
                내 성장 현황
              </router-link>
            </div>
          </div>

          <img :src="heroIllustration" alt="" class="hero-illustration" />
        </section>

        <div class="content-heading">
          <div>
            <h2>{{ isStudent ? '내 학습 공간' : '강사 계정' }}</h2>
            <p>
              {{
                isStudent
                  ? '계정 정보와 나에게 맞는 추천 강의를 한눈에 확인하세요.'
                  : '강사 계정 정보를 확인하고 새로운 강의를 등록할 수 있어요.'
              }}
            </p>
          </div>
        </div>

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
      <strong>SkillBridge</strong>
      <p>실무 데이터로 팀의 배움과 성장을 연결합니다.</p>
      <small>Copyright © 2026 SkillBridge</small>
    </footer>
  </div>
</template>

<style scoped>
.my-page {
  min-height: 100vh;
  background: #f6f7fa;
}

main {
  width: min(1200px, calc(100% - 48px));
  margin: 0 auto;
  padding-top: 36px;
}

.hero {
  position: relative;
  display: grid;
  min-height: 300px;
  padding: 48px 52px;
  align-items: center;
  grid-template-columns: minmax(0, 1fr) 360px;
  overflow: hidden;
  gap: 40px;
  border: 1px solid var(--line);
  border-radius: 24px;
  background: linear-gradient(135deg, #ffffff 0%, #f2f7f8 100%);
}

.hero-decor {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.hero-decor span {
  position: absolute;
  border-radius: 50%;
  filter: blur(50px);
}

.hero-decor span:first-child {
  top: -100px;
  right: 4%;
  width: 260px;
  height: 260px;
  background: rgba(20, 184, 138, 0.2);
}

.hero-decor span:last-child {
  right: 28%;
  bottom: -120px;
  width: 220px;
  height: 220px;
  background: rgba(31, 95, 146, 0.14);
}

.hero-copy {
  position: relative;
  z-index: 1;
}

.hero-eyebrow {
  display: inline-flex;
  margin: 0 0 14px;
  padding: 6px 12px;
  border-radius: 999px;
  background: var(--teal-soft);
  color: var(--teal-dark);
  font-size: 12px;
  font-weight: 700;
}

.hero h1 {
  margin: 0;
  color: var(--text);
  font-size: clamp(32px, 4vw, 44px);
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.035em;
}

.hero h1 strong {
  color: var(--navy-900);
  font-weight: 700;
}

.hero-description {
  max-width: 560px;
  margin: 14px 0 0;
  color: var(--muted);
  font-size: 16px;
  line-height: 1.65;
}

.hero-actions {
  display: flex;
  margin-top: 24px;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.primary-link,
.secondary-link {
  display: inline-flex;
  min-height: 44px;
  padding: 11px 20px;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  transition: var(--transition);
}

.primary-link {
  background: var(--navy-700);
  color: white;
  gap: 7px;
}

.primary-link svg {
  width: 17px;
  height: 17px;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
  transition: transform 0.15s ease;
}

.primary-link:hover {
  background: var(--navy-900);
  transform: translateY(-1px);
}

.primary-link:hover svg {
  transform: translateX(2px);
}

.secondary-link {
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.8);
  color: var(--navy-700);
}

.secondary-link:hover {
  border-color: var(--navy-300);
  background: white;
}

.hero-illustration {
  position: relative;
  z-index: 1;
  display: block;
  width: 100%;
  max-width: 350px;
  align-self: end;
  justify-self: end;
  flex: 0 0 auto;
}

.content-heading {
  display: flex;
  margin: 52px 0 22px;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
}

.content-heading h2 {
  margin: 0;
  font-size: 24px;
  letter-spacing: -0.025em;
}

.content-heading p {
  margin: 7px 0 0;
  color: var(--muted);
  font-size: 13px;
}

.content {
  display: grid;
  padding-bottom: 88px;
  grid-template-columns: 310px minmax(0, 1fr);
  align-items: start;
  gap: 32px;
}

.content--profile-only {
  display: block;
  padding-top: 4px;
}

footer {
  display: flex;
  min-height: 92px;
  padding: 26px max(24px, calc((100% - 1200px) / 2));
  align-items: center;
  border-top: 1px solid var(--line);
  background: var(--navy-50);
  color: var(--muted);
  gap: 14px;
}

footer strong {
  color: var(--navy-700);
  font-size: 14px;
}

footer p {
  margin: 0;
  font-size: 12px;
}

footer small {
  margin-left: auto;
  color: #84909d;
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

.error-label {
  margin: 0 0 8px;
  color: var(--alert);
  font-size: 12px;
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
  .hero {
    min-height: 280px;
    padding: 40px;
    grid-template-columns: minmax(0, 1fr) 260px;
  }

  .hero-illustration {
    width: 290px;
  }

  .content {
    grid-template-columns: 1fr;
    gap: 42px;
  }
}

@media (max-width: 640px) {
  main {
    width: min(100% - 32px, 1180px);
    padding-top: 20px;
  }

  .hero {
    min-height: auto;
    padding: 34px 26px 30px;
    grid-template-columns: 1fr;
    border-radius: 20px;
  }

  .hero h1 {
    font-size: 32px;
  }

  .hero-description {
    max-width: 420px;
    font-size: 14px;
  }

  .hero-illustration {
    display: none;
  }

  .content-heading {
    margin-top: 40px;
    align-items: flex-start;
  }

  .content {
    padding-bottom: 68px;
  }

  footer {
    min-height: 110px;
    padding: 24px;
    align-items: flex-start;
    flex-direction: column;
    gap: 5px;
  }

  footer small {
    display: none;
  }
}
</style>
