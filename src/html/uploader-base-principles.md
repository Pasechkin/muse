# Базовые принципы загрузчиков изображений

## ОБЩАЯ АРХИТЕКТУРА

Этот документ описывает общие компоненты и принципы, используемые во всех загрузчиках изображений проекта.

---

## 1. ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ

### Обязательные для всех загрузчиков

```javascript
let uploadedImages = [];  // Массив загруженных изображений
let imageIdCounter = 0;   // Счетчик для уникальных ID
```

### Структура объекта изображения

```javascript
{
  id: Number,        // Уникальный идентификатор (imageIdCounter++)
  dataUrl: String,   // Base64 data URL изображения
  name: String,      // Оригинальное имя файла
  size: Number,      // Размер файла в байтах
  type: String       // MIME тип (image/jpeg, image/png и т.д.)
}
```

---

## 2. HTML СТРУКТУРА

### Скрытый input file (обязательно)

```html
<input type="file" 
       id="upload-input" 
       accept="image/*" 
       multiple 
       style="display:none">
```

### Кнопка загрузки

```html
<div id="upload-container">
  <button id="upload-btn" aria-label="Выбрать фото">
    <span class="upload-plus">+</span>
  </button>
  <div id="upload-label">Выбрать фото</div>
</div>
```

### Контейнер миниатюр

```html
<div class="thumbnails-container" id="thumbnails">
  <!-- Генерируется динамически -->
</div>
```

---

## 3. CSS СТИЛИЗАЦИЯ

### 3.1 Кнопка загрузки

```css
#upload-btn {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--secondary-color);
  color: white;
  border: none;
  cursor: pointer;
  margin: 0 auto;
}

.upload-plus {
  font-size: 30px;
  display: inline-block;
  transform: translateY(-1px);
}

#upload-label {
  margin-top: 8px;
  text-align: center;
  font-size: 14px;
  color: var(--text-color);
}

/* Mobile */
@media (max-width: 768px) {
  #upload-btn {
    width: 80px;
    height: 80px;
  }
}

/* Desktop - дополнительный текст */
@media (min-width: 769px) {
  #upload-label {
    visibility: hidden;
    position: relative;
  }
  
  #upload-label::after {
    content: "Нажмите или перетащите сюда фото";
    visibility: visible;
    position: absolute;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
    color: var(--text-color);
    white-space: nowrap;
  }
}
```

### 3.2 Контейнер миниатюр

```css
.thumbnails-container {
  display: flex;
  gap: 8px;
  padding: 12px;
  overflow-x: auto;
  background: white;
  border: 1px solid var(--border-color);
  margin-top: 10px;
}

.thumbnail-container {
  position: relative;
  display: inline-block;
}

.thumbnail {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  flex-shrink: 0;
}

.thumbnail-remove {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 24px;
  height: 24px;
  background: var(--secondary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  cursor: pointer;
  border: none;
  z-index: 5;
}
```

---

## 4. CORE ФУНКЦИОНАЛ

### 4.1 Инициализация событий

```javascript
// Клик по кнопке
document.getElementById('upload-btn').addEventListener('click', () => {
  document.getElementById('upload-input').click();
});

// Выбор файлов через input
document.getElementById('upload-input').addEventListener('change', e => {
  handleFiles(e.target.files);
  e.target.value = ''; // Сброс для повторной загрузки
});
```

### 4.2 Функция handleFiles (базовая версия)

```javascript
function handleFiles(files) {
  Array.from(files).forEach(file => {
    // Валидация типа
    if (!file.type.startsWith('image/')) {
      alert('Можно загружать только изображения!');
      return;
    }
    
    // Опционально: валидация размера
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      alert(`Файл "${file.name}" слишком большой. Максимум 10МБ`);
      return;
    }
    
    // Чтение файла
    const reader = new FileReader();
    
    reader.onload = e => {
      const imgObj = {
        id: imageIdCounter++,
        dataUrl: e.target.result,
        name: file.name,
        size: file.size,
        type: file.type
      };
      
      uploadedImages.push(imgObj);
      renderThumbnails();
    };
    
    reader.onerror = () => {
      alert(`Ошибка при чтении файла "${file.name}"`);
    };
    
    reader.readAsDataURL(file);
  });
}
```

