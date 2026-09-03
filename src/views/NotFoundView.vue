<template>
  <main class="route-page not-found">
    <section class="panel">
      <p class="route-page__eyebrow">404 · NOT FOUND</p>
      <h1>페이지를 찾을 수 없습니다.</h1>
      <p>주소가 변경되었거나 존재하지 않는 페이지입니다.</p>
      <router-link :to="{ name: 'Main' }" class="primary-button">홈으로 돌아가기</router-link>
    </section>
  </main>
</template>

<style scoped>
.not-found {
  display: grid;
  place-items: center;
}
.not-found section {
  width: min(100%, 600px);
  padding: 48px;
  text-align: center;
}
h1 {
  margin: 0;
  font-size: 32px;
}
h1 + p {
  margin: 14px 0 26px;
  color: var(--muted);
}
</style>
