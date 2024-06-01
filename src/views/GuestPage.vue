<template>
  <div class="guest">
    <h1 class="guest__title">Добро пожаловать!</h1>
    <div class="guest__buttons">
      <router-link :to="'/login'" class="guest__button">Войти</router-link>
      <router-link :to="'/register'" class="guest__button">Зарегистрироваться</router-link>
    </div>
  </div>
</template>

<script setup>
// в скрипте нет необходимости
// в скрипте нет необходимости
</script>

<style lang="scss" scoped>
.guest {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100vw;
  background-color: #f9f9f9;
 // padding: 20px;

  &__title {
    font-size: 2em;
    margin-bottom: 20px;
    color: #2c3e50;
    text-align: center;
  }

  &__label {
    margin-bottom: 5px;
    color: #8e8edd;
  }
  &__buttons {
    display: flex;
    flex-direction: row;
    gap: 10px;
  }
  &__button {
    display: inline-flex;
    align-items: center;
    padding: 10px 20px;
    font-size: 1.2em;
    color: white;
    background-color: #42b983;
    border: none;
    border-radius: 5px;
    margin-top: 5px;
    margin-bottom: 10px;
    cursor: pointer;
    &:hover {
      background-color: #369870;
    }
    @media (max-width: 330px) {
        padding: 5px 10px;
    }
  }
}
</style>

