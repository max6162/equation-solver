/* ==========================================
   РАСШИРЕННЫЙ МОДУЛЬ РЕШЕНИЯ УРАВНЕНИЙ
   ========================================== */

/**
 * Парсер чисел (целые, десятичные, дроби)
 */
export function parseNumber(str) {
    if (typeof str === 'number') return str;
    
    str = str.toString().trim();
    
    // Проверка на дробь формата a/b
    if (str.includes('/')) {
      const parts = str.split('/');
  if (parts.length === 2) {
         const numerator = parseFloat(parts[0].trim());
            const denominator = parseFloat(parts[1].trim());

       if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
     return numerator / denominator;
}
      }
        return NaN;
    }
 
  const num = parseFloat(str);
    return num;
}

/**
 * Форматирование числа с точностью
 */
export function formatNumber(num, precision = 6) {
    if (!isFinite(num)) return num.toString();
    
    const factor = Math.pow(10, precision);
    const rounded = Math.round(num * factor) / factor;
    
    if (Number.isInteger(rounded)) {
        return rounded.toString();
    }
    
    let formatted = rounded.toFixed(precision);
    formatted = formatted.replace(/\.?0+$/, '');
    
    return formatted;
}

function normalizePolynomialString(str) {
    return (str || '')
        .toString()
        .trim()
        .replace(/\s+/g, '')
        .replace(/−/g, '-')
        .replace(/x²/g, 'x^2')
        .replace(/x³/g, 'x^3')
        .replace(/x⁴/g, 'x^4');
}

function parsePolynomial(str) {
    const s = normalizePolynomialString(str);
    if (!s) return null;

    const terms = [];
    let i = 0;
    while (i < s.length) {
        let sign = 1;
        if (s[i] === '+') {
            sign = 1;
            i++;
        } else if (s[i] === '-') {
            sign = -1;
            i++;
        }

        let j = i;
        while (j < s.length && s[j] !== '+' && s[j] !== '-') j++;
        const part = s.slice(i, j);
        i = j;

        if (!part) continue;

        if (part.includes('x')) {
            const [coefPart, rest] = part.split('x');
            let coef;
            if (coefPart === '' || coefPart === '+') coef = 1;
            else if (coefPart === '-') coef = -1;
            else coef = parseFloat(coefPart);
            if (!isFinite(coef)) return null;
            coef *= sign;

            let power = 1;
            if (rest && rest.startsWith('^')) {
                const p = parseInt(rest.slice(1), 10);
                if (!Number.isInteger(p) || p < 0) return null;
                power = p;
            } else if (rest && rest.length > 0) {
                return null;
            }
            terms.push({ power, coef });
        } else {
            const c = parseFloat(part);
            if (!isFinite(c)) return null;
            terms.push({ power: 0, coef: sign * c });
        }
    }

    if (terms.length === 0) return null;
    const maxPow = Math.max(...terms.map(t => t.power));
    const coeffs = new Array(maxPow + 1).fill(0);
    for (const t of terms) {
        coeffs[t.power] += t.coef;
    }

    while (coeffs.length > 1 && Math.abs(coeffs[coeffs.length - 1]) < 1e-12) coeffs.pop();
    return coeffs;
}

function polyDegree(coeffs) {
    if (!coeffs || coeffs.length === 0) return -1;
    for (let i = coeffs.length - 1; i >= 0; i--) {
        if (Math.abs(coeffs[i]) > 1e-12) return i;
    }
    return -1;
}

function polyEval(coeffs, x) {
    let y = 0;
    for (let i = coeffs.length - 1; i >= 0; i--) {
        y = y * x + coeffs[i];
    }
    return y;
}

function polyDeriv(coeffs) {
    if (!coeffs || coeffs.length <= 1) return [0];
    const d = new Array(coeffs.length - 1).fill(0);
    for (let i = 1; i < coeffs.length; i++) d[i - 1] = coeffs[i] * i;
    while (d.length > 1 && Math.abs(d[d.length - 1]) < 1e-12) d.pop();
    return d;
}

function uniqueSortedRoots(values, eps = 1e-7) {
    const sorted = values.slice().sort((a, b) => a - b);
    const out = [];
    for (const v of sorted) {
        if (!out.length || Math.abs(out[out.length - 1] - v) > eps) out.push(v);
    }
    return out;
}