### 4.3 Функция renderThumbnails (базовая версия)

```javascript
function renderThumbnails() {
  const container = document.getElementById('thumbnails');
  
  container.innerHTML = uploadedImages.map(img => `
    <div class="thumbnail-container">
      <img src="${img.dataUrl}" 
           class="thumbnail" 
           alt="${img.name}"
           data-img-id="${img.id}"
           title="${img.name}">
      <button class="thumbnail-remove" 
              onclick="removeImage(${img.id})" 
              aria-label="Удалить ${img.name}">×</button>
    </div>
  `).join('');
}
```

### 4.4 Функция removeImage (базовая версия)

```javascript
function removeImage(id) {
  uploadedImages = uploadedImages.filter(img => img.id !== id);
  renderThumbnails();
}
```

---

## 5. DRAG & DROP НА СТРАНИЦУ

### 5.1 Предотвращение стандартного поведения

```javascript
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  document.body.addEventListener(eventName, e => {
    e.preventDefault();
    e.stopPropagation();
  }, false);
});
```

### 5.2 Обработчики drag событий

```javascript
// Подсветка зоны при входе
document.body.addEventListener('dragenter', e => {
  if (e.dataTransfer.types.includes('Files')) {
    document.getElementById('drop-zone').classList.add('highlight');
  }
});

// Убрать подсветку при выходе
document.body.addEventListener('dragleave', e => {
  if (e.target === document.body || e.target === document.documentElement) {
    document.getElementById('drop-zone').classList.remove('highlight');
  }
});

// Обработка drop
document.body.addEventListener('drop', e => {
  document.getElementById('drop-zone').classList.remove('highlight');
  
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    handleFiles(files);
  }
});
```

**Примечание**: `#drop-zone` — это элемент, который будет подсвечиваться. В разных загрузчиках это может быть разный элемент.

---

## 6. ВАЛИДАЦИЯ

### 6.1 Поддерживаемые форматы

```javascript
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/gif',
  'image/webp'
];

function isValidImageType(file) {
  return ALLOWED_TYPES.includes(file.type) || 
         file.type.startsWith('image/');
}
```

### 6.2 Размер файлов

```javascript
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB (настраивается)

function isValidFileSize(file, maxSize = MAX_FILE_SIZE) {
  return file.size <= maxSize;
}
```

### 6.3 Количество файлов

```javascript
const MAX_FILES = 20; // Настраивается для каждого загрузчика

function canAddMoreFiles(newFilesCount) {
  return (uploadedImages.length + newFilesCount) <= MAX_FILES;
}
```

### 6.4 Расширенная валидация в handleFiles

```javascript
function handleFiles(files) {
  const filesArray = Array.from(files);
  
  // Проверка количества
  if (!canAddMoreFiles(filesArray.length)) {
    alert(`Можно загрузить максимум ${MAX_FILES} фото`);
    return;
  }
  
  filesArray.forEach(file => {
    // Проверка типа
    if (!isValidImageType(file)) {
      alert(`Файл "${file.name}" не является изображением`);
      return;
    }
    
    // Проверка размера
    if (!isValidFileSize(file)) {
      const sizeMB = (MAX_FILE_SIZE / 1024 / 1024).toFixed(0);
      alert(`Файл "${file.name}" слишком большой. Максимум ${sizeMB}МБ`);
      return;
    }
    
    // Загрузка файла
    loadImage(file);
  });
}

function loadImage(file) {
  const reader = new FileReader();
  
  reader.onload = e => {
    const imgObj = {
      id: imageIdCounter++,
      dataUrl: e.target.result,
      name: file.name,
      size: file.size,
      type: file.type
    };
    
    uploadedImages.push(imgObj);
    renderThumbnails();
  };
  
  reader.onerror = () => {
    alert(`Ошибка при чтении файла "${file.name}"`);
  };
  
  reader.readAsDataURL(file);
}
```

---

## 7. ACCESSIBILITY

