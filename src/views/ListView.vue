<script setup>
import { ref } from 'vue';
import { ElSelect, ElOption, ElButton } from 'element-plus';
import characterList from "../components/CharacterList"

const value = ref('')
function changepage() {
  window.location.href = import.meta.env.BASE_URL + value.value;
}
</script>

<template>
  <div id="container">
    <div id="cards">
      <el-select v-model="value" placeholder="选择角色" clearable size="large" style="width: 200px;">
        <el-option v-for="item in Object.getOwnPropertyNames(characterList).sort()" :key="item"
          :label="item.replace('Avatar_', '').replace('Monster_', '')" :value="item" />
      </el-select>
      &nbsp&nbsp&nbsp&nbsp&nbsp
      <el-button type="primary" size="large" :disabled="value == ''" @click="changepage">查看</el-button>
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
  height: 100%;
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
