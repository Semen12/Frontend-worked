<template>
  <div class="guest-page">
    <h1>Добро пожаловать!</h1>
    <div class="buttons">
      <router-link to="/login" class="button">Войти</router-link>
      <router-link to="/register" class="button">Зарегистрироваться</router-link>
    </div>
  </div>
</template>

<script setup>
// в скирпте нет необходимости
</script>

<style scoped>
.guest-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background-color: #f9f9f9;
  overflow: hidden;
}

h1 {
  font-size: 2em;
  margin-bottom: 20px;
  text-align: center;
  color: #333;
}

.buttons {
  display: flex;
  gap: 20px;
}

.button {
  padding: 10px 20px;
  font-size: 1.2em;
  text-decoration: none;
  color: white;
  background-color: #42b983;
  border-radius: 5px;
}

.button:hover {
  background-color: #369870;
}
</style>
