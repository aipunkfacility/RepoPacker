export const TEXT_EXTENSIONS = new Set([
    'js', 'jsx', 'ts', 'tsx', 'json', 'css', 'scss', 'html', 'md', 'txt', 
    'py', 'java', 'c', 'cpp', 'h', 'cs', 'go', 'rs', 'php', 'rb', 'sh', 
    'yaml', 'yml', 'xml', 'sql', 'gitignore', 'env', 'dockerfile', 'toml', 'ini', 'conf'
]);

export const IGNORE_DIRS = new Set([
    '.git', 'node_modules', 'dist', 'build', 'coverage', '.idea', '.vscode', '__pycache__', 'venv', 'bin', 'obj'
]);

export const IGNORE_FILES = new Set([
    'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', '.DS_Store', 'thumbs.db'
]);

export const ALLOWED_FILENAMES = new Set([
    'dockerfile', 'makefile', 'license', 'readme', 'changelog'
]);
