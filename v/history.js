/* ==========================================
   РАСШИРЕННЫЙ МОДУЛЬ УПРАВЛЕНИЯ ИСТОРИЕЙ
   ========================================== */

export class HistoryManager {
    constructor() {
        this.storageKey = 'equationSolverHistory';
        this.maxItems = 50;
        this.history = this.loadHistory();
    }
    
    /**
     * Загружает историю из localStorage
     */
    loadHistory() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
         console.error('Ошибка при загрузке истории:', e);
 return [];
        }
  }
    
    /**
   * Сохраняет историю в localStorage
     */
    saveHistory() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.history));
        } catch (e) {
        console.error('Ошибка при сохранении истории:', e);
        }
    }
    
/**
     * Добавляет решение в историю
     */
    addSolution(details, solution) {
        const equation = this.formatEquation(details, solution);
        
        // Проверяем, есть ли уже такое уравнение
        const existingIndex = this.history.findIndex(item => item.equation === equation);
        if (existingIndex !== -1) {
 this.history.splice(existingIndex, 1);
        }
        
    const item = {
            equation: equation,
            data: { ...details },
        solution: solution,
       date: new Date().toISOString(),
            displayDate: this.formatDate(new Date()),
          type: solution.equationType || 'quadratic'
        };
        
        this.history.unshift(item);
    
        // Ограничиваем размер истории
        if (this.history.length > this.maxItems) {
            this.history = this.history.slice(0, this.maxItems);
}
     
        this.saveHistory();
        return item;
 }
    
    /**
     * Получает всю историю
     */
    getHistory(filter = 'all') {
        if (filter === 'all') {
return this.history;
        }
        
        if (filter === 'recent') {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
          return this.history.filter(item => new Date(item.date) > oneDayAgo);
        }
      
        return this.history.filter(item => item.type === filter);
    }
    
    /**
     * Удаляет решение из истории
     */
    removeSolution(equation) {
        const index = this.history.findIndex(item => item.equation === equation);
        if (index !== -1) {
            this.history.splice(index, 1);
       this.saveHistory();
            return true;
        }
        return false;
    }
    
    /**
     * Очищает всю историю
     */
    clearHistory() {
      this.history = [];
        this.saveHistory();
    }
    
    /**
     * Форматирует уравнение для отображения
     */
    formatEquation(details, solution) {
        const type = solution?.equationType || 'quadratic';

        if (type === 'system') {
            const a1 = details?.a1;
            const b1 = details?.b1;
            const c1 = details?.c1;
            const a2 = details?.a2;
            const b2 = details?.b2;
            const c2 = details?.c2;
            return `${a1}x + ${b1}y = ${c1}; ${a2}x + ${b2}y = ${c2}`;
        }

        if (type === 'rational') {
            const numerator = details?.numerator ?? solution?.numerator ?? '';
            const denominator = details?.denominator ?? solution?.denominator ?? '';
            return `(${numerator}) / (${denominator}) = 0`;
        }

        if (type === 'cubic') {
            return `${details?.a}x³ + ${details?.b}x² + ${details?.c}x + ${details?.d} = 0`;
        }

        if (type === 'linear') {
            return `${details?.a}x + ${details?.b} = 0`;
        }

        if (type === 'biquadratic') {
            return `${details?.a}x⁴ + ${details?.b}x² + ${details?.c} = 0`;
        }

        const a = details?.a;
        const b = details?.b;
        const c = details?.c;

        const terms = [];

        if (a !== 0 && a !== '0' && a !== undefined) {
            const aStr = a === 1 || a === '1' ? '' : a === -1 || a === '-1' ? '-' : a;
            terms.push(`${aStr}x²`);
        }

        if (b !== 0 && b !== '0' && b !== undefined) {
            const bNum = parseFloat(b);
            const sign = bNum > 0 && terms.length > 0 ? '+' : '';
            const bStr = Math.abs(bNum) === 1 ? '' : Math.abs(bNum);
            terms.push(`${sign}${bStr}x`);
        }

        if ((c !== 0 && c !== '0' && c !== undefined) || terms.length === 0) {
            const cNum = parseFloat(c);
            const sign = cNum > 0 && terms.length > 0 ? '+' : '';
            terms.push(`${sign}${c}`);
        }

        return terms.join(' ') + ' = 0';
    }
    
    /**
   * Форматирует дату
     */
    formatDate(date) {
   const now = new Date();
        const diff = now - date;
        
        // Менее минуты назад
        if (diff < 60000) {
            return 'только что';
    }
        
        // Менее часа назад
  if (diff < 3600000) {
         const minutes = Math.floor(diff / 60000);
      return `${minutes}м назад`;
 }
      
    // Менее суток назад
     if (diff < 86400000) {
            const hours = Math.floor(diff / 3600000);
            return `${hours}ч назад`;
      }
     
        // Меньше недели назад
        if (diff < 604800000) {
        const days = Math.floor(diff / 86400000);
    return `${days}д назад`;
        }
   
        // Иначе показываем полную дату
     return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
     month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    /**
     * Получает статистику истории
   */
    getStatistics() {
        const stats = {
   totalSolutions: this.history.length,
            linearEquations: 0,
     quadraticEquations: 0,
      complexRoots: 0,
            noRoots: 0,
    todaySolutions: 0
        };
        
   const today = new Date();
  today.setHours(0, 0, 0, 0);
        
     this.history.forEach(item => {
        const itemDate = new Date(item.date);
        itemDate.setHours(0, 0, 0, 0);
            
       if (itemDate.getTime() === today.getTime()) {
    stats.todaySolutions++;
          }
 
          if (item.solution && item.solution.equationType) {
          if (item.solution.equationType === 'linear') {
        stats.linearEquations++;
   } else if (item.solution.equationType === 'quadratic') {
          stats.quadraticEquations++;
         
      if (item.solution.discriminant < 0) {
   stats.complexRoots++;
} else if (item.solution.roots && item.solution.roots.length === 0) {
           stats.noRoots++;
       }
          }
  }
        });
        
        return stats;
    }
    
    /**
     * Экспортирует историю в JSON
     */
    exportAsJSON() {
     return JSON.stringify(this.history, null, 2);
    }
    
    /**
     * Экспортирует историю в текст
     */
  exportAsText() {
        let text = 'ИСТОРИЯ РЕШЕНИЯ УРАВНЕНИЙ\n';
        text += '='.repeat(70) + '\n\n';
   
        this.history.forEach((item, index) => {
       text += `${index + 1}. ${item.equation}\n`;
          text += `   Дата: ${item.displayDate}\n`;
            text += `   Тип: ${item.type}\n`;
            
   if (item.solution && item.solution.roots) {
         text += `   Корни: `;
           if (item.solution.roots.length === 0) {
     text += 'нет корней';
} else if (item.solution.roots[0].value === '∞') {
         text += 'бесконечно много решений';
     } else {
          text += item.solution.roots.map(r => r.display).join(', ');
 }
         text += '\n';
      }
         
         text += '\n';
        });
        
 // Добавляем статистику
        const stats = this.getStatistics();
        text += '\n' + '='.repeat(70) + '\n';
        text += 'СТАТИСТИКА\n';
        text += '='.repeat(70) + '\n';
        text += `Всего решений: ${stats.totalSolutions}\n`;
        text += `Квадратных уравнений: ${stats.quadraticEquations}\n`;
        text += `Линейных уравнений: ${stats.linearEquations}\n`;
  text += `Сложных корней: ${stats.complexRoots}\n`;
      text += `Без решений: ${stats.noRoots}\n`;
    text += `Сегодня решено: ${stats.todaySolutions}\n`;
        
        return text;
    }
    
    /**
     * Экспортирует историю как CSV
     */
    exportAsCSV() {
  let csv = 'Уравнение,Коэффициент A,Коэффициент B,Коэффициент C,Корни,Дата,Тип\n';
        
        this.history.forEach(item => {
     const roots = item.solution?.roots?.map(r => r.display).join(';') || 'Нет корней';
     const data = item.data || {};
     csv += `"${item.equation}",${data.a ?? ''},${data.b ?? ''},${data.c ?? ''},"${roots}",${item.displayDate},${item.type}\n`;
        });
        
        return csv;
    }
    
    /**
     * Импортирует историю из JSON
     */
    importFromJSON(jsonString) {
        try {
   const imported = JSON.parse(jsonString);
      if (Array.isArray(imported)) {
            this.history = [...imported, ...this.history];
      if (this.history.length > this.maxItems) {
            this.history = this.history.slice(0, this.maxItems);
                }
      this.saveHistory();
                return true;
       }
   } catch (e) {
   console.error('Ошибка при импорте истории:', e);
 }
      return false;
    }
    
    /**
     * Ищет решения в истории
     */
  search(query) {
        const lowerQuery = query.toLowerCase();
        return this.history.filter(item => 
   item.equation.toLowerCase().includes(lowerQuery) ||
            item.displayDate.toLowerCase().includes(lowerQuery)
        );
    }
    
    /**
     * Получает наиболее часто используемые коэффициенты
     */
    getMostFrequentCoefficients() {
        const aFreq = {};
        const bFreq = {};
  const cFreq = {};
        
        this.history.forEach(item => {
            const data = item.data || {};
            if (data.a !== undefined) aFreq[data.a] = (aFreq[data.a] || 0) + 1;
            if (data.b !== undefined) bFreq[data.b] = (bFreq[data.b] || 0) + 1;
            if (data.c !== undefined) cFreq[data.c] = (cFreq[data.c] || 0) + 1;
        });
        
        return {
 a: Object.keys(aFreq).sort((a, b) => aFreq[b] - aFreq[a]).slice(0, 5),
            b: Object.keys(bFreq).sort((a, b) => bFreq[b] - bFreq[a]).slice(0, 5),
       c: Object.keys(cFreq).sort((a, b) => cFreq[b] - cFreq[a]).slice(0, 5)
        };
    }
}
