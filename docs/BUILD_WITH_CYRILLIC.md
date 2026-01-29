# Сборка проекта с кириллицей в пути (Windows)

Сборка проекта (с учётом кириллических путей)
===============================================

Коротко: иногда терминалы/скрипты/инструменты некорректно обрабатывают пути с кириллицей в имени пользователя. Ниже — надёжный и проверенный набор шагов и подсказок, который можно использовать локально на Windows (PowerShell).

Принцип: всегда работать из корня проекта (тот, где лежит package.json), использовать относительные пути или безопасный префикс `\\?\` при необходимости.

Шаги (быстро):
1. Откройте PowerShell и **ОБЯЗАТЕЛЬНО** перейдите в папку проекта:

   ```powershell
   # Самый надежный способ (использует локальную папку):
   cd "C:\Users\Анна\Documents\Muse-tailwind\tailwind-project"
   ```

   *Важно: Если терминал выдает ошибку, попробуйте сначала зайти в `Muse-tailwind`, а потом в проект:*
   ```powershell
   cd "C:\Users\Анна\Documents\Muse-tailwind"
   cd .\tailwind-project
   ```

2. Убедитесь, что вы в правильном каталоге (вы должны увидеть файл `package.json`):

   ```powershell
   dir package.json
   ```

3. Подготовьте файлы (сборка CSS):

   ```powershell
   npm run build:once
   npm run copy-css
   ```

4. Предпросмотр (эталон) — VS Code Live Server:

   - Правой кнопкой на файл `src/html/index.html` -> **Open with Live Server**.
   - Если изменения не видны, нажмите `Ctrl + F5` в браузере для очистки кэша.
   - Если Live Server запущен от **корня проекта**, открывайте страницы так: `http://127.0.0.1:5501/src/html/...`.
   - Если хотите короткие URL вида `http://127.0.0.1:5501/имя-страницы.html`, запускайте Live Server именно из папки `src/html`.

5. Предпросмотр (альтернатива через терминал):

   ```powershell
   # ЗАПУСКАТЬ СТРОГО ИЗ КОРНЯ ПРОЕКТА (где package.json)
   npx http-server ./src/html -p 3000 -a 127.0.0.1 --cors
   ```

   **Теперь откройте в браузере:**
   [http://127.0.0.1:3000/portret-na-zakaz/object/detskiy-portret.html](http://127.0.0.1:3000/portret-na-zakaz/object/detskiy-portret.html)

   *Если страница не открывается:*
   - Проверьте, что в терминале написано `Starting up http-server, serving ./src/html`.
   - Попробуйте порт **3005**, если 3000 занят: `npx http-server ./src/html -p 3005 -a 127.0.0.1`.

6. Быстрая проверка содержимого (PowerShell):

   # проверить, что HTML содержит ожидаемые изменения
   (Get-Content .\src\html\portret-na-zakaz\object\detskiy-portret.html) -match 'max-h-\[90vh\]' -and (Get-Content .\src\html\portret-na-zakaz\object\detskiy-portret.html) -match 'BxPopup'

   # или поиск конкретных строк
   Select-String -Path .\src\html\**\*.html -Pattern 'BxPopup|Page Navigator|max-h-\[90vh\]'

6a. Отладка, если сервер возвращает 404:
   - Убедитесь, что путь под `src/html` действительно существует и что файл присутствует (Get-ChildItem).
   - Проверьте, в какой директории вы запустили сервер. `npx http-server src/html` служит тот каталог `src/html` относительно текущей директории.
   - Если возник 404 при прямом URL `/portret-na-zakaz/object/detskiy-portret.html`, проверьте наличие файла `src/html/portret-na-zakaz/object/detskiy-portret.html`.

7. Примечания и советы:
   - Избегайте прямого копирования длинных путей с кириллицей в команды — лучше перейти в каталог с помощью TAB или использовать относительный путь.
   - Если используете Live Server в VSCode — убедитесь, что он раздаёт `src/html`, а не корень рабочей папки.
   - Для автоматизации: можно использовать `npm run preview`, но эталонный предпросмотр — Live Server.

8. Короткая памятка (e1):
   - Всегда: cd .\tailwind-project → npm run build:once → npm run copy-css → Live Server (или `npm run preview`, но это не эталон)

---

## Быстрый деплой при кириллическом пути (обновлено)

Проблема: `cmd.exe` часто ломает запуск батников с кириллицей в имени файла/пути. Поэтому **рекомендуется запускать PowerShell‑скрипт**.

### Рекомендуемый способ (PowerShell)

1) Откройте **Windows PowerShell** (не cmd).
2) Разрешите запуск скрипта в текущей сессии:

