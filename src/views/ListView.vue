<script setup>
import { ref, computed, watch } from 'vue';
import { ElSelect, ElOption, ElButton, ElOptionGroup, ElCascader } from 'element-plus';
import { useMediaQuery } from '@vueuse/core';
import characterList from "../components/CharacterList.json";
import characterInfo from "../components/CharacterInfo.json";

const language = ref(navigator.language.startsWith('zh') ? 'zh' : 'en');
const isMobile = useMediaQuery('(max-width: 767px)');
const filterSelection = ref([]);
const selectedCharacter = ref('');

function changepage() {
  window.location.href = import.meta.env.BASE_URL + selectedCharacter.value;
}

const translations = {
  zh: {
    filterPlaceholder: "筛选",
    characterPlaceholder: "选择角色",
    viewButton: "查看",
    characterGroupLabel: "角色",
    enemyGroupLabel: "敌人",
  },
  en: {
    filterPlaceholder: "Filter",
    characterPlaceholder: "Select Character",
    viewButton: "View",
    characterGroupLabel: "Characters",
    enemyGroupLabel: "Enemies",
  }
};

const t = computed(() => translations[language.value]);

const tags = {
  "元素": {
    "GCG_TAG_ELEMENT_CRYO": "冰元素",
    "GCG_TAG_ELEMENT_HYDRO": "水元素",
    "GCG_TAG_ELEMENT_PYRO": "火元素",
    "GCG_TAG_ELEMENT_ELECTRO": "雷元素",
    "GCG_TAG_ELEMENT_ANEMO": "风元素",
    "GCG_TAG_ELEMENT_GEO": "岩元素",
    "GCG_TAG_ELEMENT_DENDRO": "草元素"
  },
  "武器": {
    "GCG_TAG_WEAPON_SWORD": "单手剑",
    "GCG_TAG_WEAPON_CLAYMORE": "双手剑",
    "GCG_TAG_WEAPON_POLE": "长柄武器",
    "GCG_TAG_WEAPON_BOW": "弓",
    "GCG_TAG_WEAPON_CATALYST": "法器"
  },
  "所属": {
    "GCG_TAG_NATION_MONDSTADT": "蒙德",
    "GCG_TAG_NATION_LIYUE": "璃月",
    "GCG_TAG_NATION_INAZUMA": "稻妻",
    "GCG_TAG_NATION_SUMERU": "须弥",
    "GCG_TAG_NATION_FONTAINE": "枫丹",
    "GCG_TAG_NATION_NATLAN": "纳塔",
    "GCG_TAG_NATION_SNEZHNAYA": "至冬",
    "GCG_TAG_NATION_KHAENRIAH": "坎瑞亚",
    "GCG_TAG_CAMP_FATUI": "愚人众",
    "GCG_TAG_CAMP_HILICHURL": "丘丘人",
    "GCG_TAG_CAMP_MONSTER": "魔物",
    "GCG_TAG_CAMP_EREMITE": "镀金旅团",
    "GCG_TAG_CAMP_SACREAD": "圣骸兽",
    "GCG_TAG_CAMP_KAIRAGI": "海乱鬼",
    "TAG_其他所属": "其他所属"
  }
};

const tagsEn = {
  "Element": {
    "GCG_TAG_ELEMENT_CRYO": "Cryo",
    "GCG_TAG_ELEMENT_HYDRO": "Hydro",
    "GCG_TAG_ELEMENT_PYRO": "Pyro",
    "GCG_TAG_ELEMENT_ELECTRO": "Electro",
    "GCG_TAG_ELEMENT_ANEMO": "Anemo",
    "GCG_TAG_ELEMENT_GEO": "Geo",
    "GCG_TAG_ELEMENT_DENDRO": "Dendro"
  },
  "Weapon": {
    "GCG_TAG_WEAPON_SWORD": "Sword",
    "GCG_TAG_WEAPON_CLAYMORE": "Claymore",
    "GCG_TAG_WEAPON_POLE": "Polearm",
    "GCG_TAG_WEAPON_BOW": "Bow",
    "GCG_TAG_WEAPON_CATALYST": "Catalyst"
  },
  "Affiliation": {
    "GCG_TAG_NATION_MONDSTADT": "Mondstadt",
    "GCG_TAG_NATION_LIYUE": "Liyue",
    "GCG_TAG_NATION_INAZUMA": "Inazuma",
    "GCG_TAG_NATION_SUMERU": "Sumeru",
    "GCG_TAG_NATION_FONTAINE": "Fontaine",
    "GCG_TAG_NATION_NATLAN": "Natlan",
    "GCG_TAG_NATION_SNEZHNAYA": "Snezhnaya",
    "GCG_TAG_NATION_KHAENRIAH": "Khaenri'ah",
    "GCG_TAG_CAMP_FATUI": "Fatui",
    "GCG_TAG_CAMP_HILICHURL": "Hilichurl",
    "GCG_TAG_CAMP_MONSTER": "Monster",
    "GCG_TAG_CAMP_EREMITE": "The Eremites",
    "GCG_TAG_CAMP_SACREAD": "Consecrated Beast",
    "GCG_TAG_CAMP_KAIRAGI": "Kairagi",
    "TAG_其他所属": "Other Affiliations" }
};

const currentTags = computed(() => language.value === 'en' ? tagsEn : tags);

const caseInsensitiveKeyMap = Object.keys(characterList).reduce((acc, originalKey) => {
  acc[originalKey.toLowerCase()] = originalKey;
  return acc;
}, {});

