const fs = require('fs');
const path = require('path');

const resourcesDir = path.join('public', 'resources');
const outputFile1 = path.join('src', 'components', 'CharacterList.json');
const outputFile2 = path.join('src', 'components', 'CharacterInfo.json');

// unofficial data
const mixDurations = {
    'Avatar_Albedo': 0,
    'Avatar_Arlecchino': 0,
    'Avatar_Baizhuer': 0.05,
    'Avatar_Barbara': 0.05,
    'Avatar_Charlotte': 0.1,
    'Avatar_Chasca': 0,
    'Avatar_Chevreuse': 0,
    'Avatar_Chiori': 0,
    'Avatar_Chongyun': 0.1,
    'Avatar_Citlali': 0,
    'Avatar_Clorinde': 0,
    'Avatar_Dori': 0.05,
    'Avatar_Emilie': 0,
    'Avatar_Eula': 0,
    'Avatar_Feiyan': 0,
    'Avatar_Freminet02': 0,
    'Avatar_Furina': 0,
    'Avatar_FurinaOusia': 0,
    'Avatar_Gorou': 0,
    'Avatar_Iansan': 0,
    'Avatar_Kaveh': 0,
    'Avatar_Kinich': 0,
    'Avatar_Kokomi': 0.1,
    'Avatar_Lanyan': 0,
    'Avatar_Mizuki': 0,
    'Avatar_Momoka': 0.05,
    'Avatar_Mona': 0,
    'Avatar_Mualani': 0,
    'Avatar_Nahida': 0.1,
    'Avatar_Navia': 0.1,
    'Avatar_Neuvillette': 0,
    'Avatar_Qiqi': 0.1,
    'Avatar_Shougun': 0,
    'Avatar_Sigewinne': 0,
    'Avatar_Varesa': 0,
    'Avatar_Wanderer': 0,
    'Avatar_Wanderer02': 0,
    'Avatar_Wriothesley': 0,
    'Avatar_Xilonen': 0,
    'Avatar_Yoimiya': 0,
    'Avatar_Yunjin': 0,
    'Monster_FatuusSummoner': 0,
    'Monster_GatorSacred': 0,
    'Monster_HermitCrabPrimo': 0,
    'Monster_HookwalkerPrimo': 0,
    'Monster_InvokerElectric': 0,
    'Monster_LaSignoraHarbinger': 0,
    'Monster_Muscleman': 0,
    'Monster_Narcissusborn': 0,
    'Monster_Ningyo': 0.1,
    'Monster_TheAbyssXiuhcoatl': 0.03
};

function getCharacterData(characterFolder) {
    const files = fs.readdirSync(characterFolder);
    let bg = '';
    let spine = [];

    files.forEach(file => {
        if (file.endsWith('_Bg.png') || file.endsWith('_Bg.webp')) {
            bg = file;
        }
        if (file.endsWith('.skel')) {
            spine.push(file.replace('.skel', ''));
        }
    });

    if (spine.length > 1) {
        spine.sort((a, b) => {
            if (a.includes('_Sub3_')) return -1;
            if (b.includes('_Sub3_')) return 1;
            if (a.includes('_Sub2_')) return -1;
            if (b.includes('_Sub2_')) return 1;
            if (a.includes('_Sub_')) return -1;
            if (b.includes('_Sub_')) return 1;
            if (a.includes('02_')) return -1;
            if (b.includes('02_')) return 1;
            return 0;
        });
    }

    return { bg, spine, btn: {} };
}

function generateList() {
    const charList = {};
    const characterFolders = fs.readdirSync(resourcesDir);

    characterFolders.forEach(folder => {
        const folderPath = path.join(resourcesDir, folder);
        if (fs.statSync(folderPath).isDirectory()) {
            charList[folder] = getCharacterData(folderPath);
            charList[folder]["mix"] = mixDurations.hasOwnProperty(folder) ? mixDurations[folder] : 0.2;
        }
    });

    return charList;
}

function writeToFile(obj, outputFile) {
    const content = JSON.stringify(obj, null, 4);
    fs.writeFileSync(outputFile, content, 'utf8');
}

async function updateCharacterInfo() {
    // const res = await fetch("https://raw.githubusercontent.com/genius-invokation/genius-invokation/refs/heads/main/packages/static-data/src/data/characters.json");
    const res = await fetch("https://gi-tcg-assets-api-hf.guyutongxue.site/api/v4/data/latest/CHS/characters");
    const data = await res.json();
    writeToFile(data.data, outputFile2);
}

const list = generateList();
writeToFile(list, outputFile1);
updateCharacterInfo().catch(err => {
    console.error("Update CharacterInfo.json failed:", err);
});