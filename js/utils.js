import { TEXT_EXTENSIONS, IGNORE_DIRS, IGNORE_FILES, ALLOWED_FILENAMES } from './config.js';

export function isTextFile(filename) {
    const parts = filename.split('.');
    if (parts.length === 1) return false; 
    const ext = parts.pop()?.toLowerCase();
    if (ALLOWED_FILENAMES.has(parts.join('.').toLowerCase())) return true;
    return TEXT_EXTENSIONS.has(ext);
}

export function shouldIgnore(path) {
    const parts = path.split('/');
    for (const part of parts) {
        if (IGNORE_DIRS.has(part)) return true;
    }
    const filename = parts[parts.length - 1];
    if (IGNORE_FILES.has(filename)) return true;
    
    // Игнор медиа
    const ext = filename.split('.').pop()?.toLowerCase();
    if (['png', 'jpg', 'jpeg', 'gif', 'ico', 'svg', 'mp4', 'mp3', 'zip'].includes(ext)) return true;
    return false;
}

export function generateTreeString(paths) {
    let output = '';
    paths.sort().forEach(path => {
        const depth = path.split('/').length - 1;
        const indent = '  '.repeat(depth);
        const name = path.split('/').pop();
        output += `${indent}- ${name}\n`;
    });
    return output;
}

export function createMarkdownContent(repoName, tree, files) {
    let md = `# Project: ${repoName}\n\n`;
    md += `## 📂 Project Structure\n\n\`\`\`\n${tree}\n\`\`\`\n\n`;
    md += `## 💻 File Contents\n\n`;
    files.forEach(f => {
        md += `### ${f.path}\n`;
        md += `\`\`\`${f.extension}\n`;
        md += f.content;
        md += `\n\`\`\`\n\n`;
    });
    return md;
}
