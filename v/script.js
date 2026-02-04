/* ==========================================
   ГЛАВНЫЙ СКРИПТ v4 - ПОЛНОСТЬЮ ПЕРЕДЕЛАН
   ========================================== */

import { QuadraticSolver, generateRandomEquation, CubicSolver, LinearSystemSolver, BiquadraticSolver, RationalSolver } from './solver.js';
import { UIManager } from './ui_manager.js';
import { GraphManager } from './graph.js';
import { HistoryManager } from './history.js';
import { VirtualKeyboard } from './virtual_keyboard.js';

class EquationSolverApp {
    constructor() {
    this.uiManager = new UIManager();
        this.historyManager = new HistoryManager();
  this.currentEquationType = 'quadratic';
        this.currentSolution = null;
        
        console.log('Приложение инициализировано');
        this.bindAllEvents();
        this.initializeUI();
    }

    bindAllEvents() {
        // Выбор типа уравнения
        document.querySelectorAll('.equation-type-btn').forEach(btn => {
   btn.addEventListener('click', () => this.selectEquationType(btn));
        });

        // Режимы ввода
        document.querySelectorAll('input[name="input-mode"]').forEach(radio => {
       radio.addEventListener('change', (e) => this.switchInputMode(e.target.value));
   });

        // Форма ввода
     const equationForm = document.getElementById('equationForm');
        if (equationForm) {
      equationForm.addEventListener('submit', (e) => {
          e.preventDefault();
   this.uiManager.onSolveClick();
    });
        }

        const clearBtn = document.getElementById('clearBtn');
        if (clearBtn) {
    clearBtn.addEventListener('click', () => this.uiManager.clearForm());
        }

   // Решение уравнения через событие
        window.addEventListener('solve-equation', (e) => {
            this.solveEquation(e.detail);
        });

        // Удаление из истории
    window.addEventListener('delete-from-history', (e) => {
          this.historyManager.removeSolution(e.detail.equation);
     this.updateHistoryDisplay();
        });

    // Очистка истории
        window.addEventListener('clear-history', () => {
            this.historyManager.clearHistory();
        this.updateHistoryDisplay();
        });

      // Кнопки действий
        const solveNaturalBtn = document.getElementById('solveNaturalBtn');
     if (solveNaturalBtn) {
            solveNaturalBtn.addEventListener('click', () => {
           this.solveNaturalInput();
            });
   }

        const copyBtn = document.getElementById('copyBtn');
      if (copyBtn) {
   copyBtn.addEventListener('click', () => {
            this.uiManager.copySolution();
  });
        }

        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
exportBtn.addEventListener('click', () => {
  this.exportSolution();
       });
        }

     const shareBtn = document.getElementById('shareBtn');
 if (shareBtn) {
         shareBtn.addEventListener('click', () => {
  this.showShareModal();
      });
      }

        // Генератор уравнений
     const generateBtn = document.getElementById('generateBtn');
     if (generateBtn) {
      generateBtn.addEventListener('click', () => {
          this.uiManager.generateEquation();
  });
      }

        // Расширенные настройки
        const advancedBtn = document.getElementById('advancedBtn');
    if (advancedBtn) {
        advancedBtn.addEventListener('click', () => {
                this.showSettingsModal();
            });
        }

        // Тема
        const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

    // История
        const historyFilter = document.getElementById('historyFilter');
   if (historyFilter) {
        historyFilter.addEventListener('change', () => {
       this.updateHistoryDisplay();
       });
    }

