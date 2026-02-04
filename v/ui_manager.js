/* ==========================================
   МОДУЛЬ УПРАВЛЕНИЯ ИНТЕРФЕЙСОМ
   ========================================== */

import { validateCoefficients, generateRandomEquation, formatNumber } from './solver.js';

/**
 * Класс управления интерфейсом
 */
export class UIManager {
    constructor() {
        // Основные элементы DOM
        this.equationForm = document.getElementById('equationForm');
        this.coeffAInput = null;
        this.coeffBInput = null;
this.coeffCInput = null;
        this.solveBtn = document.getElementById('solveBtn');
      this.clearBtn = document.getElementById('clearBtn');
        
        // Управление отображением
        this.detailToggle = document.getElementById('detailToggle');
  this.solutionControls = document.getElementById('solutionControls');
      
        // Решение
        this.solutionSection = document.getElementById('solutionSection');
        this.solutionSteps = document.getElementById('solutionSteps');
        this.answerBox = document.getElementById('answerBox');
        
        // График
        this.graphSection = document.getElementById('graphSection');
        this.graphCanvas = document.getElementById('graphCanvas');
    this.zoomInBtn = document.getElementById('zoomInBtn');
        this.zoomOutBtn = document.getElementById('zoomOutBtn');
      this.resetZoomBtn = document.getElementById('resetZoomBtn');
        
      // История
        this.historySection = document.getElementById('historySection');
        this.historyList = document.getElementById('historyList');
   this.clearHistoryBtn = document.getElementById('clearHistoryBtn');
        
 // Кнопки действий
   this.copyBtn = document.getElementById('copyBtn');
  this.exportBtn = document.getElementById('exportBtn');
        
  // Уведомления
        this.notification = document.getElementById('notification');
  
        // Примеры
        this.exampleBtns = document.querySelectorAll('.example-btn');
        
        // Практика
        this.generateBtn = document.getElementById('generateBtn');
     
        // Состояние
     this.currentSolution = null;
        this.isDetailedMode = true;
        
      this.init();
    }
    
  /**
     * Инициализация обработчиков событий
     */
    init() {
        // Форма
        if (this.equationForm) {
            this.equationForm.addEventListener('submit', (e) => {
       e.preventDefault();
      this.onSolveClick();
     });
        }

        // Кнопка очистки
        if (this.clearBtn) {
   this.clearBtn.addEventListener('click', () => this.clearForm());
      }
        
        // Примеры
        this.exampleBtns.forEach(btn => {
            btn.addEventListener('click', () => this.loadExample(btn));
        });

        // Переключатель детальности
        if (this.detailToggle) {
    this.detailToggle.addEventListener('change', () => {
 this.toggleDetailedMode();
      });
        }
      
      // Кнопки действий
        if (this.copyBtn) {
            this.copyBtn.addEventListener('click', () => this.copySolution());
    }
        if (this.exportBtn) {
            this.exportBtn.addEventListener('click', () => this.exportSolution());
        }
        
        // Кнопки масштабирования
        if (this.zoomInBtn) {
     this.zoomInBtn.addEventListener('click', () => {
     if (window.graphManager) window.graphManager.zoomIn();
            });
        }
        if (this.zoomOutBtn) {
   this.zoomOutBtn.addEventListener('click', () => {
         if (window.graphManager) window.graphManager.zoomOut();
   });
   }
    if (this.resetZoomBtn) {
this.resetZoomBtn.addEventListener('click', () => {
        if (window.graphManager) window.graphManager.resetZoom();
      });
        }
        
        // История
 if (this.clearHistoryBtn) {
            this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
 }
    
        // Практика
   if (this.generateBtn) {
       this.generateBtn.addEventListener('click', () => this.generateEquation());
    }
  }
    
    /**
     * Инициализирует коэффициенты после создания полей
   */
    setupCoefficients() {
        // Получаем все поля формы
const inputs = document.querySelectorAll('.form-input');
      
      inputs.forEach(input => {
     input.addEventListener('change', () => this.validateInput(input));
    });
    }
    
