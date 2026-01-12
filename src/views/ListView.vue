<template>
  <div id="container">
    <div id="cards">
      <el-cascader
        v-model="filterSelection"
        popper-class="character-popper"
        :options="cascaderOptions"
        :props="{ multiple: true }"
        :placeholder="t.filterPlaceholder"
        :collapse-tags="isMobile"
        :collapse-tags-tooltip="isMobile"
        size="large"
        :show-all-levels="false"
        style="width: 240px"
      />
      <el-select v-model="selectedCharacter" popper-class="character-popper" :placeholder="t.characterPlaceholder" clearable size="large" style="width: 240px">
        <el-option-group v-for="(characterGroup, groupName) in groupedFilteredCharacters" :key="groupName" :label="groupName">
          <el-option v-for="char in characterGroup" :key="char.listKey" :label="char.name" :value="char.listKey" />
        </el-option-group>
      </el-select>
      <el-button
        type="primary"
        size="large"
        :disabled="filteredCharacters.length === 0"
        @click="handleButtonClick"
        :style="language === 'en' ? 'width: 120px;' : 'width: 100px;'"
      >
        {{ selectedCharacter ? t.viewButton : t.randomButton }}
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { ElSelect, ElOption, ElButton, ElOptionGroup, ElCascader } from "element-plus";
import { useMediaQuery } from "@vueuse/core";
import characterList from "@/data/CharacterList.json";
import characterInfo from "@/data/CharacterInfo.json";

const router = useRouter();
const language = ref(navigator.language.startsWith("zh") ? "zh" : "en");
const isMobile = useMediaQuery("(max-width: 767px)");
const filterSelection = ref([]);
const selectedCharacter = ref("");
let wallpaperPropertyListener;

function changepage() {
  router.push("/" + selectedCharacter.value);
}

function loadLastCharacter() {
  if (isWE() && window.WEconfigs.skiplistpage) {
    const lastCharacter = localStorage.getItem("GITCG_Character") || "";
    if (lastCharacter in characterList) {
      selectedCharacter.value = lastCharacter;
      changepage();
    }
  }
}

function handleButtonClick() {
  if (selectedCharacter.value) {
    if (isWE()) localStorage.setItem("GITCG_Character", selectedCharacter.value);
    changepage();
  } else {
    const characters = filteredCharacters.value;
    if (characters.length > 0) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      selectedCharacter.value = characters[randomIndex].listKey;
    }
  }
}

const translations = {
  zh: {
    filterPlaceholder: "筛选",
    characterPlaceholder: "选择角色",
    viewButton: "查看",
    randomButton: "随机选择",
    characterGroupLabel: "角色",
    enemyGroupLabel: "敌人与魔物",
  },
  en: {
    filterPlaceholder: "Filter",
    characterPlaceholder: "Select Character",
    viewButton: "View",
    randomButton: "Random Select",
    characterGroupLabel: "Characters",
    enemyGroupLabel: "Enemies and Monsters",
  },
};

const t = computed(() => translations[language.value]);

const tags = {
  元素: {
    GCG_TAG_ELEMENT_CRYO: "冰元素",
    GCG_TAG_ELEMENT_HYDRO: "水元素",
    GCG_TAG_ELEMENT_PYRO: "火元素",
    GCG_TAG_ELEMENT_ELECTRO: "雷元素",
    GCG_TAG_ELEMENT_ANEMO: "风元素",
    GCG_TAG_ELEMENT_GEO: "岩元素",
    GCG_TAG_ELEMENT_DENDRO: "草元素",
  },
  武器: {
    GCG_TAG_WEAPON_SWORD: "单手剑",
    GCG_TAG_WEAPON_CLAYMORE: "双手剑",
    GCG_TAG_WEAPON_POLE: "长柄武器",
    GCG_TAG_WEAPON_BOW: "弓",
    GCG_TAG_WEAPON_CATALYST: "法器",
  },
  所属: {
    GCG_TAG_NATION_SIMULANKA: "希穆兰卡",
    GCG_TAG_NATION_MONDSTADT: "蒙德",
    GCG_TAG_NATION_LIYUE: "璃月",
    GCG_TAG_NATION_INAZUMA: "稻妻",
    GCG_TAG_NATION_SUMERU: "须弥",
    GCG_TAG_NATION_FONTAINE: "枫丹",
    GCG_TAG_NATION_NATLAN: "纳塔",
    GCG_TAG_NATION_SNEZHNAYA: "至冬",
    GCG_TAG_NATION_KHAENRIAH: "坎瑞亚",
    GCG_TAG_NATION_COSMIC_CALAMITY: "寰宇劫灭",
    GCG_TAG_CAMP_FATUI: "愚人众",
    GCG_TAG_CAMP_HILICHURL: "丘丘人",
    GCG_TAG_CAMP_MONSTER: "魔物",
    GCG_TAG_CAMP_EREMITE: "镀金旅团",
    GCG_TAG_CAMP_SACREAD: "圣骸兽",
    GCG_TAG_CAMP_KAIRAGI: "海乱鬼",
    TAG_其他所属: "其他所属",
  },
  萝莉: {
    TAG_LOLI: "萝莉",
  },
};