   const clearHistoryBtn = document.getElementById('clearHistoryBtn');
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', () => {
      this.uiManager.clearHistory();
            });
        }

        // Закрытие модалей
   document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
             e.target.closest('.modal')?.classList.remove('show');
            });
        });

        // Resize окна
        window.addEventListener('resize', () => {
         if (window.graphManager) {
   const canvas = document.getElementById('graphCanvas');
   const rect = canvas?.getBoundingClientRect();
      if (rect) {
    window.graphManager.resize(rect.width, rect.height);
 }
       }
    });
    }

    initializeUI() {
        const quadraticBtn = document.querySelector('[data-type="quadratic"]');
   if (quadraticBtn) {
            this.selectEquationType(quadraticBtn);
        }
     
        this.uiManager.setupCoefficients();
        this.updateHistoryDisplay();
 this.loadTheory();
  this.loadExamples();
        
        const graphSection = document.getElementById('graphSection');
        if (graphSection) {
    const canvas = document.getElementById('graphCanvas');
    if (canvas) {
     const rect = canvas.getBoundingClientRect();
     const w = rect?.width || Math.min(800, window.innerWidth - 60);
     const h = rect?.height || 500;
     canvas.width = w;
     canvas.height = h;
     if (window.graphManager) {
         window.graphManager.resize(w, h);
     }
 }
        }

        const historySection = document.getElementById('historySection');
        if (historySection && this.historyManager.getHistory().length === 0) {
        historySection.style.display = 'none';
 }

        // ✅ Привязываем навигацию, теорию и графики ОДИН РАЗ
        setTimeout(() => {
          this.bindNavigationEvents();
         this.bindTheoryEvents();
 this.bindGraphicsEvents();
  }, 50);
    }

    bindNavigationEvents() {
        document.querySelectorAll('.nav-link').forEach(link => {
   link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
          e.preventDefault();
   const target = document.querySelector(href);
   if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
           }
 });
 });
    }

    bindTheoryEvents() {
     document.querySelectorAll('.tab-btn').forEach(btn => {
       btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tabName = btn.dataset.tab;
           
   document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
   btn.classList.add('active');
    
        this.switchTheoryTab(tabName);
});
     });
    }

 bindGraphicsEvents() {
        const zoomInBtn = document.getElementById('zoomInBtn');
const zoomOutBtn = document.getElementById('zoomOutBtn');
        const resetZoomBtn = document.getElementById('resetZoomBtn');
        const autoScaleBtn = document.getElementById('autoScaleBtn');
        const graphTypeSelect = document.getElementById('graphType');

        if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => {
       if (window.graphManager) window.graphManager.zoomIn();
            });
        }

        if (zoomOutBtn) {
          zoomOutBtn.addEventListener('click', () => {
          if (window.graphManager) window.graphManager.zoomOut();
    });
    }

        if (resetZoomBtn) {
            resetZoomBtn.addEventListener('click', () => {
    if (window.graphManager) window.graphManager.resetZoom();
         });
     }

        if (autoScaleBtn) {
          autoScaleBtn.addEventListener('click', () => {
      if (window.graphManager) window.graphManager.autoScale();
      });
     }

   if (graphTypeSelect) {
graphTypeSelect.addEventListener('change', (e) => {
    if (window.graphManager) {
 window.graphManager.setGraphType(e.target.value);
     }
      });
  }
    }

    selectEquationType(btn) {
        if (!btn) return;
        
        document.querySelectorAll('.equation-type-btn').forEach(b => {
            b.classList.remove('active');
     });
  btn.classList.add('active');
        this.currentEquationType = btn.dataset.type;
        this.updateFormInputs();
        this.uiManager.setupCoefficients();
        
        // ✅ ЗАГРУЖАЕМ ПРИМЕРЫ ДЛЯ НОВОГО ТИПА
   this.loadExamples();
    }

  updateFormInputs() {
        const formInputs = document.getElementById('form-inputs');
        if (!formInputs) return;
        
        formInputs.innerHTML = '';

        const inputConfigs = {
quadratic: [
        { id: 'coeffA', label: 'Коэффициент a (x²)', placeholder: '1' },
           { id: 'coeffB', label: 'Коэффициент b (x)', placeholder: '-5' },
         { id: 'coeffC', label: 'Коэффициент c', placeholder: '6' }
            ],
          linear: [
    { id: 'coeffA', label: 'Коэффициент a (x)', placeholder: '2' },
       { id: 'coeffB', label: 'Коэффициент b', placeholder: '-4' }
         ],
   cubic: [
            { id: 'coeffA', label: 'a (x³)', placeholder: '1' },
      { id: 'coeffB', label: 'b (x²)', placeholder: '0' },
              { id: 'coeffC', label: 'c (x)', placeholder: '-3' },
    { id: 'coeffD', label: 'd', placeholder: '0' }
  ],
            biquadratic: [
    { id: 'coeffA', label: 'a (x⁴)', placeholder: '1' },
      { id: 'coeffB', label: 'b (x²)', placeholder: '-5' },
                { id: 'coeffC', label: 'c', placeholder: '4' }
     ],
     system: [
        { id: 'a1', label: 'a₁ (1-е уравнение)', placeholder: '2' },
        { id: 'b1', label: 'b₁', placeholder: '3' },
          { id: 'c1', label: 'c₁', placeholder: '5' },
  { id: 'a2', label: 'a₂ (2-e уравнение)', placeholder: '1' },
                { id: 'b2', label: 'b₂', placeholder: '-1' },
      { id: 'c2', label: 'c₂', placeholder: '2' }
        ],
       rational: [
     { id: 'numerator', label: 'Числитель', placeholder: 'x - 1' },
           { id: 'denominator', label: 'Знаменатель', placeholder: 'x + 2' }
          ]
   };

        const config = inputConfigs[this.currentEquationType] || inputConfigs.quadratic;

        config.forEach(field => {
            const group = document.createElement('div');
          group.className = 'input-group';
      group.innerHTML = `
    <label for="${field.id}">${field.label}</label>
        <input 
      type="text" 
  id="${field.id}" 
     placeholder="${field.placeholder}"
 class="form-input"
     aria-label="${field.label}"
          >
    <span class="error-message" id="${field.id}-error"></span>
        `;
     formInputs.appendChild(group);
        });
    }

    switchInputMode(mode) {
  const formInputsContainer = document.querySelector('.form-inputs')?.parentElement;
        const naturalInput = document.querySelector('.natural-input-wrapper');

        if (!formInputsContainer || !naturalInput) return;

        if (mode === 'natural') {
   formInputsContainer.style.display = 'none';
     naturalInput.style.display = 'block';
        } else {
   formInputsContainer.style.display = 'grid';
            naturalInput.style.display = 'none';
  }
    }

    solveEquation(details = {}) {
        try {
            let solution;
   
            // ✅ ВАЖНО: Используем правильный solver в зависимости от типа уравнения
      switch(this.currentEquationType) {
           case 'linear': {
  const a = details.coefficients?.a || parseFloat(details.a);
  const b = details.coefficients?.b || parseFloat(details.b);
        const solver = new QuadraticSolver(0, a, b); // a=0 для линейного
      solution = solver.solve();
       break;
    }
        case 'cubic': {
    const a = details.coefficients?.a || parseFloat(details.a);
            const b = details.coefficients?.b || parseFloat(details.b);
 const c = details.coefficients?.c || parseFloat(details.c);
          const d = details.coefficients?.d || parseFloat(details.d || '0');
          const solver = new CubicSolver(a, b, c, d);
  solution = solver.solve();
    break;
  }
           case 'biquadratic': {
  const a = details.coefficients?.a || parseFloat(details.a);
             const b = details.coefficients?.b || parseFloat(details.b);
   const c = details.coefficients?.c || parseFloat(details.c);
          const solver = new BiquadraticSolver(a, b, c);
    solution = solver.solve();
  break;
 }
     case 'system': {
 const a1 = details.coefficients?.a1 || parseFloat(details.a1);
     const b1 = details.coefficients?.b1 || parseFloat(details.b1);
      const c1 = details.coefficients?.c1 || parseFloat(details.c1);
     const a2 = details.coefficients?.a2 || parseFloat(details.a2);
   const b2 = details.coefficients?.b2 || parseFloat(details.b2);
  const c2 = details.coefficients?.c2 || parseFloat(details.c2);
 const solver = new LinearSystemSolver(a1, b1, c1, a2, b2, c2);
     solution = solver.solve();
     break;
      }
    case 'rational': {
 const numerator = document.getElementById('numerator')?.value || details.numerator || '';
          const denominator = document.getElementById('denominator')?.value || details.denominator || '';
 
        if (!numerator || !denominator) {
      this.showNotification('Введите числитель и знаменатель', 'error');
     return;
   }
         
          const solver = new RationalSolver(numerator, denominator);
           solution = solver.solve();
        break;
      }
         case 'quadratic':
      default: {
   const a = details.coefficients?.a || parseFloat(details.a);
         const b = details.coefficients?.b || parseFloat(details.b);
      const c = details.coefficients?.c || parseFloat(details.c);
     const solver = new QuadraticSolver(a, b, c);
      solution = solver.solve();
     break;
         }
    }

            if (!solution.success) {
        this.showNotification(solution.error || solution.message, 'error');
       return;
  }

     // ✅ Сохраняем коэффициенты в solution для корректной верификации и построения графика
            if (this.currentEquationType === 'quadratic') {
solution.a = details.coefficients?.a ?? parseFloat(details.a);
 solution.b = details.coefficients?.b ?? parseFloat(details.b);
        solution.c = details.coefficients?.c ?? parseFloat(details.c);
            } else if (this.currentEquationType === 'linear') {
                solution.a = details.coefficients?.a ?? parseFloat(details.a);
                solution.b = details.coefficients?.b ?? parseFloat(details.b);
            } else if (this.currentEquationType === 'cubic') {
                solution.a = details.coefficients?.a ?? parseFloat(details.a);
                solution.b = details.coefficients?.b ?? parseFloat(details.b);
                solution.c = details.coefficients?.c ?? parseFloat(details.c);
                solution.d = details.coefficients?.d ?? parseFloat(details.d || '0');
            } else if (this.currentEquationType === 'biquadratic') {
                solution.a = details.coefficients?.a ?? parseFloat(details.a);
                solution.b = details.coefficients?.b ?? parseFloat(details.b);
                solution.c = details.coefficients?.c ?? parseFloat(details.c);
            }

            this.currentSolution = solution;
            this.uiManager.displaySolution(solution);

            // ✅ Графики только для функций (не для систем и рациональных)
      if (this.currentEquationType === 'quadratic' || 
          this.currentEquationType === 'linear' || 
          this.currentEquationType === 'cubic' ||
       this.currentEquationType === 'biquadratic' ||
          this.currentEquationType === 'rational') {
        // Только для этих типов есть функции y = f(x)
     if (solution.a !== 0 || solution.b !== 0 || (solution.c !== undefined)) {
     this.displayGraph(solution);
 }
 }

    // История
            this.historyManager.addSolution(details, solution);
            this.updateHistoryDisplay();

   this.showNotification('Уравнение успешно решено', 'success');
   } catch (err) {
       console.error(err);
            this.showNotification('Ошибка при решении уравнения: ' + err.message, 'error');
        }
    }

    solveNaturalInput() {
 const input = document.getElementById('naturalInput');
        if (!input) {
       this.showNotification('Элемент ввода не найден', 'error');
     return;
        }

        const inputText = input.value;
        const parts = inputText.match(/(-?\d+(?:\.\d+)?)[x²]?/g) || [];
        
  if (parts.length >= 3) {
            window.dispatchEvent(new CustomEvent('solve-equation', {
        detail: {
              a: parts[0],
      b: parts[1],
    c: parts[2],
   coefficients: { 
      a: parseFloat(parts[0]), 
      b: parseFloat(parts[1]), 
              c: parseFloat(parts[2]) 
    }
         }
   }));
        } else {
    this.showNotification('Некорректный формат. Пример: x² - 5x + 6 = 0', 'error');
        }
    }

    displayGraph(solution) {
        const graphSection = document.getElementById('graphSection');
        const canvas = document.getElementById('graphCanvas');
        const controlSection = document.getElementById('graphControls');

        if (!graphSection || !canvas) {
   console.warn('Graph elements not found');
            return;
        }

     graphSection.style.display = 'block';
        if (controlSection) {
     controlSection.style.display = 'flex';
        }

    const container = graphSection.querySelector('.graph-container');
        const width = container ? Math.max(300, container.offsetWidth - 40) : 800;
        const height = Math.min(500, window.innerHeight - 300);

        canvas.width = width;
    canvas.height = height;
        canvas.style.display = 'block';

        try {
    if (window.graphManager) {
           delete window.graphManager;
        }
       window.graphManager = new GraphManager(canvas, solution);
            graphSection.scrollIntoView({ behavior: 'smooth' });
        } catch (err) {
            console.error('Error drawing graph:', err);
  this.showNotification('Ошибка при построении графика', 'error');
      }
    }

    exportSolution() {
        if (!this.currentSolution) {
      this.showNotification('Нет решения для экспорта', 'error');
        return;
        }

        const text = this.uiManager.getSolutionText?.() || 'Решение';
     const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', 'решение.txt');
        element.style.display = 'none';
        document.body.appendChild(element);
     element.click();
      document.body.removeChild(element);

 this.showNotification('Решение экспортировано', 'success');
    }

