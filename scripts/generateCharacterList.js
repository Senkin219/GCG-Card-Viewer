const fs = require('fs');
const path = require('path');

const resourcesDir = path.join('public', 'resources');
const outputFile = path.join('src', 'components', 'CharacterList.js');

function getCharacterData(characterFolder) {
    const files = fs.readdirSync(characterFolder);
    let bg = '';
    let spine = [];

    files.forEach(file => {
        if (file.endsWith('_Bg.png')) {
            bg = file;
        }
        if (file.endsWith('.skel')) {
            spine.push(file.replace('.skel', ''));
        }
    });

    if (spine.length > 1) {
        spine.sort((a, b) => {
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
        }
    });

    return charList;
}

function writeToFile(obj) {
    const content = `const characterList = ${JSON.stringify(obj, null, 4)};\nexport default characterList;\n`;
    fs.writeFileSync(outputFile, content, 'utf8');
    console.log('CharacterList.js generated!');
}

const list = generateList();
writeToFile(list);