function cauchyBound(coeffs) {
    const deg = polyDegree(coeffs);
    if (deg <= 0) return 1;
    const an = Math.abs(coeffs[deg]) || 1;
    let maxRatio = 0;
    for (let i = 0; i < deg; i++) {
        maxRatio = Math.max(maxRatio, Math.abs(coeffs[i]) / an);
    }
    return 1 + maxRatio;
}

function findRealRootsByBracketing(coeffs) {
    const deg = polyDegree(coeffs);
    if (deg <= 0) return [];

    const bound = Math.max(1, cauchyBound(coeffs));
    const minX = -bound;
    const maxX = bound;
    const samples = 4000;
    const step = (maxX - minX) / samples;
    const epsY = 1e-10;
    const roots = [];

    let prevX = minX;
    let prevY = polyEval(coeffs, prevX);
    if (Math.abs(prevY) < epsY) roots.push(prevX);

    for (let k = 1; k <= samples; k++) {
        const x = minX + k * step;
        const y = polyEval(coeffs, x);
        if (Math.abs(y) < epsY) roots.push(x);

        if (isFinite(prevY) && isFinite(y)) {
            if (prevY === 0) {
                prevX = x;
                prevY = y;
                continue;
            }
            if (prevY * y < 0) {
                let a = prevX;
                let b = x;
                let fa = prevY;
                let fb = y;
                for (let it = 0; it < 80; it++) {
                    const m = (a + b) / 2;
                    const fm = polyEval(coeffs, m);
                    if (!isFinite(fm)) break;
                    if (Math.abs(fm) < 1e-12 || (b - a) < 1e-10) {
                        a = b = m;
                        break;
                    }
                    if (fa * fm <= 0) {
                        b = m;
                        fb = fm;
                    } else {
                        a = m;
                        fa = fm;
                    }
                }
                roots.push((a + b) / 2);
            }
        }

        prevX = x;
        prevY = y;
    }

    return uniqueSortedRoots(roots, 1e-6);
}

/**
 * НОД для сокращения дробей
 */
function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    
    while (b !== 0) {
        const temp = b;
        b = a % b;
        a = temp;
    }
  
    return a;
}

/**
 * КЛАСС РЕШАТЕЛЯ КВАДРАТНЫХ УРАВНЕНИЙ
 */
export class QuadraticSolver {
    constructor(a, b, c) {
        this.rawA = a;
      this.rawB = b;
        this.rawC = c;
        
        this.a = parseNumber(a);
        this.b = parseNumber(b);
        this.c = parseNumber(c);
    
        this.isValid = this.validateInput();
        this.error = null;
        
        if (!this.isValid) {
         this.error = this.getErrorMessage();
        }
      
        this.steps = [];
this.roots = [];
 this.equationType = null;
    }
    
    validateInput() {
        if (isNaN(this.a) || isNaN(this.b) || isNaN(this.c)) {
        return false;
 }
        if (!isFinite(this.a) || !isFinite(this.b) || !isFinite(this.c)) {
    return false;
     }
return true;
    }
    
    getErrorMessage() {
        if (isNaN(this.a) || isNaN(this.b) || isNaN(this.c)) {
          return 'Пожалуйста, введите корректные числа';
        }
        if (!isFinite(this.a) || !isFinite(this.b) || !isFinite(this.c)) {
  return 'Числа должны быть конечными';
  }
        return 'Некорректный ввод';
    }
    
    solve() {
        if (!this.isValid) {
            return { success: false, error: this.error, steps: [], roots: [] };
        }
   
        this.steps = [];
        this.roots = [];
        
        this.addStep(
     'Исходное уравнение',
            `${this.formatEquation(this.a, this.b, this.c)} = 0`
        );
     
        if (this.a === 0) {
            return this.solveLinear();
        }
    
        return this.solveQuadratic();
    }
    
