const scenes = {
    upload: document.getElementById('scene-upload'),
    processing: document.getElementById('scene-processing'),
    completed: document.getElementById('scene-completed'),
    error: document.getElementById('scene-error')
};

export function showScene(sceneName) {
    Object.values(scenes).forEach(el => el.classList.add('hidden'));
    scenes[sceneName].classList.remove('hidden');
}

export function updateProgress(percent, message) {
    document.getElementById('progressBar').style.width = `${percent}%`;
    document.getElementById('statusMessage').innerText = message;
}

export function showError(msg) {
    document.getElementById('errorMessage').innerText = msg;
    showScene('error');
}

export function updateResultUI(fileName, count, sizeInBytes, url) {
    document.getElementById('resultFileName').innerText = fileName;
    document.getElementById('resultFileCount').innerText = `📄 ${count} файлов`;
    document.getElementById('resultTotalSize').innerText = `📦 ${(sizeInBytes / 1024).toFixed(1)} KB текста`;
    
    const downloadBtn = document.getElementById('downloadBtn');
    downloadBtn.href = url;
    downloadBtn.download = fileName;
}

export function toggleDragActive(isActive) {
    const dropZone = document.getElementById('dropZone');
    if (isActive) dropZone.classList.add('drag-active');
    else dropZone.classList.remove('drag-active');
}
