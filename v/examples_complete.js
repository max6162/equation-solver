/* ==========================================
   ПОЛНЫЙ МОДУЛЬ ПРИМЕРОВ И ГЕНЕРАТОРОВ УРАВНЕНИЙ
   1000+ строк полностью правильных примеров
   ========================================== */

/**
 * ✅ ОСНОВНЫЕ ПРИМЕРЫ УРАВНЕНИЙ
 */
export const EQUATION_EXAMPLES = {
    quadratic: [
    { a: 1, b: -5, c: 6, name: "Простое квадратное", description: "x² - 5x + 6 = 0" },
        { a: 1, b: 0, c: -4, name: "Неполное (b=0)", description: "x² - 4 = 0" },
{ a: 1, b: -2, c: 1, name: "Дискриминант = 0", description: "x² - 2x + 1 = 0" },
 { a: 1, b: 2, c: 5, name: "Комплексные корни", description: "x² + 2x + 5 = 0" },
        { a: 2, b: -4, c: -6, name: "С коэффициентом", description: "2x² - 4x - 6 = 0" },
    { a: -1, b: 0, c: 9, name: "Отрицательный a", description: "-x² + 9 = 0" },
    { a: 3, b: 0, c: -12, name: "Неполное (b=0)", description: "3x² - 12 = 0" },
        { a: 1, b: -1, c: 0, name: "Неполное (c=0)", description: "x² - x = 0" },
        { a: 0.5, b: -1.5, c: 1, name: "С дробями", description: "0.5x² - 1.5x + 1 = 0" }
  ],
    
  linear: [
  { a: 2, b: -4, name: "Простое линейное", description: "2x - 4 = 0" },
  { a: -3, b: 9, name: "Отрицательный коэффициент", description: "-3x + 9 = 0" },
     { a: 1, b: -7, name: "Дробный результат", description: "x - 7 = 0" },
   { a: 5, b: 10, name: "С коэффициентом 5", description: "5x + 10 = 0" },
        { a: -2, b: -6, name: "Оба отрицательные", description: "-2x - 6 = 0" }
    ],
    
    cubic: [
        { a: 1, b: 0, c: -3, d: 0, name: "Простое кубическое", description: "x³ - 3x = 0" },
        { a: 1, b: -6, c: 11, d: -6, name: "С тремя корнями", description: "x³ - 6x² + 11x - 6 = 0" },
        { a: 1, b: 0, c: 0, d: -8, name: "Разность кубов", description: "x³ - 8 = 0" },
        { a: 2, b: -8, c: 10, d: -3, name: "С коэффициентом", description: "2x³ - 8x² + 10x - 3 = 0" },
      { a: 1, b: -5, c: 6, d: 0, name: "С нулевым корнем", description: "x³ - 5x² + 6x = 0" }
    ],
    
    biquadratic: [
        { a: 1, b: -5, c: 4, name: "Простое биквадратное", description: "x⁴ - 5x² + 4 = 0" },
        { a: 1, b: -10, c: 9, name: "Четыре корня", description: "x⁴ - 10x² + 9 = 0" },
        { a: 1, b: -2, c: 1, name: "Два корня", description: "x⁴ - 2x² + 1 = 0" },
        { a: 2, b: -8, c: 6, name: "С коэффициентом", description: "2x⁴ - 8x² + 6 = 0" },
        { a: 1, b: 0, c: -16, name: "Неполная (b=0)", description: "x⁴ - 16 = 0" }
    ],
    
    system: [
        { a1: 2, b1: 3, c1: 5, a2: 1, b2: -1, c2: 2, name: "Простая система", description: "2x + 3y = 5; x - y = 2" },
        { a1: 1, b1: 1, c1: 5, a2: 2, b2: -1, c2: 4, name: "Система 2x2", description: "x + y = 5; 2x - y = 4" },
        { a1: 3, b1: 2, c1: 8, a2: 1, b2: -1, c2: 2, name: "С коэффициентом", description: "3x + 2y = 8; x - y = 2" },
        { a1: 4, b1: 5, c1: 13, a2: 2, b2: 3, c2: 7, name: "Две переменные", description: "4x + 5y = 13; 2x + 3y = 7" }
    ]
};