    solveLinear() {
        if (this.b === 0) {
            this.equationType = 'degenerate';
   
         if (this.c === 0) {
        this.addStep(
         'Вырожденный случай',
     'Уравнение 0 = 0 верно для всех x. Бесконечно много решений.'
  );
                this.roots = [{ value: '∞', display: '∞' }];
   } else {
     this.addStep(
      'Вырожденный случай',
             `Уравнение ${this.c} = 0 невозможно. Нет решений.`
      );
           this.roots = [];
      }
      } else {
            this.equationType = 'linear';
 
            this.addStep(
       'Линейное уравнение (a = 0)',
         `${this.formatEquation(0, this.b, this.c)} = 0`
            );
            
            this.addStep(
             'Преобразование',
    `${this.formatNumber(this.b)}x = ${this.formatNumber(-this.c)}`
    );

            const x = -this.c / this.b;
          const xFormatted = this.formatNumber(x);
     
 this.addStep(
   'Решение',
         `x = ${xFormatted}`
   );
  
    this.roots = [{ value: x, display: xFormatted }];
        }

        return this.getResult();
    }
    
    solveQuadratic() {
        this.equationType = 'quadratic';
        
        const D = this.b * this.b - 4 * this.a * this.c;
        
 this.addStep(
    'Вычисление дискриминанта',
    this.formatDiscriminantCalculation(D)
        );
        
        if (D > 0) {
            return this.solveWithPositiveDiscriminant(D);
        } else if (D === 0) {
      return this.solveWithZeroDiscriminant();
     } else {
    return this.solveWithNegativeDiscriminant(D);
        }
    }
    
    solveWithPositiveDiscriminant(D) {
        this.addStep(
     'Анализ дискриминанта',
   `D = ${this.formatNumber(D)} > 0<br>Уравнение имеет два различных действительных корня`
        );
     
        const sqrtD = Math.sqrt(D);
 
        this.addStep(
      'Вычисление корней',
            this.formatRootsCalculation(sqrtD)
    );
      
        const x1 = (-this.b + sqrtD) / (2 * this.a);
        const x2 = (-this.b - sqrtD) / (2 * this.a);

        const roots = [x1, x2].sort((a, b) => b - a);
        
        const x1Display = this.formatNumber(roots[0]);
    const x2Display = this.formatNumber(roots[1]);
 
        this.addStep(
         'Результат',
      `x₁ = ${x1Display}<br>x₂ = ${x2Display}`
        );

        this.roots = [
            { value: roots[0], display: x1Display },
       { value: roots[1], display: x2Display }
  ];
     
        return this.getResult();
    }
  
    solveWithZeroDiscriminant() {
        this.addStep(
            'Анализ дискриминанта',
         'D = 0<br>Уравнение имеет один корень кратности 2'
    );
        
        const x = -this.b / (2 * this.a);
        const xDisplay = this.formatNumber(x);
        
        this.addStep(
       'Вычисление корня',
     `x = -b / (2a) = ${xDisplay}`
    );
        
        this.roots = [{ value: x, display: xDisplay }];
 
        return this.getResult();
    }
    
    solveWithNegativeDiscriminant(D) {
 const absD = Math.abs(D);
        const sqrtAbsD = Math.sqrt(absD);
   
        this.addStep(
            'Анализ дискриминанта',
    `D = ${this.formatNumber(D)} < 0<br>Уравнение имеет два комплексных сопряжённых корня`
        );
        
    const realPart = -this.b / (2 * this.a);
 const imagPart = sqrtAbsD / (2 * this.a);
        
        this.addStep(
      'Вычисление комплексных корней',
      this.formatComplexRootsCalculation(realPart, imagPart, sqrtAbsD)
        );
        
        const realDisplay = this.formatNumber(realPart);
        const imagDisplay = this.formatNumber(imagPart);
        
this.addStep(
     'Результат',
            `x₁ = ${realDisplay} + ${imagDisplay}i<br>x₂ = ${realDisplay} - ${imagDisplay}i`
   );
        
        this.roots = [
            { 
       value: { real: realPart, imag: imagPart }, 
           display: `${realDisplay} + ${imagDisplay}i` 
            },
    { 
    value: { real: realPart, imag: -imagPart }, 
                display: `${realDisplay} - ${imagDisplay}i` 
 }
        ];
        
        return this.getResult();
    }
    
