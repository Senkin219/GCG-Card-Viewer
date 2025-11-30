<template>
  <div id="container">
    <div id="cards">
      <Card :character-name="$route.params.name" />
    </div>
    <el-alert type="info" :closable="false" style="max-width: 730px; position: absolute; top: 5%" v-if="showTip">
      <span>{{ t.tip1 }}</span>
      <span @click="handleClickTip" style="color: #409eff; cursor: pointer; font-weight: bold"> {{ t.tip2 }} </span>
      <span>{{ t.tip3 }}</span>
    </el-alert>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, h } from "vue";
import { useRouter } from "vue-router";
import { ElAlert, ElMessageBox } from "element-plus";
import Card from "@/components/Card.vue";
import propertiesImage from "@/assets/web_properties.jpg";

const router = useRouter();
const language = ref(navigator.language.startsWith("zh") ? "zh" : "en");
const showTip = ref(isWE() && window.WEconfigs.showtip && window.WEconfigs.skiplistpage);
let wallpaperPropertyListener;

const translations = {
  zh: {
    tip1: "下次启动壁纸时将自动加载本次选择的角色，如需切换其它角色，可在",
    tip2: "壁纸属性",
    tip3: "内取消勾选「跳过角色选择」。",
  },
  en: {
    tip1: "The selected character will be automatically loaded next time. To switch characters, go to ",
    tip2: "Wallpaper Properties",
    tip3: ' and uncheck "Skip Character Selection".',
  },
};

const t = computed(() => translations[language.value]);

const handleClickTip = () => {
  ElMessageBox({
    message: h("img", {
      src: propertiesImage,
      style: { width: "auto", height: "75vh", borderRadius: "4px", objectFit: "contain", display: "block" },
    }),
    center: true,
    showConfirmButton: false,
    customStyle: { maxWidth: "fit-content" },
  })
    .then(() => {})
    .catch(() => {});
};

onMounted(() => {
  wallpaperPropertyListener = window.wallpaperPropertyListener;
  window.wallpaperPropertyListener = {
    applyGeneralProperties: function (properties) {
      if (properties.fps) window.WEconfigs.fps = properties.fps;
      if (properties.language) {
        window.WEconfigs.language = properties.language;
        if (window.WEconfigs.language) language.value = window.WEconfigs.language.startsWith("zh") ? "zh" : "en";
      }
    },
    applyUserProperties: function (properties) {
      if (properties.showtip) {
        window.WEconfigs.showtip = properties.showtip.value;
      }
      if (properties.skiplistpage) {
        window.WEconfigs.skiplistpage = properties.skiplistpage.value;
        if (!window.WEconfigs.skiplistpage) {
          router.back();
        }
      }
      showTip.value = window.WEconfigs.showtip && window.WEconfigs.skiplistpage;
    },
  };
  showTip.value = isWE() && window.WEconfigs.showtip && window.WEconfigs.skiplistpage;
  if (isWE() && window.WEconfigs.language) language.value = window.WEconfigs.language.startsWith("zh") ? "zh" : "en";
  function watchWindowSize() {
    let cards = document.getElementById("cards");
    let windowheight = document.documentElement.clientHeight;
    let container = document.getElementById("container");
    let scale = 1;
    if (cards.offsetHeight == 0) {
      setTimeout(watchWindowSize, 100);
      return;
    }
    scale = (0.7 * windowheight) / cards.offsetHeight;
    container.style.transform = "rotate(0deg)";
    container.style.height = "100vh";
    container.style.width = "100vw";
    cards.style.transform = `scale(${scale})`;
  }
  window.addEventListener("resize", watchWindowSize);
  watchWindowSize();
});

onUnmounted(() => {
  window.wallpaperPropertyListener = wallpaperPropertyListener;
});
</script>

<style scoped>
#container {
  background-image: url(../assets/background.png);
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  transform-origin: center;
  overflow: hidden;
}

#cards {
  height: 806px;
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
