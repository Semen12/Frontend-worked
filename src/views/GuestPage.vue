<template>
  <div class="guest-page">
    <h1>Добро пожаловать!</h1>
    <div class="guest-page__buttons">
      <router-link :to="'/login'" class="guest-page__button">Войти</router-link>
      <router-link :to="'/register'" class="guest-page__button">Зарегистрироваться</router-link>
    </div>
  </div>
</template>

<script setup>
// в скрипте нет необходимости
</script>

<style lang="scss" scoped>
.guest-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background-color: #f9f9f9;
  overflow: hidden;

  h1 {
    font-size: 2em;
    margin-bottom: 20px;
    text-align: center;
    color: #333;
  }

  &__buttons {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    justify-content: center;
  }

  &__button {
    padding: 10px 20px;
    font-size: 1.2em;
    text-decoration: none;
    color: white;
    background-color: #42b983;
    border-radius: 5px;
    transition: background-color 0.3s;

    &:hover {
      background-color: #369870;
    }
  }
}

@media (max-width: 768px) {
  .guest-page {
    padding: 20px;
    h1 {
      font-size: 1.5em;
    }

    &__button {
      font-size: 1em;
      padding: 8px 16px;
    }
  }
}

@media (max-width: 480px) {
  .guest-page {
    h1 {
      font-size: 1.5em;
    }

    &__button {
      font-size: 1em;
      padding: 6px 12px;
    }
  }
}
</style>