const processedKeys = new Set();

const knownCharacters = characterInfo
  .flatMap(charInfo => {
    const generatedCharacters = [];
    const baseKey = charInfo.cardFace.replace("UI_Gcg_CardFace_Char_", "");
    let displayName;
    if (language.value === 'en') {
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
    const lowerKey02 = (baseKey + '02').toLowerCase();
    if (caseInsensitiveKeyMap.hasOwnProperty(lowerKey02)) {
      const originalKey02 = caseInsensitiveKeyMap[lowerKey02];
      processedKeys.add(originalKey02);
      generatedCharacters.push({
        ...charInfo,
        name: displayName + '02',
        listKey: originalKey02,
      });
    }
    return generatedCharacters;
  })
  .sort((a, b) => a.id - b.id);

const otherCharacters = Object.keys(characterList)
  .filter(key => !processedKeys.has(key))
  .map(key => ({
    id: Infinity,
    name: key.replace('Avatar_', '').replace('Monster_', ''),
    tags: ["GCG_TAG_WEAPON_NONE"],
    listKey: key,
  }));

const allCharacters = [...knownCharacters, ...otherCharacters];

allCharacters.forEach(char => {
  const hasAffiliation = char.tags.some(
    tag => tag.startsWith('GCG_TAG_NATION_') || tag.startsWith('GCG_TAG_CAMP_')
  );
  if (!hasAffiliation) {
    char.tags.push('TAG_其他所属');
  }
});

const allAvailableTags = new Set(allCharacters.flatMap(char => char.tags));

const cascaderOptions = computed(() => {
  return Object.entries(currentTags.value)
    .map(([groupName, options]) => {
      const availableChildren = Object.entries(options)
        .filter(([value, label]) => allAvailableTags.has(value))
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
  return filterSelection.value.map(path => path[path.length - 1]);
});

const filteredCharacters = computed(() => {
  if (activeFilterTags.value.length === 0) {
    return allCharacters;
  }
  const groupKeys = Object.keys(currentTags.value);
  const groupedFilters = {
    [groupKeys[0]]: [],
    [groupKeys[1]]: [],
    [groupKeys[2]]: [],
  };
  activeFilterTags.value.forEach(tag => {
    if (currentTags.value[groupKeys[0]][tag]) groupedFilters[groupKeys[0]].push(tag);
    else if (currentTags.value[groupKeys[1]][tag]) groupedFilters[groupKeys[1]].push(tag);
    else if (currentTags.value[groupKeys[2]][tag]) groupedFilters[groupKeys[2]].push(tag);
  });
  const isAffiliationSelected = groupedFilters[groupKeys[2]].length > 0;
  return allCharacters.filter(char => {
    return Object.entries(groupedFilters).every(([groupName, selectedTagsInGroup]) => {
      if (selectedTagsInGroup.length === 0) return true;
      if (groupName === groupKeys[1] && isAffiliationSelected && char.tags.includes('GCG_TAG_WEAPON_NONE')) return true;
      return selectedTagsInGroup.some(tag => char.tags.includes(tag));
    });
  });
});

const groupedFilteredCharacters = computed(() => {
  const groups = {
    [t.value.characterGroupLabel]: [],
    [t.value.enemyGroupLabel]: [],
  };
  for (const char of filteredCharacters.value) {
    if (char.listKey.startsWith('Avatar_')) {
      groups[t.value.characterGroupLabel].push(char);
    } else if (char.listKey.startsWith('Monster_')) {
      groups[t.value.enemyGroupLabel].push(char);
    }
  }
  if (groups[t.value.characterGroupLabel].length === 0) delete groups[t.value.characterGroupLabel];
  if (groups[t.value.enemyGroupLabel].length === 0) delete groups[t.value.enemyGroupLabel];
  return groups;
});

watch(filteredCharacters, (newCharacterList) => {
  if (selectedCharacter.value && !newCharacterList.find(char => char.listKey === selectedCharacter.value)) {
    selectedCharacter.value = '';
  }
});
</script>

<template>
  <div id="container">
    <div id="cards">
      <el-cascader
        v-model="filterSelection"
        :options="cascaderOptions"
        :props="{multiple: true}"
        :placeholder="t.filterPlaceholder"
        clearable
        :collapse-tags="isMobile"
        :collapse-tags-tooltip="isMobile"
        size="large"
        :show-all-levels="false"
        style="width: 240px;"
      />

      &nbsp;&nbsp;

      <el-select 
        v-model="selectedCharacter" 
        :placeholder="t.characterPlaceholder"
        clearable 
        :filterable="!isMobile"
        size="large" 
        style="width: 240px;"
      >
        <el-option-group
          v-for="(characterGroup, groupName) in groupedFilteredCharacters"
          :key="groupName"
          :label="groupName"
        >
          <el-option 
            v-for="char in characterGroup" 
            :key="char.listKey"
            :label="char.name" 
            :value="char.listKey" 
          />
        </el-option-group>
      </el-select>

      &nbsp;&nbsp;
      
      <el-button 
        type="primary" 
        size="large" 
        :disabled="selectedCharacter === ''" 
        @click="changepage"
      >
        {{ t.viewButton }}
      </el-button>
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
  touch-action: manipulation;
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
  height: 0%;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

@media (max-width: 767px) {
  #cards {
    flex-direction: column;
  }
}
</style>
