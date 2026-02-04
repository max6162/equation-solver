/* ==========================================
   ПОЛНЫЙ МОДУЛЬ ПОСТРОЕНИЯ ГРАФИКОВ
   С ПРАВИЛЬНЫМИ ФУНКЦИЯМИ ДЛЯ КАЖДОГО ТИПА
   ========================================== */

export class GraphManager {
    constructor(canvas, solution) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.solution = solution;
        
// Параметры графика
        this.padding = 60;
        this.zoomLevel = 1;
        this.minZoom = 0.3;
        this.maxZoom = 5;
        this.panX = 0;
        this.panY = 0;
     
      // Тип графика
      this.graphType = 'function';
      
        // Извлекаем коэффициенты
     this.extractCoefficients();
        
        // Инициализируем обработчики событий
   this.initEventListeners();
        
        // Рисуем график
        this.drawGraph();
    }

	polyEval(coeffs, x) {
		if (!coeffs || !coeffs.length) return NaN;
		let y = 0;
		for (let i = coeffs.length - 1; i >= 0; i--) {
			y = y * x + coeffs[i];
		}
		return y;
	}

	polyDeriv(coeffs) {
		if (!coeffs || coeffs.length <= 1) return [0];
		const d = new Array(coeffs.length - 1).fill(0);
		for (let i = 1; i < coeffs.length; i++) d[i - 1] = coeffs[i] * i;
		while (d.length > 1 && Math.abs(d[d.length - 1]) < 1e-12) d.pop();
		return d;
	}

    isValidY(y) {
        return typeof y === 'number' && isFinite(y) && !isNaN(y);
    }

    shouldBreakSegment(prevY, y, yRange) {
        if (!this.isValidY(prevY) || !this.isValidY(y)) return true;
        const range = (yRange.max - yRange.min) || 1;
        return Math.abs(y - prevY) > range * 3;
    }
    
    /**
     * Инициализирует обработчики событий мыши
  */
    initEventListeners() {
  let isDragging = false;
        let lastX, lastY;
  
        this.canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
 lastX = e.clientX;
            lastY = e.clientY;
        });
        
      this.canvas.addEventListener('mousemove', (e) => {
if (isDragging) {
         const deltaX = (e.clientX - lastX) * 0.01 / this.zoomLevel;
           const deltaY = (e.clientY - lastY) * 0.01 / this.zoomLevel;
         
     this.panX -= deltaX;
                this.panY += deltaY;
          
       this.drawGraph();
   
 lastX = e.clientX;
     lastY = e.clientY;
  }
   });
  
        this.canvas.addEventListener('mouseup', () => {
    isDragging = false;
        });

        this.canvas.addEventListener('mouseleave', () => {
            isDragging = false;
        });
        
     // Масштабирование скроллом
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
 this.zoomLevel *= zoomFactor;
   this.zoomLevel = Math.max(this.minZoom, Math.min(this.zoomLevel, this.maxZoom));
            this.drawGraph();
        });
    }
    
    /**
     * Основной метод отрисовки графика
 */
    drawGraph() {
        // Очищаем canvas
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Рисуем сетку и оси
        this.drawGrid();
        this.drawAxes();
    
        // Рисуем функцию
     this.drawFunction();
        
        // Рисуем корни
     if (this.solution?.roots && this.solution.roots.length > 0) {
        this.drawRoots();
        }
     
        // Рисуем особенные точки (вершина, экстремумы)
        this.drawSpecialPoints();
      
        // Информация на экране
        if (typeof window !== 'undefined' && window.innerWidth > 768) {
            this.drawInfo();
        }
    }
    
    /**
     * Рисует сетку
     */
    drawGrid() {
     this.ctx.strokeStyle = '#e5e7eb';
        this.ctx.lineWidth = 0.5;
        
        const xRange = this.getXRange();
   const yRange = this.getYRange();
        
    // Определяем шаг сетки
        const step = Math.pow(10, Math.floor(Math.log10(xRange.max - xRange.min)) - 1);
        const gridStep = step > 0 ? step : 1;
        
    // Вертикальные линии
        for (let x = Math.floor(xRange.min / gridStep) * gridStep; x <= xRange.max; x += gridStep) {
            const px = this.xToPixel(x);
     if (px >= this.padding && px <= this.canvas.width - this.padding) {
     this.ctx.beginPath();
  this.ctx.moveTo(px, this.padding);
             this.ctx.lineTo(px, this.canvas.height - this.padding);
     this.ctx.stroke();
    }
        }

        // Горизонтальные линии
      for (let y = Math.floor(yRange.min / gridStep) * gridStep; y <= yRange.max; y += gridStep) {
    const py = this.yToPixel(y);
            if (py >= this.padding && py <= this.canvas.height - this.padding) {
       this.ctx.beginPath();
     this.ctx.moveTo(this.padding, py);
      this.ctx.lineTo(this.canvas.width - this.padding, py);
     this.ctx.stroke();
         }
        }
    }
    
    /**
     * Рисует оси координат
     */
    drawAxes() {
        this.ctx.strokeStyle = '#374151';
      this.ctx.lineWidth = 2;
      this.ctx.fillStyle = '#1f2937';
        this.ctx.font = 'bold 12px sans-serif';
  this.ctx.textAlign = 'center';
        
        const centerX = this.xToPixel(0);
        const centerY = this.yToPixel(0);
        
        // Ось X
  this.ctx.beginPath();
        this.ctx.moveTo(this.padding, centerY);
        this.ctx.lineTo(this.canvas.width - this.padding, centerY);
        this.ctx.stroke();
        
     // Ось Y
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, this.padding);
   this.ctx.lineTo(centerX, this.canvas.height - this.padding);
        this.ctx.stroke();
 
        // Стрелки
      this.drawArrow(this.canvas.width - this.padding - 10, centerY - 8, 10, 'right');
        this.drawArrow(centerX + 8, this.padding + 10, 10, 'up');
        
  // Подписи осей
    this.ctx.fillText('x', this.canvas.width - this.padding - 20, centerY + 20);
        this.ctx.fillText('y', centerX + 20, this.padding - 5);
     
        // Деления на осях
        const xRange = this.getXRange();
        const step = Math.pow(10, Math.floor(Math.log10(xRange.max - xRange.min)) - 1);
      const gridStep = step > 0 ? step : 1;
        
        this.ctx.font = '10px sans-serif';
  this.ctx.fillStyle = '#6b7280';
      
        for (let x = Math.floor(xRange.min / gridStep) * gridStep; x <= xRange.max; x += gridStep) {
          if (Math.abs(x) > 0.01) {
const px = this.xToPixel(x);
                this.ctx.fillRect(px - 1, centerY - 4, 2, 8);
                this.ctx.textAlign = 'center';
        this.ctx.fillText(x.toFixed(1), px, centerY + 18);
            }
        }
        
   const yRange = this.getYRange();
        for (let y = Math.floor(yRange.min / gridStep) * gridStep; y <= yRange.max; y += gridStep) {
  if (Math.abs(y) > 0.01) {
            const py = this.yToPixel(y);
  this.ctx.fillRect(centerX - 4, py - 1, 8, 2);
       this.ctx.textAlign = 'right';
    this.ctx.fillText(y.toFixed(1), centerX - 12, py + 4);
            }
     }
    }
    
    /**
     * Рисует стрелку
     */
    drawArrow(x, y, size, direction) {
        this.ctx.beginPath();
        if (direction === 'right') {
     this.ctx.moveTo(x, y);
      this.ctx.lineTo(x - size, y - size / 2);
 this.ctx.lineTo(x - size, y + size / 2);
        } else if (direction === 'up') {
    this.ctx.moveTo(x, y);
      this.ctx.lineTo(x - size / 2, y + size);
       this.ctx.lineTo(x + size / 2, y + size);
        }
 this.ctx.closePath();
        this.ctx.fill();
    }
    
    /**
     * ✅ ПРАВИЛЬНАЯ ФУНКЦИЯ ДЛЯ КАЖДОГО ТИПА УРАВНЕНИЯ
     */
    drawFunction() {
        const xRange = this.getXRange();
        const yRange = this.getYRange();
        const equationType = this.solution?.equationType || 'quadratic';
        
        // Основная функция
     if (this.graphType === 'function' || this.graphType === 'both') {
    this.ctx.strokeStyle = '#3b82f6';
         this.ctx.lineWidth = 2.5;
            this.ctx.beginPath();
 
        const step = (xRange.max - xRange.min) / 3000;
            let isFirstPoint = true;
            let prevY = null;
            
         for (let x = xRange.min; x <= xRange.max; x += step) {
       let y = this.evaluateFunction(x, equationType);
                
       const px = this.xToPixel(x);
       const py = this.yToPixel(y);
             
// Проверяем валидность
       if (this.isValidY(y) && isFinite(py) && Math.abs(y) < 100000) {
                    if (!isFirstPoint && this.shouldBreakSegment(prevY, y, yRange)) {
                        isFirstPoint = true;
                    }
                    if (isFirstPoint) {
                        this.ctx.moveTo(px, py);
                        isFirstPoint = false;
                    } else {
                        this.ctx.lineTo(px, py);
                    }
                    prevY = y;
                } else {
                    isFirstPoint = true;
                    prevY = null;
                }
            }
            
       this.ctx.stroke();
        }
   
  // Производная (если нужна)
  if ((this.graphType === 'derivative' || this.graphType === 'both') && 
   (equationType === 'quadratic' || equationType === 'linear' || equationType === 'cubic' || equationType === 'biquadratic' || equationType === 'rational')) {
        this.drawDerivative(xRange, equationType);
 }
    }
    
    /**
     * ✅ ПРАВИЛЬНОЕ ВЫЧИСЛЕНИЕ ФУНКЦИИ ДЛЯ КАЖДОГО ТИПА
     */
    evaluateFunction(x, equationType) {
  switch (equationType) {
    case 'quadratic':
     // y = ax² + bx + c
          return this.a * x * x + this.b * x + this.c;
      
        case 'linear':
     // y = ax + b
      return this.a * x + this.b;
         
  case 'cubic':
        // y = ax³ + bx² + cx + d
                return this.a * x * x * x + this.b * x * x + this.c * x + this.d;
    
     case 'biquadratic':
              // y = ax⁴ + bx² + c
  return this.a * x * x * x * x + this.b * x * x + this.c;

		case 'rational': {
			const Q = this.polyEval(this.denominatorCoeffs, x);
			if (!this.isValidY(Q) || Math.abs(Q) < 1e-10) return NaN;
			const P = this.polyEval(this.numeratorCoeffs, x);
			return P / Q;
		}
      
            default:
         return this.a * x * x + this.b * x + this.c;
        }
    }
    
    /**
     * Рисует производную
     */
    drawDerivative(xRange, equationType) {
        this.ctx.strokeStyle = '#ef4444';
        this.ctx.lineWidth = 1.5;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        
        const step = (xRange.max - xRange.min) / 2000;
  let isFirstPoint = true;
  const yRange = this.getYRange();
  let prevY = null;
      
 for (let x = xRange.min; x <= xRange.max; x += step) {
        let y;
    
         if (equationType === 'quadratic') {
      // f'(x) = 2ax + b
           y = 2 * this.a * x + this.b;
            } else if (equationType === 'linear') {
			// f'(x) = a
			y = this.a;
			} else if (equationType === 'biquadratic') {
			// f'(x) = 4ax^3 + 2bx
			y = 4 * this.a * x * x * x + 2 * this.b * x;
			} else if (equationType === 'cubic') {
           // f'(x) = 3ax² + 2bx + c
       y = 3 * this.a * x * x + 2 * this.b * x + this.c;
			} else if (equationType === 'rational') {
			const Q = this.polyEval(this.denominatorCoeffs, x);
			if (!this.isValidY(Q) || Math.abs(Q) < 1e-10) {
				y = NaN;
			} else {
				const P = this.polyEval(this.numeratorCoeffs, x);
				const Pp = this.polyDeriv(this.numeratorCoeffs);
				const Qp = this.polyDeriv(this.denominatorCoeffs);
				const dP = this.polyEval(Pp, x);
				const dQ = this.polyEval(Qp, x);
				y = (dP * Q - P * dQ) / (Q * Q);
			}
            } else {
       continue;
          }
            
   const px = this.xToPixel(x);
            const py = this.yToPixel(y);
   
            if (this.isValidY(y) && isFinite(py) && Math.abs(y) < 100000) {
				if (!isFirstPoint && this.shouldBreakSegment(prevY, y, yRange)) {
					isFirstPoint = true;
				}
				if (isFirstPoint) {
					this.ctx.moveTo(px, py);
					isFirstPoint = false;
				} else {
					this.ctx.lineTo(px, py);
				}
				prevY = y;
			} else {
				isFirstPoint = true;
				prevY = null;
			}
      }
  
        this.ctx.stroke();
        this.ctx.setLineDash([]);
 }
    
    /**
     * Рисует корни на графике
     */
    drawRoots() {
     const rootRadius = 7;
     const colors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];
        
        this.solution.roots.forEach((root, index) => {
   // Пропускаем комплексные корни
     if (typeof root.value !== 'number') return;
            
 const x = root.value;
    const y = 0; // Корни находятся на оси X
            const px = this.xToPixel(x);
const py = this.yToPixel(y);
  
          if (px >= this.padding && px <= this.canvas.width - this.padding) {
  const color = colors[index % colors.length];
      
           this.ctx.strokeStyle = color;
       this.ctx.lineWidth = 2;
         
       // Рисуем круг
       this.ctx.beginPath();
        this.ctx.arc(px, py, rootRadius, 0, 2 * Math.PI);
       this.ctx.stroke();
    
   // Рисуем точку в центре
     this.ctx.fillStyle = color;
       this.ctx.beginPath();
 this.ctx.arc(px, py, 3, 0, 2 * Math.PI);
      this.ctx.fill();

 // Подпись корня
          this.ctx.fillStyle = color;
           this.ctx.font = 'bold 12px sans-serif';
           this.ctx.textAlign = 'center';
            this.ctx.fillText(`x = ${root.display}`, px, py - rootRadius - 12);
    }
        });
    }
    
    /**
     * Рисует особенные точки (вершина, экстремумы)
     */
    drawSpecialPoints() {
   const equationType = this.solution?.equationType || 'quadratic';
        
    if (equationType === 'quadratic' && this.a !== 0) {
       this.drawQuadraticVertex();
        } else if (equationType === 'cubic' && this.a !== 0) {
     this.drawCubicExtrema();
        }
    }
    
    /**
     * Рисует вершину параболы
  */
    drawQuadraticVertex() {
        const xVertex = -this.b / (2 * this.a);
        const yVertex = this.a * xVertex * xVertex + this.b * xVertex + this.c;
        
    this.drawPointWithLabel(xVertex, yVertex, 'Вершина', '#8b5cf6');
    }
    
    /**
     * Рисует экстремумы кубической функции
     */
    drawCubicExtrema() {
        // f'(x) = 3ax² + 2bx + c = 0
        const D = 4 * this.b * this.b - 12 * this.a * this.c;
    
        if (D >= 0) {
 const sqrtD = Math.sqrt(D);
            const x1 = (-2 * this.b + sqrtD) / (6 * this.a);
      const x2 = (-2 * this.b - sqrtD) / (6 * this.a);
     
            const y1 = this.a * x1 * x1 * x1 + this.b * x1 * x1 + this.c * x1 + this.d;
            const y2 = this.a * x2 * x2 * x2 + this.b * x2 * x2 + this.c * x2 + this.d;
            
    this.drawPointWithLabel(x1, y1, 'Локальный экстремум', '#8b5cf6');
  this.drawPointWithLabel(x2, y2, 'Локальный экстремум', '#8b5cf6');
        }
    }
    
    /**
   * Вспомогательный метод для рисования точки с подписью
 */
    drawPointWithLabel(xPoint, yPoint, label, color) {
        const px = this.xToPixel(xPoint);
     const py = this.yToPixel(yPoint);
        
        if (px >= this.padding && px <= this.canvas.width - this.padding &&
  py >= this.padding && py <= this.canvas.height - this.padding) {
            
        // Рисуем точку
            this.ctx.fillStyle = color;
    this.ctx.beginPath();
   this.ctx.arc(px, py, 5, 0, 2 * Math.PI);
     this.ctx.fill();
  
        // Подпись
   this.ctx.fillStyle = color;
       this.ctx.font = 'bold 11px sans-serif';
            this.ctx.textAlign = 'center';
  this.ctx.fillText(
         `${label}(${xPoint.toFixed(2)}, ${yPoint.toFixed(2)})`,
        px,
          py - 15
          );
}
    }
    
    /**
   * Извлекает коэффициенты из решения
     */
    extractCoefficients() {
        const equationType = this.solution?.equationType || 'quadratic';
        
   // Инициализируем все коэффициенты
        this.a = 0;
   this.b = 0;
        this.c = 0;
        this.d = 0;
		this.numeratorCoeffs = null;
		this.denominatorCoeffs = null;
        
  if (equationType === 'quadratic') {
       this.a = parseFloat(this.solution.a) || 1;
this.b = parseFloat(this.solution.b) || 0;
   this.c = parseFloat(this.solution.c) || 0;
 } else if (equationType === 'linear') {
   this.a = parseFloat(this.solution.a) || 1;
  this.b = parseFloat(this.solution.b) || 0;
      } else if (equationType === 'cubic') {
 this.a = parseFloat(this.solution.a) || 1;
        this.b = parseFloat(this.solution.b) || 0;
     this.c = parseFloat(this.solution.c) || 0;
   this.d = parseFloat(this.solution.d) || 0;
        } else if (equationType === 'biquadratic') {
      this.a = parseFloat(this.solution.a) || 1;
 this.b = parseFloat(this.solution.b) || 0;
         this.c = parseFloat(this.solution.c) || 0;
        }
		else if (equationType === 'rational') {
			this.numeratorCoeffs = Array.isArray(this.solution.numeratorCoeffs) ? this.solution.numeratorCoeffs : null;
			this.denominatorCoeffs = Array.isArray(this.solution.denominatorCoeffs) ? this.solution.denominatorCoeffs : null;
		}
    }
    
    /**
     * Отображает информацию о функции
     */
    drawInfo() {
        const equationType = this.solution?.equationType || 'quadratic';
        
        let formulaText = '';
    
        if (equationType === 'quadratic') {
      formulaText = `y = ${this.formatCoefficient(this.a)}x² ${this.formatSign(this.b)}${Math.abs(this.b)}x ${this.formatSign(this.c)}${Math.abs(this.c)}`;
        } else if (equationType === 'linear') {
            formulaText = `y = ${this.formatCoefficient(this.a)}x ${this.formatSign(this.b)}${Math.abs(this.b)}`;
        } else if (equationType === 'cubic') {
            formulaText = `y = ${this.formatCoefficient(this.a)}x³ ${this.formatSign(this.b)}${Math.abs(this.b)}x² ${this.formatSign(this.c)}${Math.abs(this.c)}x ${this.formatSign(this.d)}${Math.abs(this.d)}`;
        } else if (equationType === 'biquadratic') {
            formulaText = `y = ${this.formatCoefficient(this.a)}x⁴ ${this.formatSign(this.b)}${Math.abs(this.b)}x² ${this.formatSign(this.c)}${Math.abs(this.c)}`;
		} else if (equationType === 'rational') {
			formulaText = `y = (${this.solution?.numerator || 'P(x)'}) / (${this.solution?.denominator || 'Q(x)'})`;
        }
        
        const info = [
            formulaText,
       `Масштаб: ${this.zoomLevel.toFixed(1)}x`,
 `Тип: ${this.getTypeLabel(equationType)}`
];
        
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(10, 10, 400, info.length * 20 + 10);
        
        this.ctx.fillStyle = 'white';
    this.ctx.font = '11px monospace';
    this.ctx.textAlign = 'left';
        
    info.forEach((text, i) => {
            this.ctx.fillText(text, 15, 25 + i * 20);
        });
    }
    
    /**
     * Вспомогательные методы для форматирования
 */
    formatCoefficient(coeff) {
  if (coeff === 1) return '';
        if (coeff === -1) return '-';
        return coeff.toFixed(2);
    }
    
    formatSign(num) {
        return num >= 0 ? '+ ' : '- ';
    }
    
    getTypeLabel(type) {
        const labels = {
          'quadratic': 'Парабола',
  'linear': 'Прямая',
            'cubic': 'Кубическая',
      'biquadratic': 'Биквадратная',
			'rational': 'Рациональная'
    };
     return labels[type] || type;
    }
    
    /**
     * Преобразует координату x в пиксели
   */
    xToPixel(x) {
 const xRange = this.getXRange();
        const canvasWidth = this.canvas.width - 2 * this.padding;
        return this.padding + ((x - xRange.min) / (xRange.max - xRange.min)) * canvasWidth;
    }
    
    /**
     * Преобразует координату y в пиксели
     */
    yToPixel(y) {
        const yRange = this.getYRange();
        const canvasHeight = this.canvas.height - 2 * this.padding;
        return this.canvas.height - this.padding - ((y - yRange.min) / (yRange.max - yRange.min)) * canvasHeight;
    }
    
    /**
     * Получает диапазон x
     */
    getXRange() {
        const baseRange = 10 / this.zoomLevel;
        return {
            min: -baseRange / 2 + this.panX,
max: baseRange / 2 + this.panX
        };
    }
    
    /**
     * Получает диапазон y
     */
    getYRange() {
        const baseRange = 10 / this.zoomLevel;
        const canvasRatio = this.canvas.height / this.canvas.width;
        const yRange = baseRange * canvasRatio;
        
        return {
            min: -yRange / 2 + this.panY,
         max: yRange / 2 + this.panY
      };
 }
    
    /**
     * Управление масштабом
     */
    zoomIn() {
   this.zoomLevel = Math.min(this.zoomLevel * 1.2, this.maxZoom);
        this.drawGraph();
    }
    
    zoomOut() {
        this.zoomLevel = Math.max(this.zoomLevel / 1.2, this.minZoom);
        this.drawGraph();
    }
    
    resetZoom() {
   this.zoomLevel = 1;
        this.panX = 0;
        this.panY = 0;
        this.drawGraph();
    }
    
    /**
     * Автомасштабирование под корни
     */
    autoScale() {
   if (!this.solution?.roots || this.solution.roots.length === 0) {
      this.resetZoom();
       return;
      }
        
        const xValues = this.solution.roots
            .map(r => typeof r.value === 'number' ? r.value : null)
 .filter(v => v !== null);
        
    if (xValues.length > 0) {
            const minX = Math.min(...xValues);
            const maxX = Math.max(...xValues);
 const range = Math.max(Math.abs(maxX - minX), 2);
      
this.zoomLevel = 10 / (range * 1.5);
          this.panX = (minX + maxX) / 2;
        }
        
        this.drawGraph();
    }
    
    /**
     * Обновление размера canvas
     */
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.drawGraph();
    }
    
    /**
     * Установка типа графика
     */
    setGraphType(type) {
        this.graphType = type || 'function';
   this.drawGraph();
    }
}