### 7.1 ARIA атрибуты

```html
<button id="upload-btn" 
        aria-label="Выбрать фотографии для загрузки">
  <span aria-hidden="true">+</span>
</button>

<button class="thumbnail-remove" 
        aria-label="Удалить фото sunset.jpg">×</button>

<div class="thumbnails-container" 
     role="list" 
     aria-label="Загруженные фотографии">
  <div class="thumbnail-container" role="listitem">
    ...
  </div>
</div>
```

### 7.2 Keyboard navigation

```javascript
// Удаление по Enter/Space на кнопке
document.addEventListener('keydown', e => {
  if (e.target.classList.contains('thumbnail-remove')) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.target.click();
    }
  }
});
```

### 7.3 Живые анонсы (Screen readers)

```html
<div id="upload-status" 
     class="sr-only" 
     role="status" 
     aria-live="polite" 
     aria-atomic="true"></div>
```

```javascript
function announceUpload(count) {
  const status = document.getElementById('upload-status');
  status.textContent = `Загружено ${count} ${pluralize(count, 'фото', 'фотографии', 'фотографий')}`;
}

function announceRemove(filename) {
  const status = document.getElementById('upload-status');
  status.textContent = `Удалено фото ${filename}`;
}
```

---

## 8. PERFORMANCE

### 8.1 CSS оптимизации

```css
.thumbnail {
  touch-action: none;
  will-change: transform;
  transform: translateZ(0);
}
```

### 8.2 Throttling для множественных загрузок

```javascript
// Batch обработка для улучшения производительности
function handleFiles(files) {
  const filesArray = Array.from(files);
  let processed = 0;
  
  function processBatch(start, batchSize = 5) {
    const batch = filesArray.slice(start, start + batchSize);
    
    batch.forEach(file => {
      loadImage(file, () => {
        processed++;
        if (processed === filesArray.length) {
          announceUpload(processed);
        }
      });
    });
    
    if (start + batchSize < filesArray.length) {
      setTimeout(() => processBatch(start + batchSize), 100);
    }
  }
  
  processBatch(0);
}
```

---

## 9. ОШИБКИ И УВЕДОМЛЕНИЯ

### 9.1 Система уведомлений (опционально)

```javascript
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.setAttribute('role', 'alert');
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Использование
showNotification('Загружено 3 фото', 'success');
showNotification('Файл слишком большой', 'error');
```

### 9.2 CSS для уведомлений

```css
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 20px;
  border-radius: 4px;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  z-index: 10000;
  animation: slideIn 0.3s;
}

.notification-success { border-left: 4px solid #4caf50; }
.notification-error { border-left: 4px solid #f44336; }
.notification-info { border-left: 4px solid #2196f3; }

.notification.fade-out {
  animation: slideOut 0.3s;
}

@keyframes slideIn {
  from { transform: translateX(400px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes slideOut {
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(400px); opacity: 0; }
}
```

---

## 10. RESPONSIVE DESIGN

### 10.1 Breakpoints

```css
/* Mobile: ≤768px */
@media (max-width: 768px) {
  #upload-btn { width: 80px; height: 80px; }
  .thumbnail { width: 70px; height: 70px; }
}

/* Tablet: 769px - 1023px */
@media (min-width: 769px) and (max-width: 1023px) {
  #upload-btn { width: 90px; height: 90px; }
  .thumbnail { width: 80px; height: 80px; }
}

/* Desktop: ≥1024px */
@media (min-width: 1024px) {
  #upload-btn { width: 100px; height: 100px; }
  .thumbnail { width: 90px; height: 90px; }
}
```

### 10.2 Touch оптимизации

```css
/* Увеличенная область tap для мобильных */
@media (max-width: 768px) {
  .thumbnail-remove {
    width: 32px;
    height: 32px;
    font-size: 18px;
  }
}

/* Предотвращение случайного zoom */
.thumbnail-container {
  touch-action: manipulation;
}
```

---

## 11. СОВМЕСТИМОСТЬ

### 11.1 Browser Support

- **Chrome**: 60+
- **Firefox**: 55+
- **Safari**: 11+
- **Edge**: 79+
- **iOS Safari**: 11+
- **Android Chrome**: 60+

