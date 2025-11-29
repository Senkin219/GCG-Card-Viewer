import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import CharacterView from "@/views/CharacterView.vue";
import ListView from "@/views/ListView.vue";
import characterList from "@/data/CharacterList.json";
import characterInfo from "@/data/CharacterInfo.json";

const characterNameMap = (() => {
  const caseInsensitiveKeyMap = Object.keys(characterList).reduce((acc, key) => {
    acc[key.toLowerCase()] = key;
    return acc;
  }, {});
  const nameMap = {};
  characterInfo.forEach((info) => {
    const baseKey = info.cardFace.replace("UI_Gcg_CardFace_Char_", "");
    let zhName = info.name;
    let enName = info.englishName;
    if (info.cardFace === "UI_Gcg_CardFace_Char_Avatar_FurinaOusia") {
      zhName = "芙宁娜(芒)";
      enName = "Furina (Ousia)";
    }
    const lowerBaseKey = baseKey.toLowerCase();
    if (caseInsensitiveKeyMap[lowerBaseKey]) {
      const originalKey = caseInsensitiveKeyMap[lowerBaseKey];
      nameMap[originalKey] = { zh: zhName, en: enName };
    }
    const lowerKey02 = (baseKey + "02").toLowerCase();
    if (caseInsensitiveKeyMap[lowerKey02]) {
      const originalKey02 = caseInsensitiveKeyMap[lowerKey02];
      nameMap[originalKey02] = { zh: `${zhName}02`, en: `${enName}02` };
    }
  });
  return nameMap;
})();

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/lolicon",
      name: "home",
      component: HomeView,
      meta: {
        title: "Lolicon",
      },
    },
    {
      path: "/",
      name: "list",
      component: ListView,
      meta: {
        title: "Card List",
      },
    },
    {
      path: "/:name",
      name: "viewer",
      component: CharacterView,
      beforeEnter: (to, from, next) => {
        if (to.params.name in characterList) next();
        else next(import.meta.env.BASE_URL);
      },
      meta: {
        title: (route) => {
          const charKey = route.params.name;
          const characterNames = characterNameMap[charKey];
          const isChinese = navigator.language.startsWith("zh");
          if (characterNames) {
            return isChinese ? characterNames.zh : characterNames.en;
          }
          return charKey.replace("Avatar_", "").replace("Monster_", "");
        },
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  document.title = typeof to.meta.title === "function" ? to.meta.title(to) : to.meta.title;
  next();
});

export default router;
