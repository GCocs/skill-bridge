<script setup>
defineProps({
  user: {
    type: Object,
    default: null,
  },
})

const scrollToProfile = () => {
  document.querySelector('#profile')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <header class="site-header">
    <div class="header-inner">
      <a class="brand" href="/" aria-label="Skill Bridge 홈">
        <img src="/skill-bridge-logo.png" alt="" />
        <span class="brand-name">Skill Bridge</span>
      </a>

      <div class="header-side">
        <span class="page-label">MY PAGE</span>
        <span class="header-divider" aria-hidden="true"></span>
        <button v-if="user" class="profile-shortcut" type="button" @click="scrollToProfile">
          <span class="header-avatar" aria-hidden="true">{{ user.name.slice(0, 1) }}</span>
          <span>{{ user.name }}</span>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  z-index: 20;
  top: 0;
  border-bottom: 1px solid color-mix(in srgb, var(--line) 78%, transparent);
  background: color-mix(in srgb, var(--paper) 92%, transparent);
  backdrop-filter: blur(18px);
}

.header-inner {
  display: flex;
  width: min(1180px, calc(100% - 48px));
  height: 76px;
  margin: 0 auto;
  align-items: center;
  justify-content: space-between;
}

.brand {
  display: inline-flex;
  align-items: center;
  color: var(--navy-900);
  gap: 10px;
  text-decoration: none;
}

.brand img {
  width: 34px;
  height: 34px;
}

.brand-name {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.025em;
}

.header-side,
.profile-shortcut {
  display: flex;
  align-items: center;
}

.header-side {
  gap: 18px;
}

.page-label {
  color: var(--muted);
  font-family: var(--f-mono);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.15em;
}

.header-divider {
  width: 1px;
  height: 18px;
  background: var(--line);
}

.profile-shortcut {
  padding: 0;
  border: 0;
  background: none;
  color: var(--text);
  cursor: pointer;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  gap: 9px;
}

.header-avatar {
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  border-radius: 50%;
  background: var(--navy-900);
  color: white;
  font-size: 12px;
}

@media (max-width: 640px) {
  .header-inner {
    width: min(100% - 32px, 1180px);
    height: 66px;
  }

  .page-label,
  .header-divider,
  .profile-shortcut > span:last-child {
    display: none;
  }

  .brand-name {
    font-size: 16px;
  }
}
</style>
