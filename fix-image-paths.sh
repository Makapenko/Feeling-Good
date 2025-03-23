#!/bin/bash

# Скрипт для исправления путей к изображениям в HTML-файлах
# Заменяет пути вида src="/content/images/ на src="/Feeling-Good/content/images/

echo "Исправление путей к изображениям в HTML-файлах..."

# Находим все HTML файлы в директории public/content/chapters
find public/content/chapters -type f -name "*.html" -print0 | while IFS= read -r -d '' file; do
  # Заменяем пути к изображениям
  sed -i 's|src="/content/images/|src="/Feeling-Good/content/images/|g' "$file"
  echo "Обработан файл: $file"
done

# Проверяем, остались ли еще неисправленные пути
echo "Проверяем оставшиеся неисправленные пути..."
grep -r 'src="content/images' --include="*.html" public/content/
grep -r 'src="/content/images' --include="*.html" public/content/

echo "Готово!" 
