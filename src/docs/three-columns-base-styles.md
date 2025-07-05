# Единые стили для компонентов на основе ThreeColumnsBase

## Описание

Все компоненты, использующие базовый компонент `ThreeColumnsBase`, теперь используют единые стили из файла `src/components/Activities/ThreeColumnsBase/ThreeColumnsBase.module.css`.

## Доступные классы стилей

### Основные контейнеры
- `.container` - базовый контейнер для простых компонентов
- `.extendedContainer` - расширенный контейнер с тенью и фоном для сложных компонентов

### Дополнительные секции
- `.additionalSection` - стили для дополнительных разделов
- `.beliefSection` - стили для секций ввода убеждений
- `.beliefInput` - стили для полей ввода убеждений

### Формы и поля ввода
- `.inputRow` - контейнер для строки с полем ввода и кнопкой
- `.inputRow input` - стили для полей ввода
- `.inputRow button` - стили для кнопок в строке ввода

### Списки
- `.list` - стили для списков
- `.list li` - стили для элементов списка
- `.removeBtn` - стили для кнопок удаления

### Таблицы
- `.currentTable` - стили для таблиц текущих данных
- `.historyTable` - стили для таблиц истории
- `.historyTableContainer` - контейнер для таблиц истории

### Кнопки и действия
- `.actions` - контейнер для кнопок действий
- `.actionButtons` - стили для кнопок действий в заголовке

## Как использовать

### Импорт стилей
```tsx
import styles from '../ThreeColumnsBase/ThreeColumnsBase.module.css';
```

### Примеры использования

#### Простой компонент
```tsx
<div className={styles.container}>
  <ThreeColumnsBase {...props} />
</div>
```

#### Расширенный компонент с дополнительными секциями
```tsx
<div className={styles.extendedContainer}>
  <ThreeColumnsBase {...props} />
  
  <div className={styles.additionalSection}>
    <h3>Дополнительная секция</h3>
    <div className={styles.inputRow}>
      <input type="text" placeholder="Введите текст..." />
      <button>Добавить</button>
    </div>
  </div>
  
  <div className={styles.actions}>
    <button>Сохранить</button>
  </div>
</div>
```

#### Секция убеждений
```tsx
<div className={styles.beliefSection}>
  <label>Убеждение для анализа:</label>
  <input className={styles.beliefInput} placeholder="Введите убеждение..." />
</div>
```

#### Таблица истории
```tsx
<div className={styles.historySection}>
  <h3>История записей</h3>
  <div className={styles.historyTableContainer}>
    <table className={styles.historyTable}>
      <thead>
        <tr>
          <th>Дата</th>
          <th>Данные</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>01.01.2024</td>
          <td>Пример данных</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

## Обновленные компоненты

Следующие компоненты были обновлены для использования общих стилей:

1. **AdvantagesDisadvantages** - использует `.container` и `.beliefSection`
2. **AngerProsCons** - использует `.extendedContainer`, `.additionalSection`, `.historySection`
3. **RewriteShouldRules** - убран TODO комментарий
4. **ThreeColumnsMethod** - уже использовал общие стили
5. **VerbalJudo** - уже использовал общие стили
6. **HinderingHelpingThoughts** - уже использовал общие стили
7. **ReasonsShouldRefutation** - уже использовал общие стили
8. **RationalResponses** - уже использовал общие стили
9. **HotCoolThoughts** - уже использовал общие стили
10. **NoLoseTechnique** - уже использовал общие стили

## Преимущества единых стилей

1. **Консистентность** - все компоненты имеют единый внешний вид
2. **Легкость поддержки** - изменения в одном месте отражаются на всех компонентах
3. **Уменьшение дублирования** - нет необходимости создавать отдельные CSS файлы
4. **Адаптивность** - все стили оптимизированы для мобильных устройств

## Удаленные файлы

Следующие CSS файлы были удалены, так как больше не нужны:
- `AdvantagesDisadvantages.module.css`
- `AngerProsCons.module.css` 
