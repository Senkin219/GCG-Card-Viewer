<script setup>
import { onMounted } from "vue";
import characterList from "./CharacterList"
import spine from "../assets/spine-player.js";
import "../assets/spine-player.css"

const props = defineProps({
    characterName: {
        type: String,
        required: true
    }
})
const players = {}
onMounted(() => {
    const x = -314;
    const y = -533;
    const width = 631;
    const height = width / 478 * 806;
    for (let spineName of characterList[props.characterName]['spine']) {
        players[spineName] = new spine.SpinePlayer(spineName, {
            skelUrl: `/resources/${props.characterName}/${spineName}.skel`,
            atlasUrl: `/resources/${props.characterName}/${spineName}.atlas`,
            premultipliedAlpha: false,
            showControls: false,
            showLoading: false,
            alpha: true,
            defaultMix: characterList[props.characterName]['mix'],
            viewport: {
                x: x,
                y: y,
                width: width,
                height: height,
                padLeft: "0%",
                padRight: "0%",
                padTop: "0%",
                padBottom: "0%",
            },
            success: function (player) {
                let idleName = player.skeleton.data.animations.find(i => i.name?.includes('_Idle'))?.name;
                player.play();
                player.setAnimation(idleName);
            },
        });
    }
})
function attack() {
    let attackDuration = 1
    for (let spineName of characterList[props.characterName]['spine']) {
        let attackName = players[spineName].skeleton.data.animations.find(i => i.name?.includes('_Attack'))?.name;
        let idleName = players[spineName].skeleton.data.animations.find(i => i.name?.includes('_Idle'))?.name;
        attackDuration = players[spineName].skeleton.data.animations.find(i => i.name?.includes('_Attack'))?.duration * 1000;
        players[spineName].animationState.data.setMix(attackName, idleName, 0);
        players[spineName].animationState.setAnimation(0, attackName, false);
        players[spineName].animationState.addAnimation(0, idleName, true, 0);
    }
    document.getElementById("btn_" + props.characterName).style.zIndex = -1;
    setTimeout(function () { document.getElementById("btn_" + props.characterName).style.zIndex = 1 }, attackDuration);
}
</script>

<template>
    <div class="card">
        <div class="cardface"
            :style="{ backgroundImage: `url(/resources/${characterName}/${characterList[characterName]['bg']})` }">
            <div :id="spineName" style="width:100%;height:100%;position:absolute;"
                v-for="spineName in characterList[characterName]['spine']"></div>
            <div :id="`btn_${characterName}`"
                :style="{ width: characterList[characterName]['btn']['width'] ?? '100%', height: characterList[characterName]['btn']['height'] ?? '100%', left: characterList[characterName]['btn']['left'] ?? '0%', bottom: characterList[characterName]['btn']['bottom'] ?? '0%', position: 'absolute', zIndex: 1, opacity: 0, backgroundColor: 'white' }"
                @click="attack"></div>
        </div>
        <div class="cardframe"></div>
    </div>
</template>

<style scoped>
.card {
    width: 478px;
    height: 806px;
    padding-left: 60px;
    padding-right: 60px;
}

.cardface {
    width: 478px;
    height: 806px;
    overflow: hidden;
    position: absolute;
    background-size: 696px 1024px;
    background-position: -109px -109px;
}

.cardframe {
    width: 478px;
    height: 806px;
    overflow: hidden;
    position: absolute;
    border-width: 1px;
    box-sizing: border-box;
    border-style: solid;
    border-image: url(../assets/UI_TeyvatCard_CardFrame_Platinum.png) 40% stretch;
    border-image-width: 179px;
    border-image-outset: 11px;
}
</style>
