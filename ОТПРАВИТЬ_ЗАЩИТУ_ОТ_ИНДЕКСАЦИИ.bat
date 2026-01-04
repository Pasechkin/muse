@echo off
chcp 65001 >nul
cd /d "%~dp0src"

echo Добавление защиты от индексации...
git add html/robots.txt html/index.html html/index_tailwind.html html/portret-na-zakaz/index.html html/info/kontakty/index.html

echo Создание коммита...
git commit -m "Add protection from indexing during development"

echo Отправка на GitHub...
git push

echo.
echo ✅ Защита от индексации добавлена!
echo.
pause

