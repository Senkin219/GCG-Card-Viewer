<script setup>
import { onMounted } from 'vue';
import Card from '../components/Card.vue';

onMounted(() => {
  function watchWindowSize() {
    let cards = document.getElementById("cards");
    let windowheight = document.documentElement.clientHeight;
    let container = document.getElementById("container");
    let scale = 1;
    scale = 0.7 * windowheight / cards.offsetHeight;
    container.style.transform = "rotate(0deg)";
    container.style.height = "100vh";
    container.style.width = "100vw";
    cards.style.transform = `scale(${scale})`;
  }
  window.addEventListener("resize", watchWindowSize);
  watchWindowSize();
})
</script>

<template>
  <div id="container">
    <div id="cards">
      <Card :character-name="$route.params.name" />
    </div>
  </div>
</template>

<style scoped>
body {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

#container {
  background-image: url(../assets/background.jpg);
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  transform-origin: center;
}

#cards {
  height: 806px;
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