    /**
     * Обработка клика по кнопке "Решить"
     */
    onSolveClick() {
        // ✅ ПОЛУЧАЕМ ВСЕ КОЭФФИЦИЕНТЫ В ЗАВИСИМОСТИ ОТ ТИПА
   const currentType = window.app?.currentEquationType || 'quadratic';
const coefficients = {};
        let isValid = false;
        let errors = {};

  if (currentType === 'linear') {
   const a = document.getElementById('coeffA')?.value?.trim() || '';
    const b = document.getElementById('coeffB')?.value?.trim() || '';
     
          if (!a || !b || isNaN(parseFloat(a)) || isNaN(parseFloat(b))) {
    this.showNotification('Введите коэффициенты a и b', 'error');
         return;
         }
      
     coefficients.a = a;
           coefficients.b = b;
   isValid = true;
        } 
     else if (currentType === 'cubic') {
            const a = document.getElementById('coeffA')?.value?.trim() || '';
     const b = document.getElementById('coeffB')?.value?.trim() || '';
       const c = document.getElementById('coeffC')?.value?.trim() || '';
      const d = document.getElementById('coeffD')?.value?.trim() || '';
  
           if (!a || isNaN(parseFloat(a))) {
               this.showNotification('Введите коэффициент a', 'error');
     return;
}
           
       coefficients.a = a;
      coefficients.b = b || '0';
 coefficients.c = c || '0';
  coefficients.d = d || '0';
           isValid = true;
        }
        else if (currentType === 'biquadratic') {
      const a = document.getElementById('coeffA')?.value?.trim() || '';
     const b = document.getElementById('coeffB')?.value?.trim() || '';
            const c = document.getElementById('coeffC')?.value?.trim() || '';
           
           if (!a || isNaN(parseFloat(a))) {
 this.showNotification('Введите коэффициент a', 'error');
  return;
     }
        
     coefficients.a = a;
      coefficients.b = b || '0';
    coefficients.c = c || '0';
     isValid = true;
      }
        else if (currentType === 'system') {
  const a1 = document.getElementById('a1')?.value?.trim() || '';
     const b1 = document.getElementById('b1')?.value?.trim() || '';
const c1 = document.getElementById('c1')?.value?.trim() || '';
   const a2 = document.getElementById('a2')?.value?.trim() || '';
     const b2 = document.getElementById('b2')?.value?.trim() || '';
     const c2 = document.getElementById('c2')?.value?.trim() || '';
      
   if (!a1 || !b1 || !c1 || !a2 || !b2 || !c2) {
        this.showNotification('Введите все коэффициенты', 'error');
       return;
      }
    
   coefficients.a1 = a1;
      coefficients.b1 = b1;
    coefficients.c1 = c1;
    coefficients.a2 = a2;
 coefficients.b2 = b2;
     coefficients.c2 = c2;
   isValid = true;
        }
        else if (currentType === 'rational') {
        const numerator = document.getElementById('numerator')?.value?.trim() || '';
    const denominator = document.getElementById('denominator')?.value?.trim() || '';
        
        if (!numerator || !denominator) {
     this.showNotification('Введите числитель и знаменатель', 'error');
   return;
        }
      
     coefficients.numerator = numerator;
        coefficients.denominator = denominator;
     isValid = true;
        }
        else if (currentType === 'quadratic') {
      const a = document.getElementById('coeffA')?.value?.trim() || '';
         const b = document.getElementById('coeffB')?.value?.trim() || '';
       const c = document.getElementById('coeffC')?.value?.trim() || '';
           
// Валидация
     const validation = validateCoefficients(a, b, c);
    
         if (!validation.isValid) {
   this.showErrors(validation.errors);
     return;
        }
     
      coefficients.a = a;
     coefficients.b = b;
       coefficients.c = c;
            isValid = true;
        }

        if (!isValid) {
  this.showNotification('Заполните все поля правильно', 'error');
      return;
      }
    
        this.clearErrors();

        // ✅ Запускаем решение через основной скрипт
  window.dispatchEvent(new CustomEvent('solve-equation', {
      detail: {
   a: coefficients.a,
     b: coefficients.b,
      c: coefficients.c,
      d: coefficients.d,
           a1: coefficients.a1,
   b1: coefficients.b1,
       c1: coefficients.c1,
    a2: coefficients.a2,
         b2: coefficients.b2,
    c2: coefficients.c2,
     coefficients: coefficients
  }
      }));
    }
    
    /**
     * Показывает ошибки валидации
     */
    showErrors(errors) {
        this.clearErrors();
      
        if (errors.general) {
 this.showNotification(errors.general, 'error');
        }
        
     if (errors.a) {
  this.showFieldError('coeffA', errors.a);
        }
      if (errors.b) {
            this.showFieldError('coeffB', errors.b);
        }
        if (errors.c) {
       this.showFieldError('coeffC', errors.c);
        }
    }
    
    /**
     * Показывает ошибку для поля
     */
    showFieldError(fieldId, message) {
   const input = document.getElementById(fieldId);
        const errorEl = document.getElementById(`${fieldId}-error`);
        
        if (input) {
   input.classList.add('error');
          input.classList.remove('success');
        }
        if (errorEl) {
            errorEl.textContent = message;
     errorEl.classList.add('show');
        }
    }
    
    /**
     * Очищает ошибки
     */
    clearErrors() {
        [this.coeffAInput, this.coeffBInput, this.coeffCInput]
          .filter(i => i !== null)
    .forEach(input => {
          input.classList.remove('error', 'success');
    const errorEl = document.getElementById(`${input.id}-error`);
     if (errorEl) {
     errorEl.textContent = '';
         errorEl.classList.remove('show');
                }
   });
    }
    
    /**
     * Валидирует отдельное поле в реальном времени
     */
    validateInput(input) {
        if (!input) return;
   
        const isEmpty = input.value.trim() === '';
        
        if (isEmpty) {
            input.classList.remove('error', 'success');
            const errorEl = document.getElementById(`${input.id}-error`);
            if (errorEl) {
    errorEl.classList.remove('show');
   }
         return;
        }
        
        // Попробуем распарсить
     const num = parseFloat(input.value);
        const isFraction = input.value.includes('/');
        
        if (isNaN(num) && !isFraction) {
   input.classList.add('error');
    input.classList.remove('success');
        } else {
            input.classList.add('success');
       input.classList.remove('error');
        }
    }
    