```
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

3) Перейдите в корень проекта и запустите скрипт:

```
Set-Location "C:\Users\Анна\Documents\Muse-tailwind\tailwind-project"
& ".\БЫСТРЫЙ_ДЕПЛОЙ.ps1"
```

### Альтернатива для cmd (если нужен .bat)

Используйте короткое имя файла (8.3), чтобы избежать кириллицы:

```
_9C4E~1.BAT
```

### Как понять, что всё сработало

Откройте `deploy-log.txt` — в конце должно быть:

```
Step 8: Push to GitHub...
SUCCESS! Changes pushed to GitHub.
```

Если лог **не обновляется**, значит скрипт не запускался из корня проекта или был запущен в cmd с кириллицей.


Если хотите, я могу положить эту инструкцию ещё и в `README.md` или вывести её в виде GitHub issue/PR — скажите, куда сохранить.

Тестирование страницы — краткая инструкция
----------------------------------------

1) Подготовка и запуск превью
   - npm run build:once
   - npm run copy-css
   - Откройте страницу через Live Server (эталон): откройте нужный HTML внутри `src/html/` и запустите Live Server (кнопка Go Live / Open with Live Server). Порт и адрес зависят от настроек.
   - Альтернатива (не эталон): `npm run preview`.
   - Сбросьте кеш страницы (Ctrl+F5) перед проверкой.

2) Быстрая автоматическая проверка (PowerShell):
   - Проверить подключение CSS и наличие ключевых фрагментов:
       $url = 'http://127.0.0.1:5500/portret-na-zakaz/object/detskiy-portret.html'  # замените на URL из Live Server
       (Invoke-WebRequest $url).Content | Select-String 'href=".*css/output.css"|max-h-\[90vh\]|BxPopup|carousel-scroll|page-navigator' -AllMatches
   - Проверить, что `nav.js` содержит глобальную функцию popup:
     Select-String -Path .\src\html\js\nav.js -Pattern 'window.BxPopup' -SimpleMatch
   - Убедиться, что нет дублирующих inline-функций `function BxPopup` в `src/html`:
     Select-String -Path .\src\html\**\*.html -Pattern 'function BxPopup' -SimpleMatch || Write-Output 'No inline BxPopup found'

3) Ручная визуальная проверка / чеклист
   - Откройте страницу и убедитесь, что в <head> есть подключение `css/output.css`.
   - Проверьте меню (Mobile): в DevTools включите Device Toolbar или уменьшите окно до мобильной ширины и нажмите кнопку меню — модальное окно должно быть центрировано (или вести себя так, как вы настроили).
   - Проверьте Page Navigator (правые точки): прокрутите страницу — активная точка подсвечивается; навигация плавно скроллит.
   - Проверьте карусель: Prev/Next кнопки видны на десктопе; клики прокручивают карусель; на мобильных — пролистывание пальцем/drag работает.
   - Проверьте BxPopup: кликните по сервисам OAuth (Яндекс/Google/ВКонтакте и т.п.) — должен открываться popup с ожидаемыми размерами.
   - Проверьте ARIA/Accessibility: у карусели есть скрытая подсказка `.sr-only carousel-sr-instructions`; элементы списка помечены `role=list`/`role=listitem`.
   - Проверка клавиатурой: Tab/Enter должен работать для открытия меню и кнопок; Escape (если поддерживается) закрывает модал.
   - Откройте консоль DevTools: нет ошибок JavaScript, сеть возвращает 200 для `css/output.css` и HTML.

4) Что делать при проблемах
   - Если стили не применяются — убедитесь, что `src/html/css/output.css` обновлён и доступен (откройте `/css/output.css` по адресу, который выдал Live Server; порт может отличаться).
   - Если модал не показывает на десктопе — проверьте класс `xl:hidden` в диалоге; при необходимости удалите/измените классы для нужного поведения.
   - Если Popup не открывается — проверьте, что `window.BxPopup` присутствует в `src/html/js/nav.js` и что нет блокирующих Content-Security-Policy заголовков.

5) Отчёт и откат
   - Если нашли проблему — сохраните скриншот и логи консоли, откройте issue с тегом `regression` и укажите шаги воспроизведения. Я могу подготовить PR с исправлением и тест-кейсом.

---

Если хотите, в следующем коммите добавлю короткий Makefile / npm-скрипт `test:page` (выполняет сборку, копирование и делает curl-проверки) — скажите "да", и я добавлю.
