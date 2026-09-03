<template>
  <div class="page-wrapper">
    <!-- 히어로 배너 -->
    <section class="hero">
      <div class="hero-decor" aria-hidden="true">
        <span class="decor-circle decor-a"></span>
        <span class="decor-circle decor-b"></span>
      </div>
      <div class="hero-inner">
        <div class="hero-text">
          <p class="hero-eyebrow">SKALA · B2B 리스킬링 플랫폼</p>
          <h1 class="hero-title">팀의 다음 역량을,<br />SkillBridge에서 채우세요.</h1>
          <p class="hero-desc">
            백엔드부터 보안까지, 현업 데이터로 구성된 교육 과정으로
            우리 팀에 필요한 스킬을 빠르게 학습하세요.
          </p>
          <div class="hero-actions">
            <button class="hero-cta" @click="scrollToAllCourses">
              전체 과정 보기
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
            <div class="search-bar">
              <svg class="search-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1.6" />
                <path d="M14 14L18 18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
              </svg>
              <input
                ref="searchInputEl"
                v-model="searchQuery"
                type="text"
                class="search-input"
                placeholder="과정 제목이나 키워드로 검색해보세요"
              />
            </div>
          </div>
        </div>
        <img :src="logoLockup" alt="SkillBridge" class="hero-logo" />
      </div>
    </section>

    <div class="chev-divider">
      <svg class="chev" viewBox="0 0 1000 16" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 8 L470 8 L500 15 L530 8 L1000 8" />
      </svg>
    </div>

    <main class="main-content">
      <!-- 카테고리 탐색 -->
      <section class="category-section">
        <h2 class="section-title">역량 영역별로 살펴보기</h2>
        <div class="category-tiles">
          <button
            v-for="cat in browsableCategories"
            :key="cat"
            class="category-tile"
            :style="{
              background: courseStore.categoryTintMap[cat],
              borderColor: courseStore.categoryTintBorderMap[cat]
            }"
            @click="selectCategoryAndScroll(cat)"
          >
            <span class="tile-icon-box" :style="{ color: courseStore.categoryColorMap[cat] }">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" v-html="courseStore.categoryIconPathMap[cat]"></svg>
            </span>
            <span class="tile-info">
              <span class="tile-label" :style="{ color: courseStore.categoryColorMap[cat] }">{{ cat }}</span>
              <span class="tile-count">{{ categoryCountLabel(cat) }}</span>
            </span>
          </button>
        </div>
      </section>

      <!-- 인기 강의 -->
      <section v-if="!loading && popularCourses.length" class="popular-section">
        <div class="section-header">
          <h2 class="section-title">인기 강의</h2>
          <p class="section-sub">수강생이 많은 과정부터 살펴보세요.</p>
        </div>
        <div class="popular-grid">
          <CourseCard
            v-for="course in popularCourses"
            :key="course.id"
            :course="course"
          />
        </div>
      </section>

      <!-- 전체 과정 -->
      <section id="all-courses" ref="allCoursesSection" class="all-courses-section">
        <div class="content-header">
          <h2 class="section-title">전체 과정</h2>
          <p class="section-sub">역량 영역별로 교육 과정을 살펴보고 신청하세요.</p>
        </div>

        <!-- 필터 -->
        <div class="filter-bar">
          <button
            v-for="cat in categories"
            :key="cat"
            :class="['filter-chip', { active: selectedCategory === cat }]"
            @click="selectCategory(cat)"
          >
            {{ cat }}
          </button>
        </div>

        <!-- 로딩 -->
        <div v-if="loading" class="loading-grid">
          <div v-for="i in 6" :key="i" class="skeleton-card">
            <div class="skeleton-thumb"></div>
            <div class="skeleton-body">
              <div class="skeleton-line short"></div>
              <div class="skeleton-line"></div>
              <div class="skeleton-line medium"></div>
            </div>
          </div>
        </div>

        <!-- 과정 그리드 -->
        <div v-else-if="filteredCourses.length" class="course-grid">
          <CourseCard
            v-for="course in filteredCourses"
            :key="course.id"
            :course="course"
          />
        </div>

        <!-- 빈 상태 -->
        <div v-else class="empty-state">
          <p v-if="searchQuery.trim()">'{{ searchQuery }}'에 대한 검색 결과가 없습니다.</p>
          <p v-else>해당 카테고리의 과정이 없습니다.</p>
        </div>
      </section>

      <!-- 통계 바 (실제 API 데이터 집계) -->
      <section class="stats-section" aria-label="SkillBridge 현황">
        <div class="stats-grid">
          <div class="stat-tile">
            <span class="stat-value">{{ courseStore.totalCourses }}<span class="stat-unit">개</span></span>
            <span class="stat-label">전체 강의</span>
          </div>
          <div class="stat-tile">
            <span class="stat-value">{{ courseStore.totalEnrollments.toLocaleString('ko-KR') }}<span class="stat-unit">명</span></span>
            <span class="stat-label">누적 수강 신청</span>
          </div>
          <div class="stat-tile">
            <span class="stat-value">{{ browsableCategories.length }}<span class="stat-unit">개</span></span>
            <span class="stat-label">역량 분야</span>
          </div>
        </div>
      </section>

      <!-- 왜 SkillBridge인가 -->
      <section class="feature-section">
        <div class="feature-visual" aria-hidden="true">
          <span class="feature-decor feature-decor-a"></span>
          <span class="feature-decor feature-decor-b"></span>
          <img :src="logoMark" alt="" class="feature-logo" />
        </div>
        <div class="feature-text">
          <h2 class="section-title">왜 SkillBridge인가요</h2>
          <p class="feature-desc">
            실제 현업 데이터를 기반으로 구성된 과정으로, 우리 팀에 필요한 역량을
            가장 빠른 길로 채울 수 있습니다.
          </p>
          <ul class="feature-list">
            <li v-for="item in featureItems" :key="item">
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 10.5l4 4 8-9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              {{ item }}
            </li>
          </ul>
          <button class="feature-cta" @click="scrollToAllCourses">전체 과정 보기</button>
        </div>
      </section>

      <!-- 클로징 배너 -->
      <section class="closing-banner">
        <p class="banner-eyebrow">TEAM RESKILLING</p>
        <h2 class="banner-title">지금, 팀의 다음 역량을 채우세요</h2>
        <p class="banner-desc">SkillBridge와 함께 실무 데이터 기반 학습을 시작해보세요.</p>
        <button class="banner-cta" @click="scrollToAllCourses">과정 둘러보기</button>
      </section>
    </main>

    <!-- 푸터 -->
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <img :src="logoMark" alt="" class="footer-logo" />
          <span class="footer-brand-name">SkillBridge</span>
          <p class="footer-tagline">SKALA · B2B 리스킬링 플랫폼</p>
        </div>
        <div class="footer-links">
          <span class="footer-links-title">카테고리</span>
          <button
            v-for="cat in browsableCategories"
            :key="cat"
            class="footer-link"
            @click="selectCategoryAndScroll(cat)"
          >
            {{ cat }}
          </button>
        </div>
      </div>
      <div class="footer-bottom">
        <p class="footer-copyright">© 2026 SkillBridge · SKALA 5조</p>
        <button class="scroll-top-btn" @click="scrollToTop" aria-label="맨 위로">
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M10 15V5M5 9l5-5 5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import CourseCard from '@/components/CourseCard.vue'
import { useCourseStore } from '@/store/course.js'
import logoLockup from '@/assets/logo-lockup.png'
import logoMark from '@/assets/logo-mark.png'