    formatEquation(a, b, c) {
        const terms = [];
      
        if (a !== 0) {
            const aStr = a === 1 ? '' : a === -1 ? '-' : this.formatNumber(a);
terms.push(`${aStr}x²`);
        }
      
   if (b !== 0) {
         const sign = b > 0 && terms.length > 0 ? '+' : '';
            const bStr = Math.abs(b) === 1 ? (b > 0 ? '' : '-') : this.formatNumber(Math.abs(b));
      terms.push(`${sign}${bStr}x`);
  }
    
 if (c !== 0 || terms.length === 0) {
       const sign = c > 0 && terms.length > 0 ? '+' : '';
   terms.push(`${sign}${this.formatNumber(c)}`);
      }
      
        return terms.join(' ');
    }
    
    formatDiscriminantCalculation(D) {
      const b2 = this.b * this.b;
 const fourAc = 4 * this.a * this.c;
        const DDisplay = this.formatNumber(D);
   
      // ✅ ПРАВИЛЬНЫЙ ШКОЛЬНЫЙ ФОРМАТ  
        const b2Display = this.formatNumber(b2);
     const fourAcDisplay = this.formatNumber(Math.abs(fourAc));
        const bDisplay = this.formatNumber(this.b);
   const aDisplay = this.formatNumber(this.a);
    const cDisplay = this.formatNumber(this.c);
        
        return `Формула дискриминанта: D = b² - 4ac<br><br>` +
         `D = (${bDisplay})² - 4 · ${aDisplay} · (${cDisplay})<br><br>` +
    `D = ${b2Display} - ${fourAcDisplay}<br><br>` +
        `D = ${DDisplay}`;
    }
 
    formatRootsCalculation(sqrtD) {
        const denominator = 2 * this.a;
 const sqrtDDisplay = this.formatNumber(sqrtD);
        const bDisplay = this.formatNumber(-this.b);
        const denomDisplay = this.formatNumber(denominator);
        
     // ✅ ШКОЛЬНЫЙ ФОРМАТ С ПОЛНЫМ РАСЧЕТОМ
        return `Используем формулу: x = (-b ± √D) / (2a)<br><br>` +
            `x = (${bDisplay} ± ${sqrtDDisplay}) / ${denomDisplay}<br><br>` +
  `<strong>Первый корень:</strong><br>` +
     `x₁ = (${bDisplay} + ${sqrtDDisplay}) / ${denomDisplay} = ${this.formatNumber((-this.b + sqrtD) / (2 * this.a))}<br><br>` +
         `<strong>Второй корень:</strong><br>` +
      `x₂ = (${bDisplay} - ${sqrtDDisplay}) / ${denomDisplay} = ${this.formatNumber((-this.b - sqrtD) / (2 * this.a))}`;
    }
    
    formatComplexRootsCalculation(realPart, imagPart, sqrtAbsD) {
     const denominator = 2 * this.a;
        const bDisplay = this.formatNumber(-this.b);
        const sqrtDisplay = this.formatNumber(sqrtAbsD);
        const denomDisplay = this.formatNumber(denominator);
        
        return `x = (-b ± i√|D|) / (2a) = (${bDisplay} ± i·${sqrtDisplay}) / ${denomDisplay}<br>` +
        `x₁ = ${this.formatNumber(realPart)} + ${this.formatNumber(imagPart)}i<br>` +
            `x₂ = ${this.formatNumber(realPart)} - ${this.formatNumber(imagPart)}i`;
    }
    
    addStep(title, content) {
 this.steps.push({
         title: title,
 content: content,
        order: this.steps.length
    });
    }
    
    getResult() {
        return {
         success: true,
        steps: this.steps,
            roots: this.roots,
      equationType: this.equationType,
      discriminant: this.a !== 0 ? this.b * this.b - 4 * this.a * this.c : null,
   equation: `${this.rawA}x² + ${this.rawB}x + ${this.rawC} = 0`
        };
    }
    
    formatNumber(num) {
        return formatNumber(num, 6);
    }
}

/**
 * Валидация коэффициентов
 */