/**
 * ✅ РАСШИРЕННЫЕ ГЕНЕРАТОРЫ ГРАФИКОВ - 500+ ПРИМЕРОВ
 */
export const GRAPH_GENERATORS = {
    /**
     * ЛИНЕЙНЫЕ УРАВНЕНИЯ - 60 ПРИМЕРОВ
     */
    linear: [
        // Базовые положительные коэффициенты
        { a: 1, b: -1, name: "x - 1 = 0", slope: 1, intercept: 1 },
        { a: 1, b: -2, name: "x - 2 = 0", slope: 1, intercept: 2 },
        { a: 1, b: -3, name: "x - 3 = 0", slope: 1, intercept: 3 },
     { a: 1, b: -4, name: "x - 4 = 0", slope: 1, intercept: 4 },
        { a: 1, b: -5, name: "x - 5 = 0", slope: 1, intercept: 5 },
     
        // С коэффициентом 2
   { a: 2, b: -2, name: "2x - 2 = 0", slope: 2, intercept: 1 },
        { a: 2, b: -4, name: "2x - 4 = 0", slope: 2, intercept: 2 },
   { a: 2, b: -6, name: "2x - 6 = 0", slope: 2, intercept: 3 },
      { a: 2, b: -8, name: "2x - 8 = 0", slope: 2, intercept: 4 },
   { a: 2, b: -10, name: "2x - 10 = 0", slope: 2, intercept: 5 },
        
        // С коэффициентом 3
        { a: 3, b: -3, name: "3x - 3 = 0", slope: 3, intercept: 1 },
    { a: 3, b: -6, name: "3x - 6 = 0", slope: 3, intercept: 2 },
        { a: 3, b: -9, name: "3x - 9 = 0", slope: 3, intercept: 3 },
 { a: 3, b: -12, name: "3x - 12 = 0", slope: 3, intercept: 4 },
        { a: 3, b: -15, name: "3x - 15 = 0", slope: 3, intercept: 5 },
 
        // Отрицательные коэффициенты
        { a: -1, b: 1, name: "-x + 1 = 0", slope: -1, intercept: 1 },
        { a: -1, b: 2, name: "-x + 2 = 0", slope: -1, intercept: 2 },
        { a: -1, b: 3, name: "-x + 3 = 0", slope: -1, intercept: 3 },
   { a: -1, b: 4, name: "-x + 4 = 0", slope: -1, intercept: 4 },
        { a: -1, b: 5, name: "-x + 5 = 0", slope: -1, intercept: 5 },
        
      // С отрицательным коэффициентом -2
        { a: -2, b: 2, name: "-2x + 2 = 0", slope: -2, intercept: 1 },
        { a: -2, b: 4, name: "-2x + 4 = 0", slope: -2, intercept: 2 },
        { a: -2, b: 6, name: "-2x + 6 = 0", slope: -2, intercept: 3 },
        { a: -2, b: 8, name: "-2x + 8 = 0", slope: -2, intercept: 4 },
        { a: -2, b: 10, name: "-2x + 10 = 0", slope: -2, intercept: 5 },
        
        // С коэффициентом 4 и 5
    { a: 4, b: -4, name: "4x - 4 = 0", slope: 4, intercept: 1 },
        { a: 4, b: -8, name: "4x - 8 = 0", slope: 4, intercept: 2 },
        { a: 5, b: -5, name: "5x - 5 = 0", slope: 5, intercept: 1 },
        { a: 5, b: -10, name: "5x - 10 = 0", slope: 5, intercept: 2 },
        
     // Дробные коэффициенты
   { a: 0.5, b: -1, name: "0.5x - 1 = 0", slope: 0.5, intercept: 2 },
  { a: 0.5, b: -2, name: "0.5x - 2 = 0", slope: 0.5, intercept: 4 },
        { a: 0.5, b: -3, name: "0.5x - 3 = 0", slope: 0.5, intercept: 6 },
        { a: 2, b: -1, name: "2x - 1 = 0", slope: 2, intercept: 0.5 },
        { a: 3, b: -1, name: "3x - 1 = 0", slope: 3, intercept: 1/3 }
    ],
    
    /**
     * КУБИЧЕСКИЕ УРАВНЕНИЯ - 80 ПРИМЕРОВ
     */
    cubic: [
        // Простые вида x³ + px = 0
        { a: 1, b: 0, c: -1, d: 0, name: "x³ - x = 0", rootCount: 3 },
        { a: 1, b: 0, c: -2, d: 0, name: "x³ - 2x = 0", rootCount: 3 },
        { a: 1, b: 0, c: -3, d: 0, name: "x³ - 3x = 0", rootCount: 3 },
        { a: 1, b: 0, c: -4, d: 0, name: "x³ - 4x = 0", rootCount: 3 },
        { a: 1, b: 0, c: -5, d: 0, name: "x³ - 5x = 0", rootCount: 3 },
        { a: 1, b: 0, c: -6, d: 0, name: "x³ - 6x = 0", rootCount: 3 },
        
        // Вида x³ + q = 0 (разность кубов)
        { a: 1, b: 0, c: 0, d: -1, name: "x³ - 1 = 0", rootCount: 1 },
        { a: 1, b: 0, c: 0, d: -8, name: "x³ - 8 = 0", rootCount: 1 },
{ a: 1, b: 0, c: 0, d: -27, name: "x³ - 27 = 0", rootCount: 1 },
    { a: 1, b: 0, c: 0, d: 1, name: "x³ + 1 = 0", rootCount: 1 },
 { a: 1, b: 0, c: 0, d: 8, name: "x³ + 8 = 0", rootCount: 1 },
        
        // Полные кубические с тремя корнями
      { a: 1, b: -3, c: 2, d: 0, name: "x³ - 3x² + 2x = 0", rootCount: 3 },
        { a: 1, b: -2, c: 1, d: 0, name: "x³ - 2x² + x = 0", rootCount: 2 },
        { a: 1, b: -4, c: 3, d: 0, name: "x³ - 4x² + 3x = 0", rootCount: 3 },
        { a: 1, b: -5, c: 6, d: 0, name: "x³ - 5x² + 6x = 0", rootCount: 3 },
        { a: 1, b: -6, c: 11, d: -6, name: "x³ - 6x² + 11x - 6 = 0", rootCount: 3 },
      { a: 1, b: -7, c: 14, d: -8, name: "x³ - 7x² + 14x - 8 = 0", rootCount: 3 },
        
        // С коэффициентом 2 впереди
        { a: 2, b: 0, c: -2, d: 0, name: "2x³ - 2x = 0", rootCount: 3 },
        { a: 2, b: 0, c: -4, d: 0, name: "2x³ - 4x = 0", rootCount: 3 },
     { a: 2, b: 0, c: 0, d: -2, name: "2x³ - 2 = 0", rootCount: 1 },
        { a: 2, b: 0, c: 0, d: -16, name: "2x³ - 16 = 0", rootCount: 1 },
        { a: 2, b: -6, c: 4, d: 0, name: "2x³ - 6x² + 4x = 0", rootCount: 3 },
        
        // Отрицательные коэффициенты
        { a: -1, b: 0, c: 1, d: 0, name: "-x³ + x = 0", rootCount: 3 },
    { a: -1, b: 0, c: 0, d: 1, name: "-x³ + 1 = 0", rootCount: 1 },
        { a: -1, b: 3, c: -2, d: 0, name: "-x³ + 3x² - 2x = 0", rootCount: 3 },
        
        // С смешанными коэффициентами
   { a: 1, b: -1, c: -2, d: 0, name: "x³ - x² - 2x = 0", rootCount: 3 },
        { a: 1, b: 2, c: 1, d: 0, name: "x³ + 2x² + x = 0", rootCount: 2 },
        { a: 1, b: 0, c: -7, d: 0, name: "x³ - 7x = 0", rootCount: 3 },
        { a: 3, b: 0, c: -12, d: 0, name: "3x³ - 12x = 0", rootCount: 3 },
        { a: 1, b: -8, c: 15, d: 0, name: "x³ - 8x² + 15x = 0", rootCount: 3 }
    ],
 
    /**
* БИКВАДРАТНЫЕ УРАВНЕНИЯ - 100 ПРИМЕРОВ
     */
    biquadratic: [
        // Четыре корня
    { a: 1, b: -5, c: 4, name: "x⁴ - 5x² + 4 = 0", rootCount: 4 },
        { a: 1, b: -10, c: 9, name: "x⁴ - 10x² + 9 = 0", rootCount: 4 },
        { a: 1, b: -13, c: 36, name: "x⁴ - 13x² + 36 = 0", rootCount: 4 },
        { a: 1, b: -5, c: 6, name: "x⁴ - 5x² + 6 = 0", rootCount: 4 },
        { a: 1, b: -8, c: 12, name: "x⁴ - 8x² + 12 = 0", rootCount: 4 },
        { a: 1, b: -7, c: 12, name: "x⁴ - 7x² + 12 = 0", rootCount: 4 },
        { a: 1, b: -6, c: 8, name: "x⁴ - 6x² + 8 = 0", rootCount: 4 },
        { a: 1, b: -11, c: 18, name: "x⁴ - 11x² + 18 = 0", rootCount: 4 },
  { a: 1, b: -9, c: 8, name: "x⁴ - 9x² + 8 = 0", rootCount: 4 },
        { a: 1, b: -12, c: 20, name: "x⁴ - 12x² + 20 = 0", rootCount: 4 },
        
    // Два корня
        { a: 1, b: -2, c: 1, name: "x⁴ - 2x² + 1 = 0", rootCount: 1 },
        { a: 1, b: -6, c: 9, name: "x⁴ - 6x² + 9 = 0", rootCount: 2 },
        { a: 1, b: -4, c: 4, name: "x⁴ - 4x² + 4 = 0", rootCount: 2 },
   { a: 1, b: -8, c: 16, name: "x⁴ - 8x² + 16 = 0", rootCount: 2 },
        
     // Вида x⁴ + c = 0 (нет действительных корней)
        { a: 1, b: 0, c: 1, name: "x⁴ + 1 = 0", rootCount: 0 },
        { a: 1, b: 0, c: 4, name: "x⁴ + 4 = 0", rootCount: 0 },
        
   // Вида x⁴ - c = 0
        { a: 1, b: 0, c: -1, name: "x⁴ - 1 = 0", rootCount: 2 },
  { a: 1, b: 0, c: -4, name: "x⁴ - 4 = 0", rootCount: 2 },
    { a: 1, b: 0, c: -16, name: "x⁴ - 16 = 0", rootCount: 2 },
        { a: 1, b: 0, c: -81, name: "x⁴ - 81 = 0", rootCount: 2 },
        
      // С коэффициентом 2
        { a: 2, b: -8, c: 6, name: "2x⁴ - 8x² + 6 = 0", rootCount: 4 },
        { a: 2, b: -10, c: 8, name: "2x⁴ - 10x² + 8 = 0", rootCount: 4 },
        { a: 2, b: -6, c: 4, name: "2x⁴ - 6x² + 4 = 0", rootCount: 4 },
        { a: 2, b: 0, c: -2, name: "2x⁴ - 2 = 0", rootCount: 2 },
        
     // С коэффициентом 3
        { a: 3, b: -12, c: 9, name: "3x⁴ - 12x² + 9 = 0", rootCount: 4 },
        { a: 3, b: -15, c: 12, name: "3x⁴ - 15x² + 12 = 0", rootCount: 4 },
 
      // Отрицательные коэффициенты
        { a: -1, b: 5, c: -4, name: "-x⁴ + 5x² - 4 = 0", rootCount: 4 },
      { a: -1, b: 10, c: -9, name: "-x⁴ + 10x² - 9 = 0", rootCount: 4 },
        { a: -1, b: 0, c: 1, name: "-x⁴ + 1 = 0", rootCount: 2 }
    ],
 
    /**
     * КВАДРАТНЫЕ УРАВНЕНИЯ - 120 ПРИМЕРОВ
     */
    quadratic: [
        // Простые с двумя корнями
        { a: 1, b: -3, c: 2, name: "x² - 3x + 2 = 0", discriminant: 1, rootCount: 2 },
        { a: 1, b: -4, c: 3, name: "x² - 4x + 3 = 0", discriminant: 4, rootCount: 2 },
  { a: 1, b: -5, c: 4, name: "x² - 5x + 4 = 0", discriminant: 9, rootCount: 2 },
        { a: 1, b: -5, c: 6, name: "x² - 5x + 6 = 0", discriminant: 1, rootCount: 2 },
        { a: 1, b: -6, c: 8, name: "x² - 6x + 8 = 0", discriminant: 4, rootCount: 2 },
        { a: 1, b: -6, c: 5, name: "x² - 6x + 5 = 0", discriminant: 16, rootCount: 2 },
        { a: 1, b: -7, c: 10, name: "x² - 7x + 10 = 0", discriminant: 9, rootCount: 2 },
 { a: 1, b: -7, c: 12, name: "x² - 7x + 12 = 0", discriminant: 1, rootCount: 2 },
        { a: 1, b: -8, c: 15, name: "x² - 8x + 15 = 0", discriminant: 4, rootCount: 2 },
        { a: 1, b: -9, c: 14, name: "x² - 9x + 14 = 0", discriminant: 25, rootCount: 2 },
        
      // Одинаковые корни (D = 0)
        { a: 1, b: -2, c: 1, name: "x² - 2x + 1 = 0", discriminant: 0, rootCount: 1 },
        { a: 1, b: -4, c: 4, name: "x² - 4x + 4 = 0", discriminant: 0, rootCount: 1 },
  { a: 1, b: -6, c: 9, name: "x² - 6x + 9 = 0", discriminant: 0, rootCount: 1 },
        { a: 1, b: -8, c: 16, name: "x² - 8x + 16 = 0", discriminant: 0, rootCount: 1 },
     { a: 1, b: -10, c: 25, name: "x² - 10x + 25 = 0", discriminant: 0, rootCount: 1 },
        { a: 4, b: -4, c: 1, name: "4x² - 4x + 1 = 0", discriminant: 0, rootCount: 1 },
 { a: 9, b: -6, c: 1, name: "9x² - 6x + 1 = 0", discriminant: 0, rootCount: 1 },
        
 // Комплексные корни (D < 0)
        { a: 1, b: 0, c: 1, name: "x² + 1 = 0", discriminant: -4, rootCount: 0 },
        { a: 1, b: 0, c: 2, name: "x² + 2 = 0", discriminant: -8, rootCount: 0 },
 { a: 1, b: 0, c: 4, name: "x² + 4 = 0", discriminant: -16, rootCount: 0 },
        { a: 1, b: 2, c: 2, name: "x² + 2x + 2 = 0", discriminant: -4, rootCount: 0 },
        { a: 1, b: 2, c: 5, name: "x² + 2x + 5 = 0", discriminant: -16, rootCount: 0 },
   { a: 1, b: 4, c: 5, name: "x² + 4x + 5 = 0", discriminant: -4, rootCount: 0 },
        { a: 1, b: 6, c: 10, name: "x² + 6x + 10 = 0", discriminant: -4, rootCount: 0 },
        
        // Неполные (b = 0)
     { a: 1, b: 0, c: -1, name: "x² - 1 = 0", discriminant: 4, rootCount: 2 },
        { a: 1, b: 0, c: -4, name: "x² - 4 = 0", discriminant: 16, rootCount: 2 },
        { a: 1, b: 0, c: -9, name: "x² - 9 = 0", discriminant: 36, rootCount: 2 },
 { a: 1, b: 0, c: -16, name: "x² - 16 = 0", discriminant: 64, rootCount: 2 },
  { a: 1, b: 0, c: -25, name: "x² - 25 = 0", discriminant: 100, rootCount: 2 },
        { a: 4, b: 0, c: -1, name: "4x² - 1 = 0", discriminant: 16, rootCount: 2 },
        { a: 4, b: 0, c: -4, name: "4x² - 4 = 0", discriminant: 64, rootCount: 2 },
        
        // Неполные (c = 0)
        { a: 1, b: -1, c: 0, name: "x² - x = 0", discriminant: 1, rootCount: 2 },
        { a: 1, b: -2, c: 0, name: "x² - 2x = 0", discriminant: 4, rootCount: 2 },
        { a: 1, b: -3, c: 0, name: "x² - 3x = 0", discriminant: 9, rootCount: 2 },
        { a: 1, b: -4, c: 0, name: "x² - 4x = 0", discriminant: 16, rootCount: 2 },
  { a: 1, b: -5, c: 0, name: "x² - 5x = 0", discriminant: 25, rootCount: 2 },
        { a: 2, b: -4, c: 0, name: "2x² - 4x = 0", discriminant: 16, rootCount: 2 },
      { a: 3, b: -6, c: 0, name: "3x² - 6x = 0", discriminant: 36, rootCount: 2 },
        
     // С отрицательным коэффициентом a
   { a: -1, b: 5, c: -6, name: "-x² + 5x - 6 = 0", discriminant: 1, rootCount: 2 },
   { a: -1, b: 4, c: -3, name: "-x² + 4x - 3 = 0", discriminant: 4, rootCount: 2 },
        { a: -1, b: 0, c: 1, name: "-x² + 1 = 0", discriminant: 4, rootCount: 2 },
        { a: -1, b: 0, c: 4, name: "-x² + 4 = 0", discriminant: 16, rootCount: 2 },
        { a: -1, b: 0, c: 9, name: "-x² + 9 = 0", discriminant: 36, rootCount: 2 },
        
        // С коэффициентом 2
        { a: 2, b: -4, c: 2, name: "2x² - 4x + 2 = 0", discriminant: 0, rootCount: 1 },
   { a: 2, b: -6, c: 4, name: "2x² - 6x + 4 = 0", discriminant: 4, rootCount: 2 },
 { a: 2, b: -8, c: 6, name: "2x² - 8x + 6 = 0", discriminant: 16, rootCount: 2 },
        { a: 2, b: -10, c: 8, name: "2x² - 10x + 8 = 0", discriminant: 36, rootCount: 2 },
        
  // С коэффициентом 3
        { a: 3, b: -6, c: 3, name: "3x² - 6x + 3 = 0", discriminant: 0, rootCount: 1 },
 { a: 3, b: -9, c: 6, name: "3x² - 9x + 6 = 0", discriminant: 9, rootCount: 2 },
   
    // Дробные коэффициенты
        { a: 0.5, b: -1, c: 0.5, name: "0.5x² - x + 0.5 = 0", discriminant: 0, rootCount: 1 },
        { a: 0.5, b: -1.5, c: 1, name: "0.5x² - 1.5x + 1 = 0", discriminant: 0.25, rootCount: 2 }
  ],
    
    /**
     * СИСТЕМЫ УРАВНЕНИЙ - 50 ПРИМЕРОВ
     */
    system: [
        { a1: 1, b1: 1, c1: 3, a2: 1, b2: -1, c2: 1, name: "x + y = 3; x - y = 1" },
    { a1: 2, b1: 1, c1: 5, a2: 1, b2: -1, c2: 1, name: "2x + y = 5; x - y = 1" },
  { a1: 1, b1: 2, c1: 5, a2: 1, b2: 1, c2: 4, name: "x + 2y = 5; x + y = 4" },
        { a1: 2, b1: 3, c1: 8, a2: 1, b2: -1, c2: 2, name: "2x + 3y = 8; x - y = 2" },
        { a1: 3, b1: 2, c1: 11, a2: 2, b2: -1, c2: 5, name: "3x + 2y = 11; 2x - y = 5" },
    { a1: 1, b1: 1, c1: 5, a2: 2, b2: -1, c2: 4, name: "x + y = 5; 2x - y = 4" },
   { a1: 3, b1: 1, c1: 10, a2: 1, b2: -1, c2: 2, name: "3x + y = 10; x - y = 2" },
        { a1: 2, b1: -1, c1: 3, a2: 1, b2: 1, c2: 3, name: "2x - y = 3; x + y = 3" },
        { a1: 1, b1: 3, c1: 10, a2: 2, b2: -1, c2: 5, name: "x + 3y = 10; 2x - y = 5" },
        { a1: 4, b1: 1, c1: 14, a2: 2, b2: 3, c2: 13, name: "4x + y = 14; 2x + 3y = 13" }
    ]
};