const courseStore = useCourseStore()

const { categories, loading } = courseStore

const selectedCategory = computed(() => courseStore.selectedCategory)
const popularCourses = computed(() => courseStore.popularCourses)
const browsableCategories = computed(() => courseStore.categories.filter((c) => c !== '전체'))
const searchQuery = ref('')

const filteredCourses = computed(() => {
  if (!Array.isArray(courseStore.courses)) return []
  let list = courseStore.courses
  if (selectedCategory.value !== '전체') {
    list = list.filter((c) => c.category === selectedCategory.value)
  }
  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
    list = list.filter((c) =>
      (c.title || '').toLowerCase().includes(q) ||
      (c.description || '').toLowerCase().includes(q)
    )
  }
  return list
})

function categoryCountLabel(cat) {
  const n = courseStore.categoryCounts[cat] || 0
  return `${n}개 과정`
}

const allCoursesSection = ref(null)
const searchInputEl = ref(null)

function focusSearch() {
  searchInputEl.value?.focus()
}

function selectCategory(cat) {
  courseStore.setCategory(cat)
}

function scrollToAllCourses() {
  allCoursesSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const featureItems = [
  '실무 데이터 기반 커리큘럼',
  '카테고리별 맞춤 학습 경로',
  '실시간 수강 현황 확인',
  '팀 단위 리스킬링 지원'
]

function selectCategoryAndScroll(cat) {
  courseStore.setCategory(cat)
  scrollToAllCourses()
}

// 검색어를 처음 입력하는 순간 결과 목록으로 자연스럽게 스크롤
watch(searchQuery, (newVal, oldVal) => {
  if (newVal.trim() && !oldVal.trim()) {
    scrollToAllCourses()
  }
})

onMounted(() => {
  courseStore.fetchCourses()
})
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  background: #F6F7FA;
  font-family: "IBM Plex Sans KR", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

/* 히어로 액션 (전체 과정 보기 + 검색) */
.hero-actions {
  margin-top: 24px;
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}
.hero-actions .hero-cta {
  margin-top: 0;
}

/* 검색 */
.search-bar {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 220px;
  max-width: 340px;
}
.search-icon {
  position: absolute;
  left: 14px;
  width: 16px;
  height: 16px;
  color: #93A0AD;
  pointer-events: none;
}
.search-input {
  width: 100%;
  padding: 11px 14px 11px 38px;
  border: 1.5px solid #DDE3EB;
  border-radius: 999px;
  font-size: 13.5px;
  font-family: inherit;
  color: #0E1B2A;
  background: #FFFFFF;
  transition: border-color .15s ease, box-shadow .15s ease;
}
.search-input::placeholder {
  color: #93A0AD;
}
.search-input:focus {
  outline: none;
  border-color: #1F5F92;
  box-shadow: 0 0 0 3px rgba(31, 95, 146, .12);
}

/* 히어로 — 브랜드 가이드 표지의 header.hero 그리드(로고 + 1fr)를 그대로 적용, 로고는 오른쪽 */
.hero {
  position: relative;
  overflow: hidden;
  background: #F6F7FA;
}

.hero-decor {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}
.decor-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(50px);
}
.decor-a {
  width: 300px;
  height: 300px;
  background: #14B88A;
  opacity: .18;
  top: -80px;
  right: 6%;
}
.decor-b {
  width: 220px;
  height: 220px;
  background: #1F5F92;
  opacity: .14;
  bottom: -60px;
  right: 26%;
}