export function validateCoefficients(a, b, c) {
const errors = {};
  
  const aNum = parseNumber(a);
    const bNum = parseNumber(b);
    const cNum = parseNumber(c);
    
 if (isNaN(aNum)) {
     errors.a = 'Введите корректное число';
    } else if (!isFinite(aNum)) {
        errors.a = 'Число должно быть конечным';
    }
    
  if (isNaN(bNum)) {
        errors.b = 'Введите корректное число';
    } else if (!isFinite(bNum)) {
        errors.b = 'Число должно быть конечным';
    }
  
    if (isNaN(cNum)) {
        errors.c = 'Введите корректное число';
    } else if (!isFinite(cNum)) {
        errors.c = 'Число должно быть конечным';
    }
  
    if (aNum === 0 && bNum === 0) {
        errors.general = 'Коэффициенты a и b не могут быть одновременно равны 0';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors: errors,
        coefficients: { a: aNum, b: bNum, c: cNum }
    };
}

/**
 * Генератор случайного уравнения
 */
export function generateRandomEquation() {
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 19) - 9;
    const c = Math.floor(Math.random() * 19) - 9;
    
return { a, b, c };
}

/**
 * Решение кубического уравнения
 */
export class CubicSolver {
 constructor(a, b, c, d) {
        this.a = parseNumber(a);
 this.b = parseNumber(b);
        this.c = parseNumber(c);
        this.d = parseNumber(d);
    }
    
    solve() {
        const steps = [];
        
  steps.push({
   title: 'Исходное уравнение',
    content: `${this.a}x³ + ${this.b}x² + ${this.c}x + ${this.d} = 0`
      });
        
        // Если a = 0, то это квадратное уравнение
        if (this.a === 0) {
            const quadSolver = new QuadraticSolver(this.b, this.c, this.d);
            const result = quadSolver.solve();
     return { ...result, steps: steps.concat(result.steps), equationType: 'cubic' };
        }
   
        steps.push({
            title: 'Идея решения',
            content: `Для общего кубического уравнения можно применять формулы Кардано, но они громоздкие.
Здесь используется надёжный численный поиск действительных корней: мы находим отрезки, где f(x) меняет знак, и уточняем корень методом бисекции.`
        });

        steps.push({
            title: 'Функция',
            content: `f(x) = ${this.a}x³ + ${this.b}x² + ${this.c}x + ${this.d}`
        });
        
        const coeffs = [this.d, this.c, this.b, this.a];
        const realRoots = findRealRootsByBracketing(coeffs);
        const roots = realRoots.map(v => ({ value: v, display: formatNumber(v, 6) }));
      
        if (roots.length > 0) {
     steps.push({
 title: 'Найденные корни',
     content: roots.map(r => `x = ${r.display}`).join('<br>')
     });
  } else {
            steps.push({
   title: 'Решение',
 content: 'Действительных корней не найдено'
    });
      }
        
        return {
         success: true,
equationType: 'cubic',
      steps: steps,
    roots: roots,
equation: `${this.a}x³ + ${this.b}x² + ${this.c}x + ${this.d} = 0`
        };
    }
}

/**
 * Решение биквадратного уравнения
 */
export class BiquadraticSolver {
    constructor(a, b, c) {
        this.a = parseNumber(a);
        this.b = parseNumber(b);
        this.c = parseNumber(c);
    }
    
    solve() {
        const steps = [];
        
        steps.push({
            title: 'Исходное уравнение',
  content: `${this.a}x⁴ + ${this.b}x² + ${this.c} = 0`
        });
        
        steps.push({
            title: 'Подстановка',
            content: 'Пусть t = x², тогда получаем квадратное уравнение: at² + bt + c = 0'
     });
        
        // Решаем квадратное уравнение относительно t
        const quadraticSolver = new QuadraticSolver(this.a, this.b, this.c);
const quadraticResult = quadraticSolver.solve();
   
        steps.push(...quadraticSolver.steps);
        
        const roots = [];
        
   if (quadraticResult.success && quadraticResult.roots.length > 0) {
          for (let root of quadraticResult.roots) {
    const t = typeof root.value === 'number' ? root.value : null;
      
 if (t !== null) {
         if (t > 0) {
       const sqrtT = Math.sqrt(t);
 roots.push({ value: sqrtT, display: formatNumber(sqrtT, 6) });
    roots.push({ value: -sqrtT, display: formatNumber(-sqrtT, 6) });
      
     steps.push({
                title: `Для t = ${root.display}`,
             content: `x² = ${root.display}
t > 0, значит x = ±√t
x = ±${formatNumber(sqrtT, 6)}`
        });
        		  } else if (t === 0) {
		   roots.push({ value: 0, display: '0' });
	 steps.push({
  title: 'Для t = 0',
  content: `x² = 0
x = 0`
       });
		   } else {
               steps.push({
          title: `Для t = ${root.display}`,
           content: `x² = ${root.display}
t < 0, значит действительных решений нет`
           });
        }
                }
 }
        }
        
   steps.push({
    title: 'Итоговые корни',
        content: roots.length > 0 ? roots.map(r => `x = ${r.display}`).join('<br>') : 'Нет действительных корней'
  });
    
        return {
            success: true,
      equationType: 'biquadratic',
      steps: steps,
    roots: roots,
            equation: `${this.a}x⁴ + ${this.b}x² + ${this.c} = 0`
        };
    }
}

