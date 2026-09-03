import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { courseApi } from '@/api/course.js'

export const useCourseStore = defineStore('course', () => {
  const courses = ref([])
  const loading = ref(false)
  const error = ref(null)
  const selectedCategory = ref('전체')
  const searchQuery = ref('')

  const categories = ['전체', '백엔드 개발', '프론트엔드 개발', 'DevOps · 인프라', '데이터 · AI', '보안']

  // 백엔드 카테고리(ENUM) → 프론트 표시용 라벨 (브랜드 가이드 5종 매핑)
  const categoryLabelMap = {
    BACKEND: '백엔드 개발',
    FRONTEND: '프론트엔드 개발',
    DEVOPS: 'DevOps · 인프라',
    DATA_SCIENCE: '데이터 · AI',
    SECURITY: '보안'
  }

  // 카테고리별 브랜드 컬러 (브랜드 가이드 고정값)
  const categoryColorMap = {
    '백엔드 개발': '#11345A',
    '프론트엔드 개발': '#1F5F92',
    'DevOps · 인프라': '#2F7A66',
    '데이터 · AI': '#5A4B92',
    '보안': '#8F463C'
  }

  // 카테고리별 아이콘 — Phosphor Icons 스타일의 24x24 라인 아이콘 path (이모티콘 대체, v-html로 <svg> 안에 렌더링)
  const categoryIconPathMap = {
    '백엔드 개발': '<rect x="6.5" y="6.5" width="11" height="11" rx="1.5"/><rect x="10" y="10" width="4" height="4" rx="0.5"/><path d="M9 3v3.5M12 3v3.5M15 3v3.5M9 17.5V21M12 17.5V21M15 17.5V21M3 9h3.5M3 12h3.5M3 15h3.5M17.5 9H21M17.5 12H21M17.5 15H21"/>',
    '프론트엔드 개발': '<path d="M8 7 3 12l5 5M16 7l5 5-5 5M13.5 4.5l-3 15"/>',
    'DevOps · 인프라': '<path d="M12 3 3 8l9 5 9-5-9-5Z"/><path d="M3 12l9 5 9-5"/><path d="M3 16l9 5 9-5"/>',
    '데이터 · AI': '<path d="M4 20V11M10 20V4M16 20v-8M21 20v-5"/>',
    '보안': '<path d="M12 3 5 6v5c0 5 3 8.5 7 10 4-1.5 7-5 7-10V6l-7-3Z"/><path d="M9 12l2 2 4-4.5"/>'
  }

  // 카테고리 타일용 연한 배경/테두리 톤 (categoryColorMap을 14%/30% 비율로 흰색과 혼합)
  const categoryTintMap = {
    '백엔드 개발': '#DEE3E8',
    '프론트엔드 개발': '#E0E9F0',
    'DevOps · 인프라': '#E2ECEA',
    '데이터 · AI': '#E8E6F0',
    '보안': '#EFE5E4'
  }
  const categoryTintBorderMap = {
    '백엔드 개발': '#B8C2CE',
    '프론트엔드 개발': '#BCCFDE',
    'DevOps · 인프라': '#C1D7D1',
    '데이터 · AI': '#CEC9DE',
    '보안': '#DDC8C4'
  }

  function normalizeCategory(category) {
    if (!category) return ''
    return categoryLabelMap[category] || category
  }

  function normalizeCourse(course) {
    if (!course || typeof course !== 'object') return course
    return {
      ...course,
      category: normalizeCategory(course.category)
    }
  }

  async function fetchCourses() {
    loading.value = true
    error.value = null
    try {
      const res = await courseApi.getAll()
      const rawCourses = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
          ? res.data
          : []
      courses.value = rawCourses.map(normalizeCourse)
    } catch (e) {
      console.error('[CourseStore] fetchCourses failed:', e)
      error.value = e.message || '강의 목록을 불러오지 못했습니다.'
      courses.value = []
    } finally {
      loading.value = false
    }
  }

  function setCategory(cat) {
    selectedCategory.value = cat
  }

  // 검색창은 헤더 쪽 컴포넌트에서 입력받아 이 값을 쓰는 걸 가정 (메인페이지는 결과만 필터링)
  function setSearchQuery(q) {
    searchQuery.value = q
  }

  // 실제 enrollmentCount 기준 상위 4개 (수강생 많은 순) — 가짜 평점/추천 로직 아님, 있는 데이터 그대로 정렬
  const popularCourses = computed(() => {
    return [...courses.value]
      .sort((a, b) => (b.enrollmentCount ?? 0) - (a.enrollmentCount ?? 0))
      .slice(0, 4)
  })

  // 카테고리별 실제 과정 수 (불러온 courses를 직접 집계 — 가짜 통계 아님)
  const categoryCounts = computed(() => {
    const counts = {}
    for (const course of courses.value) {
      if (!course?.category) continue
      counts[course.category] = (counts[course.category] || 0) + 1
    }
    return counts
  })

  // 전체 강의 수 (하단 통계 바용 — 가짜 숫자 아님, 불러온 courses 길이 그대로)
  const totalCourses = computed(() => courses.value.length)

  // 누적 수강 신청 수 (하단 통계 바용 — 각 강의 enrollmentCount 합계)
  const totalEnrollments = computed(() =>
    courses.value.reduce((sum, c) => sum + (c.enrollmentCount ?? 0), 0)
  )

  return {
    courses,
    loading,
    error,
    categories,
    selectedCategory,
    searchQuery,
    categoryLabelMap,
    categoryColorMap,
    categoryIconPathMap,
    categoryTintMap,
    categoryTintBorderMap,
    normalizeCategory,
    normalizeCourse,
    fetchCourses,
    setCategory,
    setSearchQuery,
    popularCourses,
    categoryCounts,
    totalCourses,
    totalEnrollments
  }
})