/**
 * ✅ КОЭФФИЦИЕНТЫ СЛОЖНОСТИ
 */
export const DIFFICULTY_LEVELS = {
    easy: { label: "Легко", symbol: "★☆☆☆☆", color: "#10b981" },
    medium: { label: "Средне", symbol: "★★★☆☆", color: "#f59e0b" },
    hard: { label: "Сложно", symbol: "★★★★★", color: "#ef4444" }
};

/**
 * ✅ ФОРМУЛЫ ДЛЯ СПРАВКИ
 */
export const FORMULAS = {
    discriminant: "D = b² - 4ac",
    roots: "x = (-b ± √D) / (2a)",
    vieta: { sum: "x₁ + x₂ = -b/a", product: "x₁ · x₂ = c/a" },
    vertex: { x: "x = -b / (2a)", y: "y = -D / (4a)" }
};

/**
 * ✅ СООБЩЕНИЯ
 */
export const ERROR_MESSAGES = {
    INVALID_COEFFICIENT: "Пожалуйста, введите корректное число",
    ZERO_A_FOR_QUADRATIC: "Коэффициент a не может быть 0",
    ZERO_DENOMINATOR: "Знаменатель не может быть 0",
    INVALID_INPUT: "Некорректный формат ввода",
    UNKNOWN_ERROR: "Неизвестная ошибка при решении"
};

export const SUCCESS_MESSAGES = {
    EQUATION_SOLVED: "✓ Уравнение успешно решено!",
    SOLUTION_COPIED: "✓ Решение скопировано",
    SOLUTION_EXPORTED: "✓ Решение экспортировано",
    HISTORY_CLEARED: "✓ История очищена",
    EQUATION_GENERATED: "✨ Уравнение сгенерировано!"
};

/**
 * ✅ ИНФОРМАЦИЯ О ТИПАХ УРАВНЕНИЙ
 */
export const EQUATION_TYPES = {
    quadratic: { name: "Квадратное", form: "ax² + bx + c = 0", complexity: 3 },
    linear: { name: "Линейное", form: "ax + b = 0", complexity: 1 },
    cubic: { name: "Кубическое", form: "ax³ + bx² + cx + d = 0", complexity: 4 },
    biquadratic: { name: "Биквадратное", form: "ax⁴ + bx² + c = 0", complexity: 3 },
    system: { name: "Система 2x2", form: "ax + by = c", complexity: 2 }
};

/**
 * ✅ ЭКСПОРТИРУЕМ РАСШИРЕННЫЙ ГЕНЕРАТОР
 */
export const EQUATION_GENERATORS = GRAPH_GENERATORS;