<script setup>
import { computed } from 'vue'

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
  wide: {
    type: Boolean,
    default: false,
  },
})

const roleLabel = computed(() => (props.user.role === 'STUDENT' ? '수강생' : '강사'))
const roleDescription = computed(() =>
  props.user.role === 'STUDENT' ? 'SkillBridge 수강생 계정' : 'SkillBridge 강사 계정',
)
const initials = computed(() => props.user.name.slice(0, 2))
const joinedAt = computed(() =>
  new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }).format(
    new Date(props.user.createdAt),
  ),
)
</script>

<template>
  <section
    id="profile"
    class="info-card"
    :class="{ 'info-card--wide': wide }"
    aria-labelledby="profile-title"
  >
    <div class="card-heading">
      <div>
        <p class="section-label">계정 정보</p>
        <h2 id="profile-title">내 정보</h2>
      </div>
      <span class="role-pill">{{ roleLabel }}</span>
    </div>

    <div class="profile-core">
      <div class="avatar" aria-hidden="true">
        <span>{{ initials }}</span>
        <i></i>
      </div>
      <div>
        <h3>{{ user.name }}</h3>
        <p>{{ roleDescription }}</p>
      </div>
    </div>

    <dl class="info-list">
      <div class="info-row">
        <dt>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 6.5h16v11H4zM4.5 7l7.5 6 7.5-6" />
          </svg>
          이메일
        </dt>
        <dd>{{ user.email }}</dd>
      </div>
      <div class="info-row">
        <dt>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="8" />
            <path d="M9.7 9.5a2.3 2.3 0 1 1 2.3 2.3v1.5M12 16.8v.1" />
          </svg>
          계정 ID
        </dt>
        <dd class="mono">SB-{{ String(user.id).padStart(5, '0') }}</dd>
      </div>
      <div class="info-row">
        <dt>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z" />
          </svg>
          가입일
        </dt>
        <dd>{{ joinedAt }}</dd>
      </div>
    </dl>

    <div v-if="wide" class="instructor-note">
      <p class="section-label">강의 제작 TIP</p>
      <strong>수강생이 얻게 될 변화를 먼저 알려주세요.</strong>
      <span>학습 목표와 대상 수강생을 구체적으로 적으면 강의를 더 쉽게 이해할 수 있어요.</span>
    </div>
  </section>
</template>

<style scoped>
.info-card {
  align-self: start;
  padding: 28px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--surface);
  box-shadow: var(--shadow);
}

.card-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.section-label {
  margin: 0 0 5px;
  color: var(--navy-500);
  font-size: 11px;
  font-weight: 700;
}

h2 {
  margin: 0;
  font-size: 23px;
  line-height: 1.25;
  letter-spacing: -0.025em;
}

.role-pill {
  padding: 5px 10px;
  border-radius: 999px;
  background: var(--teal-soft);
  color: var(--teal-dark);
  font-size: 12px;
  font-weight: 700;
}

.profile-core {
  display: flex;
  margin: 34px 0 30px;
  align-items: center;
  gap: 16px;
}

.avatar {
  position: relative;
  display: grid;
  width: 72px;
  height: 72px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--navy-700), var(--navy-500));
  color: white;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.04em;
  box-shadow: 0 7px 18px rgba(17, 52, 90, 0.2);
}

.avatar i {
  position: absolute;
  right: -4px;
  bottom: -4px;
  width: 14px;
  height: 14px;
  border: 3px solid white;
  border-radius: 50%;
  background: var(--teal);
}

.profile-core h3 {
  margin: 0 0 4px;
  font-size: 21px;
  letter-spacing: -0.025em;
}

.profile-core p {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
}

.info-list {
  margin: 0;
  border-top: 1px solid var(--line);
}

.info-row {
  padding: 16px 0;
  border-bottom: 1px solid var(--line);
}

.info-row:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

dt {
  display: flex;
  margin-bottom: 6px;
  align-items: center;
  color: var(--muted);
  font-size: 12px;
  gap: 7px;
}

dt svg {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.6;
}

dd {
  margin: 0;
  overflow-wrap: anywhere;
  font-size: 14px;
  font-weight: 600;
}

.mono {
  font-family: var(--f-mono);
  font-size: 12px;
  letter-spacing: 0.035em;
}

.info-card--wide {
  display: grid;
  grid-template-columns: minmax(250px, 0.8fr) minmax(320px, 1.25fr);
  max-width: 920px;
  min-height: 310px;
  margin: 0 auto;
  padding: 38px;
  gap: 0 56px;
}

.info-card--wide .card-heading {
  grid-column: 1 / -1;
}

.info-card--wide .profile-core {
  margin: 32px 0 0;
}

.info-card--wide .info-list {
  margin-top: 32px;
}

.info-card--wide .instructor-note {
  grid-column: 1 / -1;
  margin: 34px -38px -38px;
  padding: 24px 38px;
  border-radius: 0 0 15px 15px;
  background: linear-gradient(120deg, var(--navy-900), var(--navy-500));
  color: white;
}

.instructor-note .section-label {
  color: var(--teal);
}

.instructor-note strong,
.instructor-note span {
  display: block;
}

.instructor-note strong {
  font-size: 15px;
}

.instructor-note span {
  margin-top: 4px;
  color: var(--navy-100);
  font-size: 12px;
}

@media (max-width: 740px) {
  .info-card--wide {
    display: block;
    padding: 28px;
  }

  .info-card--wide .instructor-note {
    margin: 30px -28px -28px;
    padding: 22px 28px;
  }
}

@media (max-width: 480px) {
  .info-card,
  .info-card--wide {
    padding: 23px;
  }

  .info-card--wide .instructor-note {
    margin: 26px -23px -23px;
    padding: 21px 23px;
  }
}
</style>
