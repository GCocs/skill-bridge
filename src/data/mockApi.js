const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))

const requestedRole = new URLSearchParams(window.location.search).get('role')?.toUpperCase()
const role = ['STUDENT', 'INSTRUCTOR'].includes(requestedRole)
  ? requestedRole
  : (import.meta.env.VITE_MOCK_USER_ROLE ?? 'STUDENT').toUpperCase()

// GET /users/me와 동일한 ApiResponse<UserResponse> 구조입니다.
export const mockUserResponse = {
  success: true,
  message: '성공',
  data: {
    id: 24,
    email: 'minseo.kim@skillbridge.kr',
    name: '김민서',
    role,
    createdAt: '2025-03-18T09:24:00',
  },
}

// GET /recommend/{userId}와 동일한 RecommendResponse 구조입니다.
export const mockRecommendationResponse = {
  userId: 24,
  recommendedCourses: [
    {
      id: 101,
      title: 'Vue 3로 완성하는 실전 프론트엔드',
      description:
        'Composition API부터 상태 관리까지, 서비스에 바로 적용하는 Vue 개발 흐름을 익혀요.',
      category: 'FRONTEND',
      price: 89000,
      instructorId: 8,
      enrollmentCount: 1284,
      status: 'PUBLISHED',
      createdAt: '2026-07-12T14:00:00',
    },
    {
      id: 102,
      title: '디자인 시스템과 컴포넌트 설계',
      description: '일관되고 확장 가능한 UI를 위한 토큰, 컴포넌트 API, 문서화 전략을 배워요.',
      category: 'FRONTEND',
      price: 76000,
      instructorId: 15,
      enrollmentCount: 968,
      status: 'PUBLISHED',
      createdAt: '2026-06-23T10:30:00',
    },
    {
      id: 103,
      title: 'TypeScript: 안전한 웹 애플리케이션',
      description: '타입 모델링부터 제네릭, API 응답 설계까지 실무 중심으로 탄탄하게 다져요.',
      category: 'FRONTEND',
      price: 69000,
      instructorId: 3,
      enrollmentCount: 1542,
      status: 'PUBLISHED',
      createdAt: '2026-05-02T11:00:00',
    },
    {
      id: 104,
      title: '웹 성능 최적화 마스터 클래스',
      description: 'Core Web Vitals를 기준으로 병목을 찾고 더 빠른 사용자 경험을 설계해요.',
      category: 'FRONTEND',
      price: 82000,
      instructorId: 21,
      enrollmentCount: 731,
      status: 'PUBLISHED',
      createdAt: '2026-04-16T15:45:00',
    },
    {
      id: 105,
      title: 'Node.js로 시작하는 백엔드 첫걸음',
      description: '프론트엔드 개발자를 위한 REST API, 인증, 데이터베이스의 핵심을 담았어요.',
      category: 'BACKEND',
      price: 94000,
      instructorId: 11,
      enrollmentCount: 1106,
      status: 'PUBLISHED',
      createdAt: '2026-03-28T13:20:00',
    },
  ],
  basedOnCategory: 'FRONTEND',
  message: 'FRONTEND 카테고리 기반 추천 강의입니다',
}

export async function getMockCurrentUser() {
  await wait(220)
  return structuredClone(mockUserResponse)
}

export async function getMockRecommendations(userId) {
  await wait(280)
  return {
    ...structuredClone(mockRecommendationResponse),
    userId,
  }
}