const tagsEn = {
  Element: {
    GCG_TAG_ELEMENT_CRYO: "Cryo",
    GCG_TAG_ELEMENT_HYDRO: "Hydro",
    GCG_TAG_ELEMENT_PYRO: "Pyro",
    GCG_TAG_ELEMENT_ELECTRO: "Electro",
    GCG_TAG_ELEMENT_ANEMO: "Anemo",
    GCG_TAG_ELEMENT_GEO: "Geo",
    GCG_TAG_ELEMENT_DENDRO: "Dendro",
  },
  Weapon: {
    GCG_TAG_WEAPON_SWORD: "Sword",
    GCG_TAG_WEAPON_CLAYMORE: "Claymore",
    GCG_TAG_WEAPON_POLE: "Polearm",
    GCG_TAG_WEAPON_BOW: "Bow",
    GCG_TAG_WEAPON_CATALYST: "Catalyst",
  },
  Affiliation: {
    GCG_TAG_NATION_SIMULANKA: "Simulanka",
    GCG_TAG_NATION_MONDSTADT: "Mondstadt",
    GCG_TAG_NATION_LIYUE: "Liyue",
    GCG_TAG_NATION_INAZUMA: "Inazuma",
    GCG_TAG_NATION_SUMERU: "Sumeru",
    GCG_TAG_NATION_FONTAINE: "Fontaine",
    GCG_TAG_NATION_NATLAN: "Natlan",
    GCG_TAG_NATION_SNEZHNAYA: "Snezhnaya",
    GCG_TAG_NATION_KHAENRIAH: "Khaenri'ah",
    GCG_TAG_NATION_COSMIC_CALAMITY: "Cosmic Calamity",
    GCG_TAG_CAMP_FATUI: "Fatui",
    GCG_TAG_CAMP_HILICHURL: "Hilichurl",
    GCG_TAG_CAMP_MONSTER: "Monster",
    GCG_TAG_CAMP_EREMITE: "The Eremites",
    GCG_TAG_CAMP_SACREAD: "Consecrated Beast",
    GCG_TAG_CAMP_KAIRAGI: "Kairagi",
    TAG_其他所属: "Other Affiliations",
  },
  Loli: {
    TAG_LOLI: "Loli",
  },
};

const currentTags = computed(() => (language.value === "en" ? tagsEn : tags));

const caseInsensitiveKeyMap = Object.keys(characterList).reduce((acc, originalKey) => {
  acc[originalKey.toLowerCase()] = originalKey;
  return acc;
}, {});

const allCharacters = computed(() => {
  const processedKeys = new Set();

  const knownCharacters = characterInfo
    .flatMap((charInfo) => {
      if (charInfo.id === 6605) return [];
      const generatedCharacters = [];
      const baseKey = charInfo.cardFace.replace("UI_Gcg_CardFace_Char_", "");
      let displayName;
      if (language.value === "en") {
        displayName = charInfo.englishName;
        if (charInfo.cardFace === "UI_Gcg_CardFace_Char_Avatar_FurinaOusia") {
          displayName = "Furina (Ousia)";
        }
      } else {
        displayName = charInfo.name;
        if (charInfo.cardFace === "UI_Gcg_CardFace_Char_Avatar_FurinaOusia") {
          displayName = "芙宁娜(芒)";
        }
      }
      const lowerBaseKey = baseKey.toLowerCase();
      if (caseInsensitiveKeyMap.hasOwnProperty(lowerBaseKey)) {
        const originalKey = caseInsensitiveKeyMap[lowerBaseKey];
        processedKeys.add(originalKey);
        generatedCharacters.push({
          ...charInfo,
          name: displayName,
          listKey: originalKey,
        });
      }
      const lowerKey02 = (baseKey + "02").toLowerCase();
      if (caseInsensitiveKeyMap.hasOwnProperty(lowerKey02)) {
        const originalKey02 = caseInsensitiveKeyMap[lowerKey02];
        processedKeys.add(originalKey02);
        generatedCharacters.push({
          ...charInfo,
          name: displayName + "02",
          listKey: originalKey02,
        });
      }
      return generatedCharacters;
    })
    .sort((a, b) => a.id - b.id);

  const otherCharacters = Object.keys(characterList)
    .filter((key) => !processedKeys.has(key))
    .map((key) => ({
      id: Infinity,
      name: key.replace("Avatar_", "").replace("Monster_", ""),
      tags: ["GCG_TAG_WEAPON_NONE"],
      listKey: key,
    }));

  const merged = [...knownCharacters, ...otherCharacters];

  merged.forEach((char) => {
    const hasAffiliation = char.tags.some((tag) => tag.startsWith("GCG_TAG_NATION_") || tag.startsWith("GCG_TAG_CAMP_"));
    if (!hasAffiliation) {
      char.tags.push("TAG_其他所属");
    }
    const loliIds = [1102, 1108, 1213, 1306, 1410, 1414, 1507, 1610, 1703, 1704];
    if (loliIds.includes(char.id)) {
      char.tags.push("TAG_LOLI");
    }
  });
  return merged;
});