.hero-inner {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 260px;
  gap: 56px;
  align-items: center;
  padding: 64px 24px 56px;
}

.hero-logo {
  width: 100%;
  height: auto;
  display: block;
}

.hero-eyebrow {
  margin: 0;
  font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: .16em;
  color: #5C6673;
  text-transform: uppercase;
}

.hero-title {
  margin: 14px 0 16px;
  font-size: clamp(30px, 4vw, 44px);
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1.2;
  color: #0E1B2A;
}

.hero-desc {
  margin: 0;
  font-size: 17px;
  font-weight: 300;
  line-height: 1.65;
  color: #5C6673;
  max-width: 52ch;
}

.hero-cta {
  margin-top: 24px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 13px 22px;
  border: none;
  border-radius: 999px;
  background: #11345A;
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background .15s ease, transform .15s ease;
}
.hero-cta svg {
  width: 18px;
  height: 18px;
  transition: transform .15s ease;
}
.hero-cta:hover {
  background: #0A1F36;
  transform: translateY(-1px);
}
.hero-cta:hover svg {
  transform: translateX(2px);
}

/* 시그니처 셰브런 디바이더 (브랜드 가이드 로고 모티프 — 전체 폭 라인 + 중앙 포인트, 로드 시 한 번 그려짐) */
.chev-divider {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}
.chev {
  display: block;
  width: 100%;
  height: 16px;
  overflow: visible;
}
.chev path {
  fill: none;
  stroke: #11345A;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 1400;
  stroke-dashoffset: 1400;
  animation: draw-chev 1.1s ease-out .15s forwards;
}
@media (prefers-reduced-motion: reduce) {
  .chev path {
    animation: none;
    stroke-dashoffset: 0;
  }
}
@keyframes draw-chev {
  to { stroke-dashoffset: 0; }
}

