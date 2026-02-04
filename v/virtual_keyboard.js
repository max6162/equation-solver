/**
 * ✅ УЛУЧШЕННАЯ ВИРТУАЛЬНАЯ КЛАВИАТУРА В ЕСТЕСТВЕННОМ ВИДЕ
 * Версия 2.1 - ИСПРАВЛЕНЫ ДУБЛИКАТЫ И ОПТИМИЗИРОВАНА
 */
export class VirtualKeyboard {
    constructor() {
 this.isOpen = false;
     this.currentInput = null;
        this.container = null;
   this.naturalKeyboardContainer = null;
        this.keyLayout = [
     // Первый ряд - цифры (1-0 + Backspace)
            [
  { key: '1', label: '1', width: 'key-sm' },
         { key: '2', label: '2', width: 'key-sm' },
     { key: '3', label: '3', width: 'key-sm' },
       { key: '4', label: '4', width: 'key-sm' },
           { key: '5', label: '5', width: 'key-sm' },
   { key: '6', label: '6', width: 'key-sm' },
       { key: '7', label: '7', width: 'key-sm' },
     { key: '8', label: '8', width: 'key-sm' },
{ key: '9', label: '9', width: 'key-sm' },
     { key: '0', label: '0', width: 'key-sm' },
       { key: 'Backspace', label: '⌫', width: 'key-lg', color: 'danger' }
            ],
    // Второй ряд - переменные и операторы
      [
           { key: 'x', label: 'x', category: 'variable', width: 'key-sm' },
         { key: 'y', label: 'y', category: 'variable', width: 'key-sm' },
  { key: 'a', label: 'a', category: 'variable', width: 'key-sm' },
             { key: 'b', label: 'b', category: 'variable', width: 'key-sm' },
       { key: 'c', label: 'c', category: 'variable', width: 'key-sm' },
{ key: 't', label: 't', category: 'variable', width: 'key-sm' },
  { key: '+', label: '+', category: 'operator', width: 'key-sm' },
     { key: '-', label: '−', category: 'operator', width: 'key-sm' },
      { key: '*', label: '×', category: 'operator', width: 'key-sm' },
      { key: '/', label: '÷', category: 'operator', width: 'key-sm' },
    { key: '=', label: '=', category: 'operator', color: 'success', width: 'key-sm' }
          ],
     // Третий ряд - математические символы
    [
  { key: '(', label: '(', category: 'bracket', width: 'key-sm' },
            { key: ')', label: ')', category: 'bracket', width: 'key-sm' },
        { key: '^', label: '^', category: 'math', width: 'key-sm' },
                { key: '√', label: '√', category: 'math', width: 'key-sm' },
        { key: '.', label: '.', category: 'number', width: 'key-sm' },
     { key: ',', label: ',', category: 'number', width: 'key-sm' },
           { key: 'π', label: 'π', category: 'constant', width: 'key-sm' },
  { key: 'e', label: 'e', category: 'constant', width: 'key-sm' },
                { key: '±', label: '±', category: 'math', width: 'key-sm' },
       { key: '≠', label: '≠', category: 'compare', width: 'key-sm' },
     { key: '≤', label: '≤', category: 'compare', width: 'key-sm' }
       ],
    // Четвёртый ряд - управление
    [
  { key: '≥', label: '≥', category: 'compare', width: 'key-sm' },
           { key: 'space', label: 'Пробел', width: 'key-space' },
         { key: 'Clear', label: 'Очистить', width: 'key-md', color: 'warning' }
        ]
      ];
     
        this.init();
    }
    
    /**
     * Инициализация
     */
    init() {
        // Создаем встроенную клавиатуру для естественного ввода
  this.createNaturalKeyboard();
        
     // Слушаем Escape
     this.setupEscapeListener();
    }
    
    /**
     * Создает встроенную клавиатуру для естественного ввода
     */
    createNaturalKeyboard() {
        this.naturalKeyboardContainer = document.getElementById('natural-keyboard-container');
      if (!this.naturalKeyboardContainer) return;
        
   // Очищаем контейнер (на случай если инициализируется дважды)
        this.naturalKeyboardContainer.innerHTML = '';
        
        // Заполняем контейнер клавишами
     this.keyLayout.forEach((row) => {
         const rowEl = document.createElement('div');
rowEl.className = 'keyboard-row';
       
         row.forEach((keyData) => {
           const btn = this.createKeyButton(keyData);
      rowEl.appendChild(btn);
         });
        
            this.naturalKeyboardContainer.appendChild(rowEl);
        });
    }
    