const allAvailableTags = computed(() => new Set(allCharacters.value.flatMap((char) => char.tags)));

const cascaderOptions = computed(() => {
  return Object.entries(currentTags.value)
    .map(([groupName, options]) => {
      const availableChildren = Object.entries(options)
        .filter(([value, label]) => allAvailableTags.value.has(value))
        .map(([value, label]) => ({ value, label }));
      if (availableChildren.length > 0) {
        return {
          value: groupName,
          label: groupName,
          children: availableChildren,
        };
      }
      return null;
    })
    .filter(Boolean);
});

const activeFilterTags = computed(() => {
  return filterSelection.value.map((path) => path[path.length - 1]);
});

const filteredCharacters = computed(() => {
  if (activeFilterTags.value.length === 0) {
    return allCharacters.value;
  }
  const groupKeys = Object.keys(currentTags.value);
  const groupedFilters = {
    [groupKeys[0]]: [],
    [groupKeys[1]]: [],
    [groupKeys[2]]: [],
    [groupKeys[3]]: [],
  };
  activeFilterTags.value.forEach((tag) => {
    if (currentTags.value[groupKeys[0]][tag]) groupedFilters[groupKeys[0]].push(tag);
    else if (currentTags.value[groupKeys[1]][tag]) groupedFilters[groupKeys[1]].push(tag);
    else if (currentTags.value[groupKeys[2]][tag]) groupedFilters[groupKeys[2]].push(tag);
    else if (currentTags.value[groupKeys[3]][tag]) groupedFilters[groupKeys[3]].push(tag);
  });
  const isAffiliationSelected = groupedFilters[groupKeys[2]].length > 0;
  return allCharacters.value.filter((char) => {
    return Object.entries(groupedFilters).every(([groupName, selectedTagsInGroup]) => {
      if (selectedTagsInGroup.length === 0) return true;
      if (groupName === groupKeys[1] && isAffiliationSelected && char.tags.includes("GCG_TAG_WEAPON_NONE")) return true;
      return selectedTagsInGroup.some((tag) => char.tags.includes(tag));
    });
  });
});

const groupedFilteredCharacters = computed(() => {
  const groups = {
    [t.value.characterGroupLabel]: [],
    [t.value.enemyGroupLabel]: [],
  };
  for (const char of filteredCharacters.value) {
    if (char.listKey.startsWith("Avatar_")) {
      groups[t.value.characterGroupLabel].push(char);
    } else if (char.listKey.startsWith("Monster_")) {
      groups[t.value.enemyGroupLabel].push(char);
    }
  }
  if (groups[t.value.characterGroupLabel].length === 0) delete groups[t.value.characterGroupLabel];
  if (groups[t.value.enemyGroupLabel].length === 0) delete groups[t.value.enemyGroupLabel];
  return groups;
});

watch(filteredCharacters, (newCharacterList) => {
  if (selectedCharacter.value && !newCharacterList.find((char) => char.listKey === selectedCharacter.value)) {
    selectedCharacter.value = "";
  }
});

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
      if (properties.showtip) window.WEconfigs.showtip = properties.showtip.value;
      if (properties.skiplistpage) {
        window.WEconfigs.skiplistpage = properties.skiplistpage.value;
        loadLastCharacter();
      }
    },
  };
  loadLastCharacter();
  if (isWE() && window.WEconfigs.language) language.value = window.WEconfigs.language.startsWith("zh") ? "zh" : "en";
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
  width: 100%;
  height: 100%;
  transform-origin: center;
  overflow: hidden;
}

#cards {
  height: 0%;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 7px;
}

:global(.character-popper .el-scrollbar__wrap) {
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}

@media (max-width: 767px) {
  #cards {
    flex-direction: column;
    gap: 20px;
  }
}
</style>
