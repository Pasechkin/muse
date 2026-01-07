# Инструкция по деплою статического сайта

## Подготовка к деплою

1. Убедитесь, что все зависимости установлены:
```bash
npm install
```

2. Соберите CSS:
```bash
npm run build:once
npm run copy-css
```

3. Проверьте, что файл `src/html/css/output.css` существует

## Деплой на Vercel

### Через веб-интерфейс:

1. Зайдите на [vercel.com](https://vercel.com)
2. Войдите через GitHub
3. Нажмите "Add New Project"
4. Выберите ваш репозиторий
5. Настройки уже указаны в `vercel.json`:
   - Build Command: `npm install && npm run build:once && npm run copy-css`
   - Output Directory: `src/html`
6. Нажмите "Deploy"

### Через CLI:

```bash
npm i -g vercel
vercel
```

## Деплой на Netlify

### Через веб-интерфейс:

1. Зайдите на [netlify.com](https://netlify.com)
2. Войдите через GitHub
3. "Add new site" → "Import an existing project"
4. Выберите репозиторий
5. Настройки уже указаны в `netlify.toml`
6. Нажмите "Deploy site"

### Через CLI:

```bash
npm i -g netlify-cli
netlify deploy --prod
```

## Структура для деплоя

После сборки структура должна быть такой:

```
src/html/
├── index.html
├── css/
│   └── output.css
├── portret-na-zakaz/
│   └── index.html
└── info/
    └── kontakty/
        └── index.html
```

## Проверка перед деплоем

- [ ] CSS скомпилирован (`src/html/css/output.css` существует)
- [ ] Все пути к CSS правильные
- [ ] Все ссылки работают
- [ ] Мобильное меню работает
- [ ] Нет ошибок в консоли браузера

## После деплоя

После успешного деплоя ваш сайт будет доступен по адресу:
- Vercel: `ваш-проект.vercel.app`
- Netlify: `ваш-проект.netlify.app`

Вы можете настроить кастомный домен в настройках проекта.




