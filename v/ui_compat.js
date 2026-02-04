/**
 * Совместимость: переэкспорт UIManager из ui_manager.js
 * Этот файл обеспечивает обратную совместимость для импортов из ui.js
 */

export { UIManager } from './ui_manager.js';

// Дополнительные утилиты если необходимы
export const UIManagerVersion = '1.0.0';