    /**
     * Очищает форму
     */
    clearForm() {
        if (this.equationForm) {
     this.equationForm.reset();
        }
        this.clearErrors();
   this.hideSolution();
        this.showNotification('Форма очищена', 'success');
    }
    
    /**
     * Загружает пример уравнения
     */
  loadExample(btn) {
        const a = btn.dataset.a;
  const b = btn.dataset.b;
        const c = btn.dataset.c;
    
        if (this.coeffAInput) this.coeffAInput.value = a;
        if (this.coeffBInput) this.coeffBInput.value = b;
        if (this.coeffCInput) this.coeffCInput.value = c;
        
        [this.coeffAInput, this.coeffBInput, this.coeffCInput]
            .filter(i => i !== null)
      .forEach(input => {
         input.classList.add('success');
       });
        
        // Автоматически решаем
     setTimeout(() => this.onSolveClick(), 100);
    }
    
    /**
     * Показывает решение
     */
    displaySolution(solution) {
        this.currentSolution = solution;
        
   // Показываем секцию решения
        if (this.solutionSection) {
  this.solutionSection.style.display = 'block';
        }
    if (this.solutionControls) {
  this.solutionControls.style.display = 'flex';
      }
    
 // Очищаем шаги
 if (this.solutionSteps) {
  this.solutionSteps.innerHTML = '';
 
            // Добавляем шаги в зависимости от режима
         if (this.isDetailedMode && solution.steps) {
       this.displayDetailedSteps(solution.steps);
    } else {
       this.displaySimplifiedSteps(solution);
   }
 }
        
        // Отображаем ответ
        this.displayAnswer(solution);
        
 
    // Прокручиваем к решению
        if (this.solutionSection) {
            this.solutionSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
  
    /**
     * ✅ НОВОЕ ОФОРМЛЕНИЕ - ПОДРОБНЫЕ ШАГИ БЕЗ HTML ТЕГОВ
     */
    displayDetailedSteps(steps) {
  if (!this.solutionSteps || !steps) return;
    
  steps.forEach((step, index) => {
      const stepEl = document.createElement('div');
  stepEl.className = 'solution-step';
         
          // Заголовок шага
   const headerEl = document.createElement('div');
      headerEl.className = 'step-header';
  headerEl.innerHTML = `<div class="step-number">${index + 1}</div><div class="step-title-text">${step.title}</div>`;
    
 const contentEl = document.createElement('div');
  contentEl.className = 'step-content-clean';
      
   // Очищаем контент от HTML тегов
      let cleanText = (step.content || '')
    .replace(/<br>/g, '\n')
          .replace(/<strong>/g, '')
          .replace(/<\/strong>/g, '')
     .replace(/<p>/g, '')
    .replace(/<\/p>/g, '')
      .replace(/<code>/g, '')
 .replace(/<\/code>/g, '')
          .replace(/<span[^>]*>/g, '')
        .replace(/<\/span>/g, '')
          .replace(/&nbsp;/g, ' ')
   .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .trim();
  
    // Разбиваем по строкам и отображаем каждую отдельно
        const lines = cleanText.split('\n')
  .map(line => line.trim())
      .filter(line => line.length > 0);
    
        lines.forEach(line => {
    const lineEl = document.createElement('div');
 lineEl.className = 'formula-line';
  lineEl.textContent = line;
         contentEl.appendChild(lineEl);
        });
        
    stepEl.appendChild(headerEl);
        stepEl.appendChild(contentEl);
 this.solutionSteps.appendChild(stepEl);
        });
    }
    
    /**
     * Отображает упрощённые шаги
   */
    displaySimplifiedSteps(solution) {
      if (!this.solutionSteps) return;
      
        const stepEl = document.createElement('div');
        stepEl.className = 'step';
        
      const titleEl = document.createElement('div');
   titleEl.className = 'step-title';
   titleEl.innerHTML = `
            <span class="step-number">1</span>
 <span>Решение</span>
        `;
    
        const contentEl = document.createElement('div');
        contentEl.className = 'step-content';
        
        if (solution.equationType === 'quadratic') {
            const D = solution.discriminant;
      if (D > 0) {
         contentEl.innerHTML = `
  <p>Дискриминант: D = ${solution.discriminant.toFixed(2)} > 0</p>
            <p>Уравнение имеет два различных корня</p>
    `;
            } else if (D === 0) {
     contentEl.innerHTML = `
          <p>Дискриминант: D = 0</p>
  <p>Уравнение имеет один корень</p>
        `;
     } else {
          contentEl.innerHTML = `
      <p>Дискриминант: D = ${solution.discriminant.toFixed(2)} < 0</p>
      <p>Уравнение имеет два комплексных корня</p>
`;
         }
        } else if (solution.equationType === 'linear') {
  contentEl.innerHTML = '<p>Это линейное уравнение</p>';
        } else if (solution.equationType === 'degenerate') {
      contentEl.innerHTML = '<p>Это вырожденный случай</p>';
        }
        
        stepEl.appendChild(titleEl);
        stepEl.appendChild(contentEl);
        this.solutionSteps.appendChild(stepEl);
    }
    
  /**
     * Форматирует контент шага - ЧИСТОЕ МАТЕМАТИЧЕСКОЕ ОФОРМЛЕНИЕ БЕЗ HTML
     */
    formatStepContent(content) {
      if (!content) return '';
        
   // Очищаем от всех HTML тегов
        let cleanContent = content
   .replace(/<br>/g, '\n')
          .replace(/<strong>/g, '')
          .replace(/<\/strong>/g, '')
     .replace(/<p>/g, '')
    .replace(/<\/p>/g, '')
          .replace(/<code>/g, '')
     .replace(/<\/code>/g, '')
          .replace(/<\/span>/g, '')
          .replace(/<span[^>]*>/g, '')
          .replace(/&nbsp;/g, ' ')
   .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .trim();
    
        // Разбиваем по строкам
        const lines = cleanContent.split('\n')
       .map(line => line.trim())
          .filter(line => line.length > 0);
        
        if (lines.length === 0) return '';

        // Создаем HTML с правильным форматированием
      return lines.map((line, i) => {
      // Пропускаем пустые строки
 if (!line) return '';
            
          // Каждая строка в отдельном блоке
     const container = document.createElement('div');
      container.className = 'formula-line';
     container.textContent = line;
   
      return container.outerHTML;
      }).join('');
    }
    
    /**
     * Отображает ответ профессионально - БЕЗ КОМПЛЕКСНЫХ ЧИСЕЛ
     */
    displayAnswer(solution) {
 if (!this.answerBox) return;
    
        this.answerBox.innerHTML = '';
        
   // ✅ СИСТЕМА 2x2
    if (solution.equationType === 'system') {
            if (solution.solution) {
  const { x, y } = solution.solution;
           const xDisplay = typeof x === 'number' ? (Math.abs(x) < 0.0001 ? '0' : x.toFixed(4)) : x;
  const yDisplay = typeof y === 'number' ? (Math.abs(y) < 0.0001 ? '0' : y.toFixed(4)) : y;
         
  this.answerBox.innerHTML = `
         <div class="answer-box-success">
           <div class="answer-title">Решение системы</div>
         <div class="answer-values">
          <div class="answer-line">
     <span class="answer-var">x</span>
        <span class="answer-equals">=</span>
           <span class="answer-result">${xDisplay}</span>
      </div>
        <div class="answer-line">
          <span class="answer-var">y</span>
             <span class="answer-equals">=</span>
         <span class="answer-result">${yDisplay}</span>
     </div>
 </div>
           </div>
    `;
  }
        }
     // ✅ КУБИЧЕСКОЕ И БИКВАДРАТНОЕ
        else if (solution.equationType === 'cubic' || solution.equationType === 'biquadratic') {
   if (solution.roots && solution.roots.length > 0) {
    // Проверяем на комплексные числа
           const hasComplex = solution.roots.some(r => typeof r.value === 'object' && r.value !== null);
      
    if (hasComplex) {
           // Есть комплексные корни - не показываем
 this.answerBox.innerHTML = `
              <div class="answer-box-no-solution">
        <div class="answer-title">Действительные корни</div>
      <div class="answer-text">Уравнение имеет комплексные корни</div>
   </div>
         `;
             } else {
          // Только действительные корни
           this.answerBox.innerHTML = `
     <div class="answer-box-success">
    <div class="answer-title">Решение</div>
      <div class="answer-values">
 ${solution.roots.map((root, i) => `
            <div class="answer-line">
    <span class="answer-var">x<span class="subscript">${solution.roots.length > 1 ? (i + 1) : ''}</span></span>
         <span class="answer-equals">=</span>
 <span class="answer-result">${root.display}</span>
         </div>
        `).join('')}
      </div>
         </div>
         `;
}
     } else {
       this.answerBox.innerHTML = `
        <div class="answer-box-no-solution">
    <div class="answer-title">Действительные корни</div>
      <div class="answer-text">Уравнение не имеет действительных корней</div>
     </div>
           `;
  }
      }
        // ✅ КВАДРАТНОЕ
      else if (solution.equationType === 'quadratic') {
    if (solution.discriminant < 0) {
      this.answerBox.innerHTML = `
      <div class="answer-box-no-solution">
        <div class="answer-title">Действительные корни</div>
           <div class="answer-text">Уравнение не имеет действительных корней (D < 0)</div>
         </div>
       `;
   } else if (solution.roots && solution.roots.length > 0) {
  this.answerBox.innerHTML = `
          <div class="answer-box-success">
        <div class="answer-title">Решение</div>
          <div class="answer-values">
            ${solution.roots.map((root, i) => `
    <div class="answer-line">
 <span class="answer-var">x<span class="subscript">${solution.roots.length > 1 ? (i + 1) : ''}</span></span>
  <span class="answer-equals">=</span>
       <span class="answer-result">${root.display}</span>
   </div>
    `).join('')}
         </div>
        </div>
    `;
          }
        }
        // ✅ ЛИНЕЙНОЕ
        else if (solution.equationType === 'linear') {
            if (solution.roots && solution.roots.length > 0) {
      this.answerBox.innerHTML = `
         <div class="answer-box-success">
    <div class="answer-title">Решение</div>
  <div class="answer-values">
    <div class="answer-line">
     <span class="answer-var">x</span>
       <span class="answer-equals">=</span>
    <span class="answer-result">${solution.roots[0].display}</span>
               </div>
   </div>
       </div>
     `;
      }
        }
  else if (solution.roots && solution.roots.length === 0) {
 this.answerBox.innerHTML = `
           <div class="answer-box-no-solution">
    <div class="answer-title">Действительные корни</div>
         <div class="answer-text">Нет решений</div>
       </div>
            `;
 } else if (solution.roots && solution.roots.length === 1) {
            const root = solution.roots[0];
      this.answerBox.innerHTML = `
              <div class="answer-box-success">
          <div class="answer-title">Решение</div>
       <div class="answer-values">
  <div class="answer-line">
      <span class="answer-var">x</span>
       <span class="answer-equals">=</span>
 <span class="answer-result">${root.display}</span>
     </div>
       </div>
 </div>
    `;
        } else if (solution.roots && solution.roots.length > 0) {
  this.answerBox.innerHTML = `
    <div class="answer-box-success">
    <div class="answer-title">Решение</div>
       <div class="answer-values">
   ${solution.roots.map((root, i) => `
  <div class="answer-line">
    <span class="answer-var">x<span class="subscript">${i + 1}</span></span>
        <span class="answer-equals">=</span>
             <span class="answer-result">${root.display}</span>
        </div>
   `).join('')}
          </div>
   </div>
      `;
        }
        
   this.updateDifficultyIndicator(solution);
    }
    
    /**
     * Обновляет индикатор сложности задачи
     */
    updateDifficultyIndicator(solution) {
        const indicator = document.getElementById('difficultyIndicator');
        if (!indicator) return;
  
    let difficulty = '★☆☆☆☆';
  let difficultyLevel = 'Легко';
        
        if (solution.equationType === 'linear') {
            difficulty = '★☆☆☆☆';
        difficultyLevel = 'Легко';
        } else if (solution.equationType === 'quadratic') {
          const D = solution.discriminant;
        if (D < 0) {
     difficulty = '★★★★★';
    difficultyLevel = 'Очень сложно';
     } else if (D === 0) {
        difficulty = '★★☆☆☆';
          difficultyLevel = 'Средне';
            } else {
   difficulty = '★★★☆☆';
         difficultyLevel = 'Среднее-сложное';
      }
        } else if (solution.equationType === 'cubic') {
 difficulty = '★★★★☆';
            difficultyLevel = 'Сложно';
        }

indicator.innerHTML = `${difficulty} ${difficultyLevel}`;
    }
    
    /**
     * Добавляет проверку решения
     */
    addVerification(solution) {
        const verificationBox = document.getElementById('verificationBox');
     if (!verificationBox || !solution.roots || solution.roots.length === 0) return;
 
  if (solution.equationType !== 'quadratic' && solution.equationType !== 'linear') {
    verificationBox.style.display = 'none';
    return;
  }
        
verificationBox.style.display = 'block';
        verificationBox.innerHTML = '<div class="verification-title">Проверка решения:</div>';
        
      solution.roots.forEach((root, i) => {
            // Пропускаем комплексные корни и специальные значения
    if (typeof root.value !== 'number' || root.value === Infinity || !isFinite(root.value)) {
   return;
 }
            
const x = root.value;
            
         // Для квадратного уравнения: y = ax² + bx + c
       let result;
      if (solution.a !== undefined && solution.b !== undefined && solution.c !== undefined) {
       result = solution.a * x * x + solution.b * x + solution.c;
      } else {
            return; // Нет коэффициентов для проверки
}
       
 const resultDisplay = Math.abs(result) < 0.0001 ? '0' : formatNumber(result, 4);
            const verification = Math.abs(result) < 0.0001 ? 'OK' : 'Ошибка';
     
            const item = document.createElement('div');
       item.className = 'verification-item';
    item.innerHTML = `${verification} x${solution.roots.length > 1 ? (i + 1) : ''} = ${root.display}<br>` +
    `${solution.a}·(${root.display})² + ${solution.b}·(${root.display}) + ${solution.c} = ${resultDisplay}`;
 
    verificationBox.appendChild(item);
        });
    }
    
    /**
     * Форматирует число
     */
    formatNumber(num) {
 if (Math.abs(num) < 0.0001) return '0';
    if (Math.abs(num - Math.round(num)) < 0.0001) return Math.round(num).toString();
        return num.toFixed(2);
 }
    
    /**
     * Скрывает решение
     */
    hideSolution() {
        if (this.solutionSection) {
this.solutionSection.style.display = 'none';
   }
        if (this.solutionControls) {
            this.solutionControls.style.display = 'none';
  }
        if (this.graphSection) {
     this.graphSection.style.display = 'none';
 }
        this.currentSolution = null;
    }
    
    /**
     * Переключает режим детальности
     */
    toggleDetailedMode() {
        if (this.detailToggle) {
   this.isDetailedMode = this.detailToggle.checked;
    }
        
        if (this.currentSolution) {
    this.displaySolution(this.currentSolution);
        }
    }
    
    /**
     * Копирует решение в буфер обмена
     */
    copySolution() {
        if (!this.currentSolution) return;
        
        const text = this.getSolutionText();
    navigator.clipboard.writeText(text).then(() => {
       this.showNotification('Решение скопировано', 'success');
 }).catch(err => {
            this.showNotification('Ошибка при копировании', 'error');
 console.error(err);
        });
    }
    
    /**
     * Экспортирует решение в файл
   */
    exportSolution() {
        if (!this.currentSolution) return;
        
        const text = this.getSolutionText();
  const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', 'решение.txt');
     element.style.display = 'none';
  document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        
        this.showNotification('Решение скачано', 'success');
    }
    
    /**
     * Получает текст решения
     */
    getSolutionText() {
        if (!this.currentSolution) return '';
        
        const solution = this.currentSolution;
        let text = `РЕШЕНИЕ УРАВНЕНИЯ\n`;
        text += `${'='.repeat(50)}\n\n`;
//
        text += `Исходное уравнение: ${solution.equation}\n\n`;
//
        text += `ПОШАГОВОЕ РЕШЕНИЕ:\n`;
     text += `${'-'.repeat(50)}\n`;


        
        if (solution.steps) {
       solution.steps.forEach((step, index) => {
      text += `\n${index + 1}. ${step.title}\n`;
       text += `${step.content.replace(/<br>/g, '\n').replace(/<[^>]*>/g, '')}\n`;
            });
        }
     
   text += `\n${'='.repeat(50)}\n`;


   if (solution.equationType === 'system') {
     text += `Решение системы уравнений:\n`;
         if (solution.solution) {
             const { x, y } = solution.solution;
        const xDisplay = typeof x === 'number' ? x.toFixed(4) : x;
         const yDisplay = typeof y === 'number' ? y.toFixed(4) : y;
     
     text += `x = ${xDisplay}\n`;
      text += `y = ${yDisplay}\n`;
            }
    } else {
        text += `ОТВЕТ:\n`;
  text += `${'-'.repeat(50)}\n`;;
        
        if (solution.roots.length === 0) {
  text += 'Нет решений';
 } else if (solution.roots[0].value === '∞') {
     text += 'Бесконечно много решений';
   } else {
  text += solution.roots.map((root, i) => `x${solution.roots.length === 1 ? '' : (i + 1)} = ${root.display}`).join('\n');
        }
   }
        
        text += `\n\nСоздано: ${new Date().toLocaleString('ru-RU')}`;
   
        return text;
    }
    
    /**
     * Показывает уведомление
     */
    showNotification(message, type = 'info') {
        if (!this.notification) return;
        
        this.notification.textContent = message;
        this.notification.className = `notification show ${type}`;
        
     setTimeout(() => {
            this.notification.classList.remove('show');
      }, 3000);
  }
    
    /**
   * Обновляет историю - с кликабельностью
     */
    updateHistory(historyItems) {
        if (!this.historyList) {
     console.warn('History list element not found');
      return;
   }
     
    this.historyList.innerHTML = '';
      
  if (historyItems.length === 0) {
    if (this.historySection) {
      this.historySection.style.display = 'none';
     }
       return;
        }
        
  if (this.historySection) {
            this.historySection.style.display = 'block';
    }
        
     historyItems.forEach((item) => {
  const itemEl = document.createElement('div');
    itemEl.className = 'history-item';
        
     // ✅ ВСЯ ИСТОРИЯ КЛИКАБЕЛЬНА
        itemEl.style.cursor = 'pointer';
       itemEl.innerHTML = `
         <div class="history-content">
         <div class="history-equation">${this.escapeHtml(item.equation)}</div>
      <div class="history-time">${item.displayDate || 'без даты'}</div>
    </div>
    <button class="history-delete" title="Удалить">×</button>
     `;
         
// ✅ КЛИК ПО ВСЕЙ СТРОКЕ (кроме кнопки удаления) - ЗАГРУЖАЕТ РЕШЕНИЕ
     const contentArea = itemEl.querySelector('.history-content');
     contentArea.addEventListener('click', () => {
     // Загружаем коэффициенты из истории
           const data = item.data || {};

           const currentType = item.type || item.solution?.equationType || window.app?.currentEquationType;

           if (window.app && currentType) {
               window.app.currentEquationType = currentType;
           }

           if (currentType) {
               const typeBtn = document.querySelector(`.equation-type-btn[data-type="${currentType}"]`);
               if (typeBtn) typeBtn.click();
           }

           if (currentType === 'system') {
               const a1 = document.getElementById('a1');
               const b1 = document.getElementById('b1');
               const c1 = document.getElementById('c1');
               const a2 = document.getElementById('a2');
               const b2 = document.getElementById('b2');
               const c2 = document.getElementById('c2');

               if (a1) a1.value = data.a1 ?? '';
               if (b1) b1.value = data.b1 ?? '';
               if (c1) c1.value = data.c1 ?? '';
               if (a2) a2.value = data.a2 ?? '';
               if (b2) b2.value = data.b2 ?? '';
               if (c2) c2.value = data.c2 ?? '';

               [a1, b1, c1, a2, b2, c2].forEach(el => {
                   if (el && el.value) el.classList.add('success');
               });
           } else if (currentType === 'rational') {
               const numerator = document.getElementById('numerator');
               const denominator = document.getElementById('denominator');

               if (numerator) numerator.value = data.numerator ?? '';
               if (denominator) denominator.value = data.denominator ?? '';

               [numerator, denominator].forEach(el => {
                   if (el && el.value) el.classList.add('success');
               });
           } else {
           const coeffA = document.getElementById('coeffA');
       const coeffB = document.getElementById('coeffB');
     const coeffC = document.getElementById('coeffC');
   const coeffD = document.getElementById('coeffD');
      
               if (coeffA && data.a !== undefined) coeffA.value = data.a;
               if (coeffB && data.b !== undefined) coeffB.value = data.b;
               if (coeffC && data.c !== undefined) coeffC.value = data.c;
               if (coeffD && data.d !== undefined) coeffD.value = data.d;

               // Подсвечиваем поля
               [coeffA, coeffB, coeffC, coeffD]
                   .filter(el => el)
                   .forEach(el => {
                       if (el.value) el.classList.add('success');
                   });
           }
        
    // ✅ АВТОМАТИЧЕСКИ РЕШАЕМ
      setTimeout(() => this.onSolveClick(), 100);
  });
  
     // Кнопка удаления
   itemEl.querySelector('.history-delete').addEventListener('click', (e) => {
e.stopPropagation();
    window.dispatchEvent(new CustomEvent('delete-from-history', {
     detail: { equation: item.equation }
     }));
  });
       
 this.historyList.appendChild(itemEl);
   });
    }
    
    /**
     * Экранирует HTML для безопасности
     */
    escapeHtml(text) {
  const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    /**
     * Очищает историю
     */
    clearHistory() {
        const modal = document.getElementById('confirmClearHistoryModal');
        if (!modal) {
            window.dispatchEvent(new CustomEvent('clear-history'));
            if (this.historySection) {
                this.historySection.style.display = 'none';
            }
            this.showNotification('История очищена', 'success');
            return;
        }

        const confirmBtn = document.getElementById('confirmClearHistoryBtn');
        const cancelBtn = document.getElementById('cancelClearHistoryBtn');
        const closeBtn = modal.querySelector('.modal-close');

        const closeModal = () => {
            modal.classList.remove('show');
        };

        const confirmHandler = () => {
            window.dispatchEvent(new CustomEvent('clear-history'));
            if (this.historySection) {
                this.historySection.style.display = 'none';
            }
            this.showNotification('История очищена', 'success');
            closeModal();
        };

        if (confirmBtn) confirmBtn.onclick = confirmHandler;
        if (cancelBtn) cancelBtn.onclick = closeModal;
        if (closeBtn) closeBtn.onclick = closeModal;
        modal.onclick = (e) => {
            if (e.target === modal) closeModal();
        };

        modal.classList.add('show');
    }
    
    /**
     * Генерирует случайное уравнение для текущего типа
     */
    generateEquation() {
        const currentType = window.app?.currentEquationType || 'quadratic';
  const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
        
        try {
    if (currentType === 'quadratic') {
        const eq = generateRandomEquation();
            const coeffA = document.getElementById('coeffA');
         const coeffB = document.getElementById('coeffB');
        const coeffC = document.getElementById('coeffC');
              
         if (coeffA) coeffA.value = eq.a;
    if (coeffB) coeffB.value = eq.b;
                if (coeffC) coeffC.value = eq.c;
          this.showNotification('Квадратное уравнение сгенерировано', 'info');
         }
        else if (currentType === 'linear') {
              // ✅ ЛИНЕЙНЫЕ УРАВНЕНИЯ
          const linearExamples = [
         { a: 2, b: -4 }, { a: -3, b: 9 }, { a: 5, b: 10 },
         { a: -2, b: -6 }, { a: 7, b: -14 }, { a: 3, b: -9 },
          { a: -4, b: 8 }, { a: 6, b: 12 }, { a: -5, b: -15 },
          { a: 4, b: -20 }, { a: 1, b: -7 }, { a: 2, b: -5 },
            { a: 3, b: -7 }, { a: 2, b: 3 }, { a: 5, b: -9 }
          ];
 const randomEq = linearExamples[getRandomInt(0, linearExamples.length - 1)];
        const coeffA = document.getElementById('coeffA');
  const coeffB = document.getElementById('coeffB');
        
    if (coeffA) coeffA.value = randomEq.a;
                if (coeffB) coeffB.value = randomEq.b;
         this.showNotification(`${randomEq.a}x + ${randomEq.b} = 0`, 'info');
            }
 else if (currentType === 'cubic') {
      // ✅ КУБИЧЕСКИЕ УРАВНЕНИЯ
          const cubicExamples = [
        { a: 1, b: 0, c: -3, d: 0 }, { a: 1, b: 0, c: 0, d: -8 },
      { a: 1, b: -5, c: 6, d: 0 }, { a: 1, b: -4, c: 5, d: -2 },
          { a: 1, b: -6, c: 11, d: -6 }, { a: 2, b: -8, c: 10, d: -3 },
  { a: 1, b: 0, c: -4, d: 0 }, { a: 1, b: -1, c: -2, d: 0 },
            { a: 1, b: -3, c: 2, d: 0 }, { a: 1, b: 0, c: 0, d: -1 },
        { a: 2, b: 0, c: -18, d: 0 }, { a: 1, b: -2, c: 0, d: 0 },
         { a: 3, b: 0, c: -12, d: 0 }, { a: 1, b: 0, c: -9, d: 0 },
             { a: 2, b: -6, c: 4, d: 0 }
    ];
                const randomEq = cubicExamples[getRandomInt(0, cubicExamples.length - 1)];
             const coeffA = document.getElementById('coeffA');
         const coeffB = document.getElementById('coeffB');
  const coeffC = document.getElementById('coeffC');
   const coeffD = document.getElementById('coeffD');
      
      if (coeffA) coeffA.value = randomEq.a;
    if (coeffB) coeffB.value = randomEq.b;
      if (coeffC) coeffC.value = randomEq.c;
           if (coeffD) coeffD.value = randomEq.d;
           this.showNotification(`Кубическое уравнение сгенерировано`, 'info');
            }
     else if (currentType === 'biquadratic') {
         // ✅ БИКВАДРАТНЫЕ УРАВНЕНИЯ
           const biquadraticExamples = [
      { a: 1, b: -5, c: 4 }, { a: 1, b: -10, c: 9 },
           { a: 1, b: -13, c: 36 }, { a: 1, b: -5, c: 6 },
    { a: 1, b: -8, c: 12 }, { a: 1, b: -2, c: 1 },
  { a: 1, b: 0, c: -16 }, { a: 1, b: -6, c: 9 },
   { a: 1, b: 0, c: -4 }, { a: 1, b: -7, c: 12 },
   { a: 2, b: -8, c: 6 }, { a: 1, b: -3, c: 2 },
  { a: 3, b: -12, c: 9 }, { a: 1, b: -4, c: 3 },
         { a: 2, b: -10, c: 8 }
       ];
     const randomEq = biquadraticExamples[getRandomInt(0, biquadraticExamples.length - 1)];
     const coeffA = document.getElementById('coeffA');
       const coeffB = document.getElementById('coeffB');
                const coeffC = document.getElementById('coeffC');
   
        if (coeffA) coeffA.value = randomEq.a;
                if (coeffB) coeffB.value = randomEq.b;
       if (coeffC) coeffC.value = randomEq.c;
                this.showNotification(`Биквадратное уравнение сгенерировано`, 'info');
      }
            else if (currentType === 'system') {
  // ✅ СИСТЕМЫ УРАВНЕНИЙ
 const systemExamples = [
            { a1: 2, b1: 3, c1: 5, a2: 1, b2: -1, c2: 2 },
              { a1: 1, b1: 1, c1: 5, a2: 2, b2: -1, c2: 4 },
           { a1: 3, b1: 2, c1: 8, a2: 1, b2: -1, c2: 2 },
         { a1: 4, b1: 5, c1: 13, a2: 2, b2: 3, c2: 7 },
              { a1: 1, b1: 2, c1: 7, a2: 2, b2: 1, c2: 8 },
 { a1: 3, b1: -1, c1: 7, a2: 2, b2: 3, c2: 10 },
     { a1: 2, b1: -1, c1: 3, a2: 1, b2: 3, c2: 8 },
         { a1: 5, b1: 1, c1: 6, a2: 2, b2: 2, c2: 4 },
      { a1: 1, b1: -2, c1: 1, a2: 3, b2: 1, c2: 9 },
   { a1: 2, b1: 3, c1: 9, a2: 3, b2: 2, c2: 10 }
     ];
          const randomEq = systemExamples[getRandomInt(0, systemExamples.length - 1)];
      const a1El = document.getElementById('a1');
       const b1El = document.getElementById('b1');
           const c1El = document.getElementById('c1');
             const a2El = document.getElementById('a2');
         const b2El = document.getElementById('b2');
     const c2El = document.getElementById('c2');
    
    if (a1El) a1El.value = randomEq.a1;
   if (b1El) b1El.value = randomEq.b1;
                if (c1El) c1El.value = randomEq.c1;
if (a2El) a2El.value = randomEq.a2;
     if (b2El) b2El.value = randomEq.b2;
           if (c2El) c2El.value = randomEq.c2;
         this.showNotification(`Система уравнений сгенерирована`, 'info');
         }
         else if (currentType === 'rational') {
     const numerators = ['x - 1', 'x + 2', 'x - 3', 'x + 5', '2x - 4'];
 const denominators = ['x + 1', 'x - 2', 'x + 3', 'x - 1', '2x + 2'];
     const num = numerators[getRandomInt(0, numerators.length - 1)];
        const denom = denominators[getRandomInt(0, denominators.length - 1)];
          const numeratorEl = document.getElementById('numerator');
 const denominatorEl = document.getElementById('denominator');
             
            
       if (numeratorEl) numeratorEl.value = num;
       if (denominatorEl) denominatorEl.value = denom;
           this.showNotification(`Рациональное уравнение сгенерировано`, 'info');
            }
         
  // Подсвечиваем поля успеха
            const inputs = document.querySelectorAll('.form-input');
            inputs.forEach(input => {
       if (input.value && input.value.trim()) {
         input.classList.add('success');
      }
            });
        } catch(e) {
          console.error('Error generating equation:', e);
this.showNotification('Ошибка при генерации', 'error');
        }
    }
}