/**
 * Решение системы линейных уравнений 2x2 - ИСПРАВЛЕННАЯ ВЕРСИЯ
 */
export class LinearSystemSolver {
    constructor(a1, b1, c1, a2, b2, c2) {
     this.a1 = parseNumber(a1);
        this.b1 = parseNumber(b1);
        this.c1 = parseNumber(c1);
  this.a2 = parseNumber(a2);
      this.b2 = parseNumber(b2);
        this.c2 = parseNumber(c2);
    }
    
solve() {
    const steps = [];
 
      // Шаг 1: Исходная система
        steps.push({
          title: 'Исходная система уравнений',
     content: `${this.a1}x + ${this.b1}y = ${this.c1}\n${this.a2}x + ${this.b2}y = ${this.c2}`
 });
        
      // Шаг 2: Вычисление определителя
      const D = this.a1 * this.b2 - this.a2 * this.b1;
        
        steps.push({
 title: 'Главный определитель (D)',
            content: `D = a₁b₂ - a₂b₁
D = ${this.a1}·${this.b2} - ${this.a2}·${this.b1} = ${D}`
    });
      
     // Если D = 0, система либо не имеет решений, либо имеет бесконечно много
        if (Math.abs(D) < 0.0001) {
   steps.push({
    title: 'Анализ',
    content: 'D = 0 → Система либо несовместима (нет решений), либо имеет бесконечно много решений'
   });
    
  return {
        success: true,
    equationType: 'system',
         steps: steps,
            message: 'Система не имеет единственного решения (D = 0)',
                solution: null,
     roots: []
  };
        }
        
 // Шаг 3: Вычисление определителей Dx и Dy
        const Dx = this.c1 * this.b2 - this.c2 * this.b1;
        const Dy = this.a1 * this.c2 - this.a2 * this.c1;
        
    steps.push({
          title: 'Определитель Dx',
            content: `Dx = c₁b₂ - c₂b₁
Dx = ${this.c1}·${this.b2} - ${this.c2}·${this.b1} = ${Dx}`
        });
        
        steps.push({
    title: 'Определитель Dy',
            content: `Dy = a₁c₂ - a₂c₁
Dy = ${this.a1}·${this.c2} - ${this.a2}·${this.c1} = ${Dy}`
        });
  
        // Шаг 4: Вычисление x и y
        const x = Dx / D;
  const y = Dy / D;
        
        const xDisplay = formatNumber(x, 6);
      const yDisplay = formatNumber(y, 6);
        
    steps.push({
title: 'Решение по формулам Крамера',
 content: `x = Dx/D = ${Dx}/${D} = ${xDisplay}
y = Dy/D = ${Dy}/${D} = ${yDisplay}`
     });
    
        // Шаг 5: Проверка решения
        const check1 = this.a1 * x + this.b1 * y;
        const check2 = this.a2 * x + this.b2 * y;
    
        steps.push({
          title: 'Проверка решения',
            content: `1-е уравнение: ${this.a1}·${xDisplay} + ${this.b1}·${yDisplay} = ${formatNumber(check1, 4)} ≈ ${this.c1}
2-е уравнение: ${this.a2}·${xDisplay} + ${this.b2}·${yDisplay} = ${formatNumber(check2, 4)} ≈ ${this.c2}`
        });
        
        return {
            success: true,
   equationType: 'system',
            steps: steps,
     solution: { x, y },
            roots: []
    };
    }
}