### 11.2 Полифилы

```javascript
// Array.from для старых браузеров
if (!Array.from) {
  Array.from = obj => [].slice.call(obj);
}

// String.includes
if (!String.prototype.includes) {
  String.prototype.includes = function(search) {
    return this.indexOf(search) !== -1;
  };
}
```

---

## 12. УТИЛИТЫ

### 12.1 Форматирование размера файла

```javascript
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
```

### 12.2 Pluralization (русский язык)

```javascript
function pluralize(count, one, few, many) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}

// Использование
const text = `${count} ${pluralize(count, 'фото', 'фотографии', 'фотографий')}`;
```

### 12.3 Генерация уникального ID

```javascript
function generateUniqueId() {
  return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
```

---

## 13. ТЕСТИРОВАНИЕ

### 13.1 Checklist базового функционала

- [ ] Клик по кнопке открывает диалог выбора файлов
- [ ] Можно выбрать несколько файлов одновременно
- [ ] Drag & Drop файлов работает
- [ ] Загруженные изображения отображаются как миниатюры
- [ ] Кнопка удаления работает корректно
- [ ] Валидация типов файлов работает
- [ ] Валидация размера файлов работает
- [ ] Повторная загрузка того же файла возможна
- [ ] Счетчик ID инкрементируется корректно

### 13.2 Тесты валидации

```javascript
// Пример unit тестов (Jest/Mocha)
describe('Валидация файлов', () => {
  test('должна принимать JPEG файлы', () => {
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    expect(isValidImageType(file)).toBe(true);
  });
  
  test('должна отклонять PDF файлы', () => {
    const file = new File([''], 'doc.pdf', { type: 'application/pdf' });
    expect(isValidImageType(file)).toBe(false);
  });
  
  test('должна отклонять файлы больше лимита', () => {
    const size = 11 * 1024 * 1024; // 11MB
    expect(isValidFileSize({ size }, 10 * 1024 * 1024)).toBe(false);
  });
});
```

---

## 14. SECURITY

### 14.1 XSS защита

```javascript
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Использование при рендеринге
function renderThumbnails() {
  const container = document.getElementById('thumbnails');
  
  container.innerHTML = uploadedImages.map(img => `
    <div class="thumbnail-container">
      <img src="${img.dataUrl}" 
           alt="${escapeHtml(img.name)}"
           title="${escapeHtml(img.name)}">
      ...
    </div>
  `).join('');
}
```

### 14.2 File type validation (не только MIME)

```javascript
function validateImageFile(file) {
  // Проверка MIME type
  if (!file.type.startsWith('image/')) {
    return false;
  }
  
  // Проверка расширения файла
  const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const extension = file.name.toLowerCase().match(/\.[^.]+$/)?.[0];
  
  if (!extension || !validExtensions.includes(extension)) {
    return false;
  }
  
  return true;
}
```

---

## 15. КОНФИГУРАЦИЯ

### 15.1 Объект настроек

```javascript
const UPLOADER_CONFIG = {
  maxFileSize: 10 * 1024 * 1024,  // 10MB
  maxFiles: 20,
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  showNotifications: true,
  thumbnailSize: 80,
  batchSize: 5  // Для batch обработки
};
```

### 15.2 Инициализация с конфигом

```javascript
function initUploader(config = {}) {
  const settings = { ...UPLOADER_CONFIG, ...config };
  
  MAX_FILE_SIZE = settings.maxFileSize;
  MAX_FILES = settings.maxFiles;
  ALLOWED_TYPES = settings.allowedTypes;
  
  // Применение размера миниатюр
  document.documentElement.style.setProperty(
    '--thumbnail-size', 
    `${settings.thumbnailSize}px`
  );
  
  return settings;
}

// Использование
initUploader({
  maxFiles: 10,
  maxFileSize: 5 * 1024 * 1024  // 5MB
});
```

---

**Версия**: 1.0  
**Последнее обновление**: 12 февраля 2026  
**Статус**: Базовая спецификация для всех загрузчиков
