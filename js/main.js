import { isTextFile, shouldIgnore, generateTreeString, createMarkdownContent } from './utils.js';
import * as UI from './ui.js';

let resultUrl = null;

// Инициализация Drag & Drop
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
    }, false);
});

['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => UI.toggleDragActive(true), false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => UI.toggleDragActive(false), false);
});

dropZone.addEventListener('drop', (e) => handleFiles(e.dataTransfer.files));
fileInput.addEventListener('change', (e) => handleFiles(e.target.files));

// Кнопки сброса
document.getElementById('resetBtn').addEventListener('click', resetApp);
document.getElementById('retryBtn').addEventListener('click', resetApp);

function resetApp() {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    resultUrl = null;
    document.getElementById('fileInput').value = '';
    UI.showScene('upload');
}

async function handleFiles(files) {
    if (!files || files.length === 0) return;
    const file = files[0];

    if (!file.name.toLowerCase().endsWith('.zip')) {
        UI.showError("Пожалуйста, выберите .zip архив");
        return;
    }

    try {
        UI.showScene('processing');
        UI.updateProgress(5, 'Чтение архива...');

        // JSZip загружен глобально через CDN в index.html
        const zip = new JSZip(); 
        const loadedZip = await zip.loadAsync(file);
        
        const processedFiles = [];
        const paths = [];
        let totalSize = 0;

        const fileEntries = Object.keys(loadedZip.files);
        const totalFiles = fileEntries.length;
        let processedCount = 0;

        UI.updateProgress(10, 'Анализ структуры...');

        for (const filename of fileEntries) {
            const zipEntry = loadedZip.files[filename];
            processedCount++;

            // Обновляем UI каждые 15 файлов для производительности
            if (processedCount % 15 === 0) {
                const progress = 10 + Math.floor((processedCount / totalFiles) * 80);
                UI.updateProgress(progress, `Обработка: ${filename}`);
                // Даем браузеру отрисовать кадр
                await new Promise(r => setTimeout(r, 0));
            }

            if (zipEntry.dir) continue;
            if (shouldIgnore(filename)) continue;

            if (isTextFile(filename)) {
                paths.push(filename);
                const content = await zipEntry.async('string');
                totalSize += content.length;
                
                processedFiles.push({
                    path: filename,
                    content: content,
                    extension: filename.split('.').pop() || 'txt'
                });
            }
        }

        UI.updateProgress(95, 'Формирование Markdown...');
        
        const tree = generateTreeString(paths);
        const repoName = file.name.replace(/\.zip$/i, '');
        const markdownContent = createMarkdownContent(repoName, tree, processedFiles);

        const blob = new Blob([markdownContent], { type: 'text/markdown' });
        resultUrl = URL.createObjectURL(blob);
        const fileName = `${repoName}_context.md`;

        UI.updateResultUI(fileName, processedFiles.length, totalSize, resultUrl);
        UI.showScene('completed');

    } catch (error) {
        console.error(error);
        UI.showError("Ошибка чтения: " + (error.message || 'Unknown error'));
    }
}
