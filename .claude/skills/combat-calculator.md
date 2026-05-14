# /combat-calculator

Калькулятор для боевых расчётов в Game of Zawert.

## Использование

```
/combat-calculator initiative СЛ=12 ЛВ=10 брони=heavy
/combat-calculator damage СЛ=13 оружие=меч броня=кольчуга
/combat-calculator attack ТЧ=11
/combat-calculator hp СЛ=12 ЗД=11
```

## Команды

### initiative
Рассчитывает инициативу персонажа.

```
/combat-calculator initiative ЛВ=12 брони=light
```

**Формула**: `max(8, ЛВ + штраф от брони) + 1d6`

**Справка**:
- GOZ_Framework/3_Combat_System.md § Инициатива
- GOZ_Framework/4_Equipment_and_Armor.md § Как Работает Броня (штрафы ЛВ)

### attack
Рассчитывает целевое число (ТЧ) для атаки.

```
/combat-calculator attack СЛ=12 умение=2 противник=ловкий
```

**Формула**: `Характеристика + бонус умения − штрафы`

**Справка**:
- GOZ_Framework/3_Combat_System.md § Проверка Попадания
- GOZ_Framework/2_Skills_and_Checks.md § Система Проверок (бонусы умений)

### damage
Рассчитывает урон от атаки.

```
/combat-calculator damage СЛ=13 оружие=меч броня=средняя
```

**Формула**: `(Сила + 1d6) + бонус оружия − СУ брони = финальный урон (мин 1)`

**Справка**:
- GOZ_Framework/3_Combat_System.md § Расчет Урона
- GOZ_Framework/4_Equipment_and_Armor.md § Оружие (бонусы по уровням)
- GOZ_Framework/4_Equipment_and_Armor.md § Броня и Защита (СУ значения)

### hp
Рассчитывает очки здоровья (HP).

```
/combat-calculator hp СЛ=12 ЗД=10
```

**Формула**: `(Сила + Здоровье) × 4`

**Справка**:
- GOZ_Framework/1_Character_Creation.md § Очки Здоровья (HP)

### movement
Рассчитывает очки передвижения (ОП).

```
/combat-calculator movement ЛВ=13 брони=medium
```

**Формула**: `⌊(max(8, ЛВ + штраф от брони)) / 2⌋`

**Справка**:
- GOZ_Framework/1_Character_Creation.md § Очки Передвижения (ОП)
- GOZ_Framework/3_Combat_System.md § Очки Передвижения (ОП)

### magic
Рассчитывает целевое число для магических проверок.

```
/combat-calculator magic ИН=12 умение=2
```

**Формула**: `Интеллект + бонус умения магии − штрафы`

**Справка**:
- GOZ_Framework/5_Magic_System.md § Как Работает Магия
- GOZ_Framework/2_Skills_and_Checks.md § Система Проверок

## Справка по константам

### Штрафы ловкости от брони

| Броня | Штраф ЛВ | СУ |
|-------|----------|-----|
| Легкая | −0 | 2 |
| Средняя | −2 | 5 |
| Тяжелая | −4 | 8 |

**Важно**: ЛВ никогда не может быть ниже 8! → GOZ_Framework/4_Equipment_and_Armor.md

### Бонусы оружия к урону

| Уровень | Бонус |
|---------|-------|
| Малое | +1 |
| Среднее | +4 |
| Тяжелое | +7 |

→ GOZ_Framework/4_Equipment_and_Armor.md § Примеры Оружия

### Бонусы умения к ТЧ

| Уровень | Бонус |
|---------|-------|
| 1 (Знакомство) | −6 штраф (убирается) |
| 2 (Компетентность) | +1 |
| 3 (Мастерство) | +2 |
| 4 (Легенда) | +4 |

→ GOZ_Framework/1_Character_Creation.md § Стоимость Умений в ОП

### Критические результаты

| Результат | Исход |
|-----------|--------|
| 3–4 | Критический успех (гарантированное попадание) |
| 17–18 | Критический провал (осложнение для атакующего) |

→ GOZ_Framework/2_Skills_and_Checks.md § Критические Результаты
