<script setup>
import { onMounted } from 'vue';
import Card from '../components/Card.vue';

onMounted(() => {
  function watchWindowSize() {
    let cards = document.getElementById("cards");
    let windowheight = document.documentElement.clientHeight;
    let windowwidth = document.documentElement.clientWidth;
    let aspectRatio = windowwidth / windowheight;
    let container = document.getElementById("container");
    let scale = 1;
    if (aspectRatio < 1) {
      scale = 0.6 * windowwidth / cards.offsetHeight;
      container.style.transform = "rotate(90deg)";
      container.style.height = "100vw";
      container.style.width = "100vh";
    } else {
      scale = 0.6 * windowheight / cards.offsetHeight;
      container.style.transform = "rotate(0deg)";
      container.style.height = "100vh";
      container.style.width = "100vw";
    }
    cards.style.transform = `scale(${scale})`;
  }
  window.addEventListener("resize", watchWindowSize);
  watchWindowSize();
})
</script>

<template>
  <div id="container">
    <div id="cards">
      <Card character-name="Avatar_Klee" />
      <Card character-name="Avatar_Nahida" />
      <Card character-name="Avatar_Diona" />
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
  background-image: url(../assets/background.png);
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
