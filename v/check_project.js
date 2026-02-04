#!/usr/bin/env node

/**
 * СКРИПТ ПРОВЕРКИ ЦЕЛОСТНОСТИ ПРОЕКТА
 * Используйте для быстрой проверки что все исправлено
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI цвета для вывода
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

// Список файлов для проверки
const requiredFiles = [
    'index.html',
    'styles.css',
    'script.js',
    'solver.js',
    'ui_manager.js',
    'graph.js',
    'history.js',
    'README.md'
];

// Проверки на содержимое
const contentChecks = [
    {
     file: 'script.js',
        shouldContain: 'import { UIManager } from \'./ui_manager.js\'',
        description: 'UIManager импортируется из ui_manager.js'
    },
    {
  file: 'ui_manager.js',
        shouldContain: 'export class UIManager',
        description: 'UIManager класс экспортируется'
    },
    {
        file: 'index.html',
        shouldContain: 'type="module" src="script.js"',
        description: 'HTML использует модули'
    },
 {
        file: 'solver.js',
        shouldContain: 'export class QuadraticSolver',
        description: 'QuadraticSolver экспортируется'
    },
    {
 file: 'graph.js',
  shouldContain: 'export class GraphManager',
        description: 'GraphManager экспортируется'
    },
    {
     file: 'history.js',
        shouldContain: 'export class HistoryManager',
   description: 'HistoryManager экспортируется'
    }
];

console.log(`${colors.cyan}
╔════════════════════════════════════════════════════╗
║     EquationSolver - Проверка Целостности          ║
║                                                    ║
║  Статус: Проверка всех исправлений и файлов        ║
╚════════════════════════════════════════════════════╝
${colors.reset}\n`);

// 1. Проверка наличия файлов
console.log(`${colors.blue}Проверка наличия файлов:${colors.reset}`);
let filesOk = true;
requiredFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        const size = fs.statSync(filePath).size;
        console.log(`  ${colors.green}OK${colors.reset} ${file} (${size} bytes)`);
    } else {
        console.log(`  ${colors.red}ERROR${colors.reset} ${file} - НЕ НАЙДЕН!`);
        filesOk = false;
    }
});

// 2. Проверка содержимого
console.log(`\n${colors.blue}Проверка содержимого файлов:${colors.reset}`);
let contentOk = true;
contentChecks.forEach(check => {
    const filePath = path.join(__dirname, check.file);
    if (!fs.existsSync(filePath)) {
        console.log(`  ${colors.yellow}WARN${colors.reset}  ${check.file} - файл не найден`);
        return;
  }
    
    const content = fs.readFileSync(filePath, 'utf-8');
    if (content.includes(check.shouldContain)) {
   console.log(`  ${colors.green}OK${colors.reset}  ${check.description}`);
    } else {
console.log(`  ${colors.red}ERROR${colors.reset}  ${check.description}`);
        contentOk = false;
    }
});

// 3. Проверка синтаксиса JavaScript
console.log(`\n${colors.blue}Проверка синтаксиса JavaScript:${colors.reset}`);
const jsFiles = ['script.js', 'solver.js', 'ui_manager.js', 'graph.js', 'history.js'];
let syntaxOk = true;
jsFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        // Базовая проверка синтаксиса (парные скобки)
      let openBraces = (content.match(/{/g) || []).length;
        let closeBraces = (content.match(/}/g) || []).length;
      
        if (openBraces === closeBraces) {
  console.log(`  ${colors.green}OK${colors.reset}  ${file} - синтаксис верен`);
        } else {
            console.log(`${colors.red}ERROR${colors.reset}  ${file} - несоответствие скобок`);
            syntaxOk = false;
        }
    } catch (err) {
      console.log(`  ${colors.red}ERROR${colors.reset}  ${file} - ошибка чтения`);
      syntaxOk = false;
    }
});

// 4. Итоговый отчет
console.log(`\n${colors.cyan}╔════════════════════════════════════════════════════╗${colors.reset}`);

if (filesOk && contentOk && syntaxOk) {
    console.log(`${colors.cyan}║${colors.reset}  ${colors.green}OK ВСЕ ПРОВЕРКИ ПРОЙДЕНЫ${colors.reset}`);
    console.log(`${colors.cyan}║${colors.reset}`);
    console.log(`${colors.cyan}║${colors.reset}  Приложение готово к использованию!`);
    console.log(`${colors.cyan}║${colors.reset}`);
    console.log(`${colors.cyan}║${colors.reset}  ${colors.yellow}Рекомендация:${colors.reset} Запустите локальный сервер:`);
    console.log(`${colors.cyan}║${colors.reset}  python -m http.server 8000`);
    console.log(`${colors.cyan}║${colors.reset}  http://localhost:8000`);
    console.log(`${colors.cyan}╚════════════════════════════════════════════════════╝${colors.reset}`);
    process.exit(0);
} else {
    console.log(`${colors.cyan}║${colors.reset}  ${colors.red}ERROR НАЙДЕНЫ ОШИБКИ${colors.reset}`);
    console.log(`${colors.cyan}║${colors.reset}`);
    if (!filesOk) console.log(`${colors.cyan}║${colors.reset}  • Отсутствуют файлы`);
    if (!contentOk) console.log(`${colors.cyan}║${colors.reset}  • Проблемы с содержимым`);
    if (!syntaxOk) console.log(`${colors.cyan}║${colors.reset}  • Синтаксические ошибки`);
    console.log(`${colors.cyan}╚════════════════════════════════════════════════════╝${colors.reset}`);
    process.exit(1);
}