showShareModal() {
        const modal = document.getElementById('shareModal');
    if (!modal) return;

        const shareLink = document.getElementById('shareLink');
        if (shareLink && this.currentSolution) {
       const url = window.location.href + '?solution=' + btoa(JSON.stringify(this.currentSolution));
      shareLink.value = url;
 }

        modal.classList.add('show');

document.getElementById('copyShareLink')?.addEventListener('click', () => {
            const shareLink = document.getElementById('shareLink');
   if (shareLink) {
           navigator.clipboard.writeText(shareLink.value);
  this.showNotification('Ссылка скопирована', 'success');
}
        });
    }

    showSettingsModal() {
        const modal = document.getElementById('settingsModal');
        if (!modal) return;

    const settingsContent = document.getElementById('settingsContent');
   if (settingsContent) {
     settingsContent.innerHTML = `
     <div class="input-group">
     <label for="precision">Точность вычислений:</label>
      <input type="number" id="precision" min="1" max="15" value="6" class="form-input">
                </div>
     <div class="input-group">
    <label for="decimals">Знаков после запятой:</label>
         <input type="number" id="decimals" min="0" max="10" value="6" class="form-input">
        </div>
     <button class="btn btn-primary" style="width: 100%; margin-top: 1rem;">Применить</button>
    `;
        }

        modal.classList.add('show');
    }

    updateHistoryDisplay() {
        const history = this.historyManager.getHistory();
        this.uiManager.updateHistory(history);
    }

    loadTheory() {
      const theories = {
      'quadratic-theory': `
  <details open>
   <summary>Определение квадратного уравнения</summary>
    <div class="theory-text">
             <p><strong>Квадратное уравнение</strong> — это уравнение вида:</p>
                <p><strong>ax² + bx + c = 0</strong>, где <strong>a ≠ 0</strong></p>
            <p><strong>a</strong>, <strong>b</strong>, <strong>c</strong> — коэффициенты уравнения</p>
           </div>
      </details>
          <details>
      <summary>Дискриминант и его значение</summary>
              <div class="theory-text">
          <p><strong>Дискриминант (D)</strong> определяет количество решений:</p>
       <p><strong>D = b² - 4ac</strong></p>
       <ul>
           <li><strong>D > 0</strong> → два различных действительных корня</li>
   <li><strong>D = 0</strong> → один корень кратности 2</li>
       <li><strong>D < 0</strong> → два комплексно-сопряженных корня</li>
      </ul>
     </div>
        </details>
        <details>
    <summary>Формула корней</summary>
           <div class="theory-text">
              <p>Корни квадратного уравнения вычисляются по формуле:</p>
       <p><strong>x = (-b ± √D) / (2a)</strong></p>
  <p>где <strong>D = b² - 4ac</strong> — дискриминант</p>
      </div>
     </details>
            `,
            'linear-theory': `
    <details open>
             <summary>Линейное уравнение</summary>
   <div class="theory-text">
   <p><strong>Линейное уравнение</strong> имеет вид:</p>
  <p><strong>ax + b = 0</strong>, где <strong>a ≠ 0</strong></p>
   <p><strong>Решение:</strong> <strong>x = -b/a</strong></p>
          </div>
        </details>
     `,
        'cubic-theory': `
     <details open>
      <summary>Кубическое уравнение</summary>
             <div class="theory-text">
     <p><strong>Кубическое уравнение</strong> имеет вид:</p>
           <p><strong>ax³ + bx² + cx + d = 0</strong>, где <strong>a ≠ 0</strong></p>
       <p>Кубическое уравнение всегда имеет <strong>хотя бы один действительный корень</strong></p>
       </div>
</details>
 `,
			'biquadratic-theory': `
			<details open>
				<summary>Биквадратное уравнение</summary>
				<div class="theory-text">
					<p><strong>Биквадратное уравнение</strong> имеет вид:</p>
					<p><strong>ax⁴ + bx² + c = 0</strong>, где <strong>a ≠ 0</strong></p>
					<p>Подстановка: <strong>t = x²</strong> → <strong>at² + bt + c = 0</strong></p>
					<p>Из t восстанавливаем x с учётом:</p>
					<ul>
						<li>t &gt; 0: x = ±√t</li>
						<li>t = 0: x = 0</li>
						<li>t &lt; 0: нет действительных корней</li>
					</ul>
				</div>
			</details>
			`,
			'rational-theory': `
			<details open>
				<summary>Рациональные уравнения</summary>
				<div class="theory-text">
					<p><strong>Рациональное уравнение</strong> имеет вид:</p>
					<p><strong>P(x)/Q(x) = 0</strong></p>
					<p>Алгоритм:</p>
					<ul>
						<li>Решаем <strong>P(x) = 0</strong></li>
						<li>И обязательно учесть <strong>ОДЗ: Q(x) ≠ 0</strong></li>
					</ul>
					<p>График рациональной функции имеет разрывы в нулях знаменателя.</p>
				</div>
			</details>
			`,
            'vieta-theory': `
   <details open>
        <summary>Теорема Виета</summary>
         <div class="theory-text">
       <p>Если x₁ и x₂ — корни ax² + bx + c = 0:</p>
              <ul>
      <li>x₁ + x₂ = -b/a</li>
       <li>x₁ · x₂ = c/a</li>
    </ul>
        </div>
         </details>
            `
     };

        const theoryContent = document.getElementById('theoryContent');
        if (theoryContent) {
   theoryContent.innerHTML = theories['quadratic-theory'] || '';
    }
    }

    switchTheoryTab(tabName) {
      const theories = {
            'quadratic-theory': `
                <details open>
         <summary>Определение квадратного уравнения</summary>
  <div class="theory-text">
            <p><strong>Квадратное уравнение</strong> — это уравнение вида:</p>
        <p><strong>ax² + bx + c = 0</strong>, где <strong>a ≠ 0</strong></p>
      </div>
  </details>
     <details>
           <summary>Дискриминант</summary>
 <div class="theory-text">
    <p><strong>D = b² - 4ac</strong></p>
        <ul>
           <li>D > 0 → два корня</li>
      <li>D = 0 → один корень</li>
   <li>D < 0 → комплексные корни</li>
        </ul>
       </div>
       </details>
            `,
 'linear-theory': `
<details open>
      <summary>Линейное уравнение</summary>
        <div class="theory-text">
    <p>Форма: <strong>ax + b = 0</strong>, где a ≠ 0</p>
          <p>Решение: <strong>x = -b/a</strong></p>
      </div>
        </details>
        `,
       'cubic-theory': `
                <details open>
      <summary>Кубическое уравнение</summary>
        <div class="theory-text">
       <p>Форма: <strong>ax³ + bx² + cx + d = 0</strong>, где a ≠ 0</p>
<p>Может иметь 1-3 действительных корня</p>
     </div>
  </details>
     `,
  'vieta-theory': `
<details open>
           <summary>Теорема Виета</summary>
          <div class="theory-text">
                   <p>Если x₁ и x₂ — корни ax² + bx + c = 0:</p>
          <ul>
                <li>x₁ + x₂ = -b/a</li>
   <li>x₁ · x₂ = c/a</li>
    </ul>
        </div>
         </details>
            `,
			'biquadratic-theory': `
			<details open>
				<summary>Биквадратное уравнение</summary>
				<div class="theory-text">
					<p>Форма: <strong>ax⁴ + bx² + c = 0</strong>, где a ≠ 0</p>
					<p>Подстановка: <strong>t = x²</strong> → <strong>at² + bt + c = 0</strong></p>
					<p>Из t восстанавливаем x с учётом:</p>
					<ul>
						<li>t &gt; 0: x = ±√t</li>
						<li>t = 0: x = 0</li>
						<li>t &lt; 0: нет действительных корней</li>
					</ul>
				</div>
			</details>
			`,
			'rational-theory': `
			<details open>
				<summary>Рациональные уравнения</summary>
				<div class="theory-text">
					<p>Форма: <strong>P(x)/Q(x) = 0</strong></p>
					<p>Алгоритм:</p>
					<ul>
						<li>Решаем <strong>P(x) = 0</strong></li>
						<li>И обязательно учесть <strong>ОДЗ: Q(x) ≠ 0</strong></li>
					</ul>
					<p>График рациональной функции имеет разрывы в нулях знаменателя.</p>
				</div>
			</details>
			`
     };

  document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        const theoryContent = document.getElementById('theoryContent');
 if (theoryContent) {
         theoryContent.innerHTML = theories[tabName] || theories['quadratic-theory'];
    }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
      notification.className = `notification ${type}`;
        notification.innerText = message;

        document.body.appendChild(notification);

 setTimeout(() => {
   notification.classList.add('show');
        }, 100);

        setTimeout(() => {
   notification.classList.remove('show');
   setTimeout(() => {
         document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    toggleTheme() {
        const html = document.documentElement;
        const isDark = html.classList.toggle('dark-mode');

        if (isDark) {
     html.classList.remove('light-mode');
    localStorage.setItem('theme', 'dark');
        } else {
            html.classList.add('light-mode');
     localStorage.setItem('theme', 'light');
      }

     		const themeToggle = document.getElementById('themeToggle');
		if (themeToggle) {
			themeToggle.textContent = isDark ? '☀️ Светлая' : '🌙 Тёмная';
		}
	}

	loadExamples() {
		const examplesGrid = document.getElementById('examplesGrid');
		if (!examplesGrid) return;

		const currentType = this.currentEquationType || 'quadratic';
		let examples = [];

		// Примеры для разных типов
		if (currentType === 'quadratic') {
			examples = [
				{ a: 1, b: -5, c: 6, label: 'x² - 5x + 6' },
				{ a: 1, b: 2, c: 5, label: 'x² + 2x + 5' },
				{ a: 1, b: 0, c: -4, label: 'x² - 4' },
				{ a: 1, b: -2, c: 1, label: 'x² - 2x + 1' },
				{ a: 2, b: -3, c: 1, label: '2x² - 3x + 1' },
				{ a: -1, b: 4, c: -3, label: '-x² + 4x - 3' }
			];
		} else if (currentType === 'linear') {
			examples = [
				{ a: 2, b: -4, label: '2x - 4 = 0' },
				{ a: 3, b: 9, label: '3x + 9 = 0' },
				{ a: 1, b: 7, label: 'x + 7 = 0' },
				{ a: 5, b: -10, label: '5x - 10 = 0' },
				{ a: 1, b: 3, label: 'x + 3 = 0' }
			];
		} else if (currentType === 'cubic') {
			examples = [
				{ a: 1, b: 0, c: -3, d: 0, label: 'x³ - 3x = 0' },
				{ a: 1, b: 0, c: 0, d: -8, label: 'x³ - 8 = 0' },
				{ a: 1, b: -1, c: -1, d: 1, label: 'x³ - x² - x + 1 = 0' }
			];
		} else if (currentType === 'biquadratic') {
			examples = [
				{ a: 1, b: -5, c: 4, label: 'x⁴ - 5x² + 4 = 0' },
				{ a: 1, b: -2, c: 1, label: 'x⁴ - 2x² + 1 = 0' },
				{ a: 1, b: -10, c: 9, label: 'x⁴ - 10x² + 9 = 0' }
			];
		} else if (currentType === 'system') {
			examples = [
				{ a1: 2, b1: 3, c1: 8, a2: 1, b2: -1, c2: 2, label: '2x+3y=8, x-y=2' },
				{ a1: 1, b1: 1, c1: 5, a2: 2, b2: -1, c2: 4, label: 'x+y=5, 2x-y=4' },
				{ a1: 3, b1: 2, c1: 11, a2: 1, b2: 2, c2: 5, label: '3x+2y=11, x+2y=5' }
			];
		} else if (currentType === 'rational') {
			examples = [
				{ numerator: 'x - 1', denominator: 'x + 2', label: '(x-1)/(x+2)=0' },
				{ numerator: 'x^2 - 4', denominator: 'x - 1', label: '(x²-4)/(x-1)=0' },
				{ numerator: 'x + 3', denominator: 'x^2 - 1', label: '(x+3)/(x²-1)=0' }
			];
		}

		examplesGrid.innerHTML = '';
		examples.forEach(example => {
			const btn = document.createElement('button');
			btn.className = 'example-btn';
			btn.textContent = example.label;
			btn.addEventListener('click', () => {
				if (currentType === 'system') {
					const a1 = document.getElementById('a1');
					const b1 = document.getElementById('b1');
					const c1 = document.getElementById('c1');
					const a2 = document.getElementById('a2');
					const b2 = document.getElementById('b2');
					const c2 = document.getElementById('c2');

					if (a1) a1.value = example.a1;
					if (b1) b1.value = example.b1;
					if (c1) c1.value = example.c1;
					if (a2) a2.value = example.a2;
					if (b2) b2.value = example.b2;
					if (c2) c2.value = example.c2;

					[a1, b1, c1, a2, b2, c2].forEach(el => {
						if (el) el.classList.add('success');
					});
				} else if (currentType === 'rational') {
					const numerator = document.getElementById('numerator');
					const denominator = document.getElementById('denominator');

					if (numerator) numerator.value = example.numerator;
					if (denominator) denominator.value = example.denominator;

					[numerator, denominator].forEach(el => {
						if (el) el.classList.add('success');
					});
				} else {
					const coeffA = document.getElementById('coeffA');
					const coeffB = document.getElementById('coeffB');
					const coeffC = document.getElementById('coeffC');
					const coeffD = document.getElementById('coeffD');

					if (coeffA) coeffA.value = example.a;
					if (coeffB) coeffB.value = example.b;
					if (coeffC) coeffC.value = example.c;
					if (coeffD) coeffD.value = example.d ?? 0;

					[coeffA, coeffB, coeffC, coeffD].forEach(el => {
						if (el) el.classList.add('success');
					});
				}

				setTimeout(() => this.uiManager?.onSolveClick?.(), 100);
			});

			examplesGrid.appendChild(btn);
		});
	}
}
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const html = document.documentElement;
    
 if (savedTheme === 'dark') {
        html.classList.add('dark-mode');
      html.classList.remove('light-mode');
    } else {
      html.classList.add('light-mode');
    html.classList.remove('dark-mode');
    }

	const themeToggle = document.getElementById('themeToggle');
	if (themeToggle) {
		const isDark = html.classList.contains('dark-mode');
		themeToggle.textContent = isDark ? '☀️ Светлая' : '🌙 Тёмная';
	}
 
    window.app = new EquationSolverApp();
    
    // ✅ Инициализируем виртуальную клавиатуру
    window.virtualKeyboard = new VirtualKeyboard();
});