/**
 * Решение рационального уравнения P(x)/Q(x) = 0
 */
export class RationalSolver {
    constructor(numeratorStr, denominatorStr) {
        this.numeratorStr = numeratorStr.trim();
 this.denominatorStr = denominatorStr.trim();
    }
    
    solve() {
        const steps = [];
        
  steps.push({
            title: 'Исходное рациональное уравнение',
         content: `${this.numeratorStr} / (${this.denominatorStr}) = 0`
    });
    
        steps.push({
            title: 'Свойство дроби',
            content: `Дробь равна нулю тогда и только тогда, когда:
1) числитель равен нулю
2) знаменатель не равен нулю`
        });
        
        steps.push({
            title: 'Условия для решения',
 content: `Решаем уравнение числителя:
${this.numeratorStr} = 0

И учитываем ОДЗ:
${this.denominatorStr} ≠ 0`
        });
        
        const numeratorCoeffs = parsePolynomial(this.numeratorStr);
        const denominatorCoeffs = parsePolynomial(this.denominatorStr);
        
        if (!numeratorCoeffs || !denominatorCoeffs) {
            return {
                success: false,
                equationType: 'rational',
                error: 'Некорректный формат. Разрешены только многочлены вида: 2x^3 - x + 1',
                steps,
                roots: [],
                equation: `(${this.numeratorStr}) / (${this.denominatorStr}) = 0`
            };
        }

        const numDeg = polyDegree(numeratorCoeffs);
        const denDeg = polyDegree(denominatorCoeffs);
        if (denDeg < 0) {
            return {
                success: false,
                equationType: 'rational',
                error: 'Знаменатель не должен быть равен 0',
                steps,
                roots: [],
                equation: `(${this.numeratorStr}) / (${this.denominatorStr}) = 0`
            };
        }

        steps.push({
            title: 'ОДЗ',
            content: `Исключаем все x, при которых знаменатель обращается в ноль:
${this.denominatorStr} = 0`
        });

        let candidateRoots = [];
        if (numDeg >= 1) {
            candidateRoots = findRealRootsByBracketing(numeratorCoeffs);
        }

        const denomZeros = denDeg >= 1 ? findRealRootsByBracketing(denominatorCoeffs) : [];

        if (denomZeros.length > 0) {
            steps.push({
                title: 'Нули знаменателя (точки разрыва)',
                content: denomZeros.map(v => `x = ${formatNumber(v, 6)}`).join('\n')
            });
        } else {
            steps.push({
                title: 'Нули знаменателя',
                content: 'Знаменатель не имеет действительных нулей'
            });
        }
        const epsDen = 1e-8;
        const validRoots = candidateRoots.filter(x => Math.abs(polyEval(denominatorCoeffs, x)) > epsDen);

        const roots = validRoots.map(v => ({ value: v, display: formatNumber(v, 6) }));

        if (roots.length > 0) {
            steps.push({
                title: 'Решение числителя',
                content: `Находим корни уравнения ${this.numeratorStr} = 0`
            });

            steps.push({
                title: 'Найденные корни',
                content: roots.map(r => `x = ${r.display}`).join('\n')
            });

            steps.push({
                title: 'Проверка ОДЗ',
                content: roots.map(r => {
                    const q = polyEval(denominatorCoeffs, r.value);
                    return `${this.denominatorStr} при x = ${r.display}: ${formatNumber(q, 6)} (должно быть ≠ 0)`;
                }).join('\n')
            });
        } else {
            steps.push({
                title: 'Результат',
                content: candidateRoots.length === 0 ? 'Числитель не имеет действительных корней' : 'Все корни числителя исключены из-за ОДЗ'
            });
        }
    
      return {
success: true,
    equationType: 'rational',
    steps: steps,
   roots: roots,
   numerator: this.numeratorStr,
   denominator: this.denominatorStr,
   numeratorCoeffs,
   denominatorCoeffs,
   denominatorZeros: denomZeros,
  equation: `(${this.numeratorStr}) / (${this.denominatorStr}) = 0`
  };
    }
}