    /**
     * Создает кнопку клавиши
     */
    createKeyButton(keyData) {
        const btn = document.createElement('button');
     btn.className = 'keyboard-key';
        btn.type = 'button';
        btn.dataset.key = keyData.key;
        btn.innerHTML = keyData.label;
   
        // Добавляем классы в зависимости от типа
        if (keyData.category) {
            btn.classList.add(`key-${keyData.category}`);
        }
        
        if (keyData.color) {
   btn.classList.add(`key-${keyData.color}`);
        }
        
        if (keyData.width) {
 btn.classList.add(keyData.width);
        }
        
// Обработчики событий
        btn.addEventListener('click', (e) => {
     e.preventDefault();
            e.stopPropagation();
            this.handleKey(keyData.key);
         this.showPressAnimation(btn);
      });
        
        // Визуальные эффекты для mouse
      btn.addEventListener('mousedown', () => {
      btn.classList.add('pressed');
        });
        
        btn.addEventListener('mouseup', () => {
        btn.classList.remove('pressed');
        });
        
     btn.addEventListener('mouseleave', () => {
     btn.classList.remove('pressed');
        });
        
        // Touch поддержка
    btn.addEventListener('touchstart', (e) => {
  e.preventDefault();
     btn.classList.add('pressed');
        });
        
        btn.addEventListener('touchend', (e) => {
    e.preventDefault();
       btn.classList.remove('pressed');
            this.handleKey(keyData.key);
            this.showPressAnimation(btn);
        });
        
        return btn;
    }
  
    /**
     * Показывает анимацию нажатия (только один раз!)
     */
    showPressAnimation(btn) {
        btn.classList.add('animate-press');
  setTimeout(() => {
   btn.classList.remove('animate-press');
      }, 150);
    }
    
    /**
     * Добавляет кнопки открытия клавиатуры рядом с input полями
     */
    addKeyboardToggleButtons() {
        return;
        // Находим все input поля ТОЛЬКО в форме ввода
        const inputs = document.querySelectorAll('#equationForm input[type="text"], #equationForm input[type="number"]');

        inputs.forEach(input => {
// Пропускаем если уже добавлена
          if (input.nextElementSibling?.classList.contains('keyboard-toggle-btn')) {
   return;
            }
     
     // Создаем кнопку
            const toggleBtn = document.createElement('button');
         toggleBtn.className = 'keyboard-toggle-btn';
      toggleBtn.type = 'button';
      toggleBtn.innerHTML = '⌨️';
  toggleBtn.title = 'Открыть виртуальную клавиатуру';
            
            toggleBtn.addEventListener('click', (e) => {
          e.preventDefault();
        e.stopPropagation();
   this.open(input);
            });
      
        // Добавляем обработчик фокуса на input
    input.addEventListener('focus', () => {
   this.currentInput = input;
 });
   
         // Вставляем кнопку рядом с input
            input.parentNode.insertBefore(toggleBtn, input.nextSibling);
        });
    }
    
 /**
     * Настраивает закрытие по Escape
     */
    setupEscapeListener() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
        this.close();
            }
        });
    }
    
    /**
     * Открывает плавающую клавиатуру
     */
    open(input) {
   if (!input) {
            const activeEl = document.activeElement;
   if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
       input = activeEl;
            } else {
     return;
   }
        }
        
        this.currentInput = input;
        this.isOpen = true;
        input.focus();
    }
    
  /**
     * Закрывает плавающую клавиатуру
   */
    close() {
        this.isOpen = false;
        this.currentInput = null;
    }
    
    /**
     * Обрабатывает нажатие клавиши
  */
    handleKey(key) {
        // Для естественного ввода
        const naturalInputWrapper = document.querySelector('.natural-input-wrapper');
        if (naturalInputWrapper && naturalInputWrapper.style.display !== 'none') {
         const naturalInput = document.getElementById('naturalInput');
         if (naturalInput) {
       if (key === 'Backspace') {
           naturalInput.value = naturalInput.value.slice(0, -1);
   } else if (key === 'Clear') {
            naturalInput.value = '';
      } else if (key === 'space') {
     naturalInput.value += ' ';
        } else {
             naturalInput.value += key;
         }
         
    naturalInput.dispatchEvent(new Event('input', { bubbles: true }));
    naturalInput.dispatchEvent(new Event('change', { bubbles: true }));
           naturalInput.focus();
     }
   return;
        }
        
      // Для формы ввода с плавающей клавиатурой
        if (!this.currentInput) return;
     
      const input = this.currentInput;
        
        if (key === 'Backspace') {
  input.value = input.value.slice(0, -1);
        } else if (key === 'Clear') {
  input.value = '';
        } else if (key === 'Close') {
       this.close();
        } else if (key === 'space') {
   input.value += ' ';
        } else {
    input.value += key;
        }
    
      // Триггерим события
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
 
        // Фокус остается на input
      input.focus();
    }
}

// Инициализируем при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.virtualKeyboard = new VirtualKeyboard();
});
