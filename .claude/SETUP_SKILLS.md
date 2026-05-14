# Установка слеш команд Game of Zawert

## Быстрая установка (Рекомендуемый способ)

В Claude Code используйте команду:

```
/update-config
```

Затем выберите опцию "add custom skills" и следуйте инструкциям.

Или используйте прямую команду:

```
/update-config add custom skill /goz-character "Создать персонажа Game of Zawert"
```

---

## Ручная установка (Альтернативный способ)

### Шаг 1: Откройте settings.json

Путь: `.claude/settings.json` или `.claude/settings.local.json`

### Шаг 2: Добавьте секцию с пользовательскими командами

Если её нет, создайте:

```json
{
  "customSkills": [
    {
      "name": "goz-character",
      "description": "Создать персонажа Game of Zawert по концепции",
      "template": "Создай персонажа Game of Zawert по концепции: {input}"
    },
    {
      "name": "goz-item",
      "description": "Создать предмет/снаряжение для Game of Zawert",
      "template": "Создай предмет для Game of Zawert: {input}"
    },
    {
      "name": "goz-skill",
      "description": "Создать новое умение для Game of Zawert",
      "template": "Создай новое умение для Game of Zawert: {input}"
    },
    {
      "name": "goz-balance-check",
      "description": "Проверить баланс персонажа или предмета",
      "template": "Проверь баланс: {input}"
    },
    {
      "name": "goz-party",
      "description": "Создать сбалансированную группу персонажей",
      "template": "Создай группу персонажей: {input}"
    },
    {
      "name": "goz-rules",
      "description": "Объяснить правило Game of Zawert",
      "template": "Объясни правило: {input}"
    },
    {
      "name": "goz-print",
      "description": "Подготовить контент для печати",
      "template": "Подготовь для печати: {input}"
    }
  ]
}
```

### Шаг 3: Сохраните файл

Команды будут доступны сразу после сохранения.

---

## Проверка установки

Введите в чате:

```
/goz-character
```

Если вы видите подсказку с описанием команды, значит она установлена правильно.

---

## Устранение неполадок

**Q: Команда не работает**
A: Убедитесь, что:
1. Файл settings.json синтаксически правильный (валидный JSON)
2. Имя команды в точности совпадает (включая дефисы)
3. Вы в правильной папке проекта (.claude/)

**Q: Команда работает, но не использует контекст GOZ**
A: Claude должен прочитать CLAUDE.md и GOZ_Framework файлы. Убедитесь, что они находятся в проекте.

**Q: Хочу добавить свою команду**
A: Добавьте в массив customSkills новый объект:

```json
{
  "name": "goz-mycustom",
  "description": "Описание моей команды",
  "template": "Промпт для Claude: {input}"
}
```

---

## Использование

После установки просто введите:

```
/goz-character смелый паладин с магией защиты
```

Команда передаст запрос в контекст Claude со всеми файлами фреймворка.

---

**Полная документация по командам: GOZ_SKILLS_GUIDE.md**