/* 본문 */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 24px 64px;
}

.section-title {
  font-size: 21px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: #0E1B2A;
  margin: 0;
}

.section-sub {
  margin: 6px 0 0;
  font-size: 13px;
  color: #5C6673;
}

.section-header {
  margin-bottom: 18px;
}

/* 카테고리 탐색 */
.category-section {
  margin-bottom: 56px;
}
.category-section .section-title {
  margin-bottom: 16px;
}

.category-tiles {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 14px;
}

.category-tile {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  border: 1.5px solid transparent;
  border-radius: 12px;
  text-align: left;
  cursor: pointer;
  transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease;
}
.category-tile:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(10,31,54,.1);
}
.tile-icon-box {
  flex: none;
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tile-icon-box svg {
  width: 22px;
  height: 22px;
}
.tile-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}
.tile-label {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tile-count {
  font-size: 11.5px;
  font-weight: 500;
  color: #5C6673;
}

/* 인기 강의 */
.popular-section {
  margin-bottom: 56px;
}

.popular-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

/* 전체 과정 */
.all-courses-section {
  scroll-margin-top: 24px;
}

.content-header {
  margin-bottom: 24px;
}

/* 필터 */
.filter-bar {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.filter-chip {
  padding: 7px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  border: 1.5px solid #DDE3EB;
  background: #FFFFFF;
  color: #5C6673;
  transition: border-color .15s ease, color .15s ease, background .15s ease;
  cursor: pointer;
}

.filter-chip:hover {
  border-color: #1F5F92;
  color: #1F5F92;
}

.filter-chip.active {
  background: #11345A;
  color: #fff;
  border-color: #11345A;
}

/* 과정 그리드 */
.course-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

/* 스켈레톤 */
.loading-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.skeleton-card {
  background: #FFFFFF;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #DDE3EB;
}

.skeleton-thumb {
  height: 120px;
  background: linear-gradient(90deg, #EDF2F7 25%, #DDE3EB 50%, #EDF2F7 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.skeleton-body {
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-line {
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(90deg, #EDF2F7 25%, #DDE3EB 50%, #EDF2F7 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.skeleton-line.short { width: 40%; }
.skeleton-line.medium { width: 70%; }

@keyframes shimmer {
  to { background-position: -200% 0; }
}

/* 빈 상태 */
.empty-state {
  text-align: center;
  padding: 80px 0;
  color: #5C6673;
  font-size: 15px;
}

@media (max-width: 900px) {
  .hero-inner {
    grid-template-columns: 1fr;
    gap: 28px;
    padding: 40px 0 32px;
    text-align: center;
  }
  .hero-logo {
    max-width: 200px;
    margin: 0 auto;
    order: -1;
  }
  .hero-desc {
    max-width: none;
    margin: 0 auto;
  }
  .hero-actions {
    justify-content: center;
  }
  .search-bar {
    max-width: 100%;
  }
  .category-tiles {
    grid-template-columns: repeat(2, 1fr);
  }
  .popular-grid,
  .course-grid,
  .loading-grid {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 901px) and (max-width: 1100px) {
  .category-tiles {
    grid-template-columns: repeat(3, 1fr);
  }
  .popular-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 통계 바 */
.stats-section {
  margin-top: 72px;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.stat-tile {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 28px 24px;
  border-radius: 16px;
  background: #F6F7FA;
  border: 1px solid #DDE3EB;
  text-align: center;
}
.stat-value {
  font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 30px;
  font-weight: 700;
  color: #11345A;
  letter-spacing: -0.02em;
}
.stat-unit {
  font-size: 16px;
  font-weight: 500;
  margin-left: 2px;
  color: #5C6673;
}
.stat-label {
  font-size: 13.5px;
  color: #5C6673;
}

/* 왜 SkillBridge인가 */
.feature-section {
  margin-top: 96px;
  display: grid;
  grid-template-columns: 420px 1fr;
  gap: 56px;
  align-items: center;
}
.feature-visual {
  position: relative;
  overflow: hidden;
  height: 320px;
  border-radius: 20px;
  background: linear-gradient(155deg, #0A1F36 0%, #11345A 60%, #1F5F92 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}
.feature-decor {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
}
.feature-decor-a {
  width: 200px;
  height: 200px;
  background: #14B88A;
  opacity: .35;
  top: -60px;
  right: -50px;
}
.feature-decor-b {
  width: 220px;
  height: 220px;
  background: #7C9BBC;
  opacity: .25;
  bottom: -80px;
  left: -60px;
}
.feature-logo {
  position: relative;
  width: 96px;
  height: auto;
  filter: brightness(0) invert(1);
  opacity: .95;
}
.feature-desc {
  margin: 14px 0 22px;
  font-size: 16px;
  font-weight: 300;
  line-height: 1.65;
  color: #5C6673;
  max-width: 56ch;
}
.feature-list {
  list-style: none;
  margin: 0 0 26px;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.feature-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14.5px;
  color: #0E1B2A;
}
.feature-list li svg {
  flex: none;
  width: 20px;
  height: 20px;
  color: #14B88A;
}
.feature-cta {
  padding: 12px 22px;
  border: 1.5px solid #11345A;
  border-radius: 999px;
  background: transparent;
  color: #11345A;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background .15s ease, color .15s ease;
}
.feature-cta:hover {
  background: #11345A;
  color: #FFFFFF;
}

/* 클로징 배너 */
.closing-banner {
  margin-top: 96px;
  padding: 64px 40px;
  border-radius: 24px;
  background: linear-gradient(120deg, #0A1F36 0%, #1F5F92 100%);
  text-align: center;
}
.banner-eyebrow {
  margin: 0;
  font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: .16em;
  color: #7C9BBC;
  text-transform: uppercase;
}
.banner-title {
  margin: 14px 0 10px;
  font-size: clamp(24px, 3vw, 32px);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #FFFFFF;
}
.banner-desc {
  margin: 0 0 26px;
  font-size: 15.5px;
  color: #C9D6E4;
}
.banner-cta {
  padding: 13px 26px;
  border: none;
  border-radius: 999px;
  background: #14B88A;
  color: #0A1F36;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background .15s ease, transform .15s ease;
}
.banner-cta:hover {
  background: #17CC98;
  transform: translateY(-1px);
}

/* 푸터 */
.site-footer {
  margin-top: 96px;
  background: #EDF2F7;
  border-top: 1px solid #DDE3EB;
}
.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 56px 24px 40px;
  display: flex;
  justify-content: space-between;
  gap: 48px;
  flex-wrap: wrap;
}
.footer-brand {
  max-width: 320px;
}
.footer-logo {
  height: 32px;
  width: auto;
  display: block;
}
.footer-brand-name {
  display: inline-block;
  margin-top: 10px;
  font-size: 16px;
  font-weight: 700;
  color: #0E1B2A;
}
.footer-tagline {
  margin: 8px 0 0;
  font-size: 13px;
  color: #5C6673;
}
.footer-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.footer-links-title {
  font-size: 13px;
  font-weight: 700;
  color: #0E1B2A;
  margin-bottom: 2px;
}
.footer-link {
  align-self: flex-start;
  padding: 0;
  border: none;
  background: none;
  font-size: 13.5px;
  color: #5C6673;
  cursor: pointer;
  transition: color .15s ease;
}
.footer-link:hover {
  color: #1F5F92;
}
.footer-bottom {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 24px 28px;
  border-top: 1px solid #DDE3EB;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.footer-copyright {
  margin: 0;
  font-size: 12.5px;
  color: #93A0AD;
}
.scroll-top-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: #0A1F36;
  color: #FFFFFF;
  cursor: pointer;
  transition: background .15s ease, transform .15s ease;
}
.scroll-top-btn svg {
  width: 18px;
  height: 18px;
}
.scroll-top-btn:hover {
  background: #11345A;
  transform: translateY(-2px);
}

@media (max-width: 900px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  .feature-section {
    grid-template-columns: 1fr;
  }
  .feature-visual {
    height: 200px;
  }
  .closing-banner {
    padding: 48px 24px;
  }
  .footer-inner {
    flex-direction: column;
    gap: 28px;
  }
}
</style>
