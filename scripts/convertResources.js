const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

const resourcesDir = path.join('public', 'resources');

async function getAllFiles(dir) {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
        dirents.map(dirent => {
            const resolvedPath = path.resolve(dir, dirent.name);
            return dirent.isDirectory() ? getAllFiles(resolvedPath) : resolvedPath;
        })
    );
    return files.flat();
}

async function convertImages(files) {
    const pngFiles = files.filter(file => file.endsWith('.png'));
    if (pngFiles.length === 0) {
        return;
    }

    const conversionTasks = pngFiles.map(async (pngFile) => {
        const webpFile = pngFile.replace(/\.png$/, '.webp');
        try {
            await sharp(pngFile).webp({ quality: 95 }).toFile(webpFile);
            await fs.unlink(pngFile);
        } catch (err) {
            console.error(`Failed to convert ${path.basename(pngFile)}:`, err);
        }
    });

    await Promise.all(conversionTasks);
}

async function updateAtlasFiles(files) {
    const atlasFiles = files.filter(file => file.endsWith('.atlas'));
    if (atlasFiles.length === 0) {
        return;
    }

    const updateTasks = atlasFiles.map(async (atlasFile) => {
        try {
            const content = await fs.readFile(atlasFile, 'utf8');
            const newContent = content.replace(/\.png\r?\n/g, '.webp\n');
            if (content !== newContent) {
                await fs.writeFile(atlasFile, newContent, 'utf8');
            }
        } catch (err) {
            console.error(`Failed to update ${path.basename(atlasFile)}:`, err);
        }
    });

    await Promise.all(updateTasks);
}

async function run() {
    try {
        const allFiles = await getAllFiles(resourcesDir);
        await convertImages(allFiles);
        await updateAtlasFiles(allFiles);
    } catch (err) {
        console.error('An error occurred during resource processing:', err);
        process.exit(1);
    }
}

run();
