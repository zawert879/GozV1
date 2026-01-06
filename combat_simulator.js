// GOZ v1 Combat Simulator
// Модели персонажей и симуляция боя

class Character {
  constructor(name, st, dx, iq, ht, skills = {}, armor = 0, weapon = null) {
    this.name = name;
    this.st = st;
    this.dx = dx;
    this.iq = iq;
    this.ht = ht;
    this.maxHP = (st + ht) * 2;
    this.hp = this.maxHP;
    this.armor = armor;
    this.skills = skills; // { weaponType: level }
    this.weapon = weapon || { name: 'Кулак', damage: Math.floor(st/4), type: 'др' };
    this.baseDefense = Math.floor(dx / 2);
  }

  getEffectiveSkill(skillName) {
    const skillLevel = this.skills[skillName] || 0;
    const bonus = skillLevel > 0 ? skillLevel * 4 : -6;
    return this.dx + bonus;
  }

  getInjuryPenalty() {
    const hpPercent = this.hp / this.maxHP;
    if (hpPercent > 0.75) return 0;
    if (hpPercent > 0.5) return -1;
    if (hpPercent > 0.25) return -2;
    return -3;
  }

  rollDice(count = 3) {
    let total = 0;
    for (let i = 0; i < count; i++) {
      total += Math.floor(Math.random() * 6) + 1;
    }
    return total;
  }

  attack(target) {
    const skillValue = this.getEffectiveSkill(this.weapon.skill || 'меч');
    const penalty = this.getInjuryPenalty();
    const targetNumber = skillValue + penalty;
    const roll = this.rollDice();
    
    const result = {
      attacker: this.name,
      defender: target.name,
      roll: roll,
      target: targetNumber,
      hit: false,
      critSuccess: false,
      critFail: false,
      damage: 0
    };

    // Критические результаты
    if (roll <= 4) {
      result.critSuccess = true;
      result.hit = true;
    } else if (roll >= 17) {
      result.critFail = true;
      result.hit = false;
      return result;
    } else {
      result.hit = roll <= targetNumber;
    }

    if (result.hit) {
      // Цель пытается защититься
      const defenseRoll = this.rollDice();
      const defenseTarget = target.baseDefense + 3; // уклонение
      const defended = defenseRoll <= defenseTarget;
      
      result.defenseRoll = defenseRoll;
      result.defenseTarget = defenseTarget;
      result.defended = defended;

      if (!defended) {
        // Расчёт урона
        const baseDamage = Math.floor(this.st / 3) + this.weapon.damageBonus;
        const totalDamage = Math.max(0, baseDamage - target.armor);
        result.damage = result.critSuccess ? totalDamage * 2 : totalDamage;
        target.hp -= result.damage;
      }
    }

    return result;
  }

  isAlive() {
    return this.hp > 0;
  }

  isConscious() {
    return this.hp > 0;
  }

  getStatus() {
    if (!this.isConscious()) return 'без сознания';
    const hpPercent = this.hp / this.maxHP;
    if (hpPercent > 0.75) return 'здоров';
    if (hpPercent > 0.5) return 'лёгкое ранение';
    if (hpPercent > 0.25) return 'серьёзное ранение';
    return 'критическое ранение';
  }
}

class CombatSimulator {
  constructor() {
    this.combatLog = [];
    this.round = 0;
  }

  log(message) {
    this.combatLog.push(message);
    console.log(message);
  }

  simulateCombat(party1, party2, maxRounds = 20) {
    this.combatLog = [];
    this.round = 0;
    
    this.log(`\n=== НАЧАЛО БОЯ ===`);
    this.log(`Команда 1: ${party1.map(c => `${c.name} (HP: ${c.hp}/${c.maxHP})`).join(', ')}`);
    this.log(`Команда 2: ${party2.map(c => `${c.name} (HP: ${c.hp}/${c.maxHP})`).join(', ')}`);
    this.log('');

    while (this.round < maxRounds) {
      this.round++;
      this.log(`--- Раунд ${this.round} ---`);

      // Определение инициативы
      const allCombatants = [
        ...party1.filter(c => c.isConscious()).map(c => ({ char: c, team: 1 })),
        ...party2.filter(c => c.isConscious()).map(c => ({ char: c, team: 2 }))
      ].sort((a, b) => b.char.dx - a.char.dx);

      if (allCombatants.length === 0) {
        this.log('Все без сознания!');
        break;
      }

      // Выполнение действий
      for (const combatant of allCombatants) {
        if (!combatant.char.isConscious()) continue;

        const enemies = combatant.team === 1 
          ? party2.filter(c => c.isConscious())
          : party1.filter(c => c.isConscious());

        if (enemies.length === 0) {
          this.log(`\nКоманда ${combatant.team} победила!`);
          this.printFinalStats(party1, party2);
          return combatant.team;
        }

        // Выбор цели (случайная)
        const target = enemies[Math.floor(Math.random() * enemies.length)];
        const result = combatant.char.attack(target);

        // Вывод результата атаки
        let message = `${result.attacker} атакует ${result.defender}: бросок ${result.roll}`;
        
        if (result.critSuccess) {
          message += ` - КРИТИЧЕСКИЙ УСПЕХ!`;
        } else if (result.critFail) {
          message += ` - критический провал`;
        } else if (result.hit) {
          message += ` ≤ ${result.target} - попадание`;
          if (result.defended) {
            message += `, но ${result.defender} уклонился (${result.defenseRoll} ≤ ${result.defenseTarget})`;
          } else {
            message += `, ${result.defender} не смог защититься (${result.defenseRoll} > ${result.defenseTarget})`;
            message += `, урон: ${result.damage}, осталось HP: ${target.hp}/${target.maxHP} (${target.getStatus()})`;
          }
        } else {
          message += ` > ${result.target} - промах`;
        }

        this.log(message);
      }

      this.log('');

      // Проверка победителей
      const team1Alive = party1.some(c => c.isConscious());
      const team2Alive = party2.some(c => c.isConscious());

      if (!team1Alive && !team2Alive) {
        this.log('Ничья - обе стороны без сознания!');
        this.printFinalStats(party1, party2);
        return 0;
      }
      
      if (!team1Alive) {
        this.log('Команда 2 победила!');
        this.printFinalStats(party1, party2);
        return 2;
      }
      
      if (!team2Alive) {
        this.log('Команда 1 победила!');
        this.printFinalStats(party1, party2);
        return 1;
      }
    }

    this.log('\nБой затянулся, превышен лимит раундов!');
    this.printFinalStats(party1, party2);
    return 0;
  }

  printFinalStats(party1, party2) {
    this.log('\n=== ФИНАЛЬНАЯ СТАТИСТИКА ===');
    this.log('Команда 1:');
    party1.forEach(c => {
      const hits = Math.ceil((c.maxHP - c.hp) / 5); // примерно
      this.log(`  ${c.name}: ${c.hp}/${c.maxHP} HP (${c.getStatus()}), получил ~${hits} ударов`);
    });
    
    this.log('Команда 2:');
    party2.forEach(c => {
      const hits = Math.ceil((c.maxHP - c.hp) / 5); // примерно
      this.log(`  ${c.name}: ${c.hp}/${c.maxHP} HP (${c.getStatus()}), получил ~${hits} ударов`);
    });
  }

  getCombatLog() {
    return this.combatLog;
  }
}

// Создание примеров персонажей
function createWarrior(name) {
  return new Character(
    name,
    11, // ST
    10, // DX
    8,  // IQ
    9,  // HT
    { меч: 3 }, // Навык меч 3 уровня
    3, // Кольчуга
    { name: 'Длинный меч', damageBonus: 2, skill: 'меч' }
  );
}

function createThief(name) {
  return new Character(
    name,
    8,  // ST
    12, // DX
    9,  // IQ
    9,  // HT
    { кинжал: 2 }, // Навык кинжал 2 уровня
    2, // Усиленная кожа
    { name: 'Кинжал', damageBonus: 1, skill: 'кинжал' }
  );
}

function createWeakBandit(name) {
  const char = new Character(
    name,
    8,  // ST
    8,  // DX
    7,  // IQ
    8,  // HT
    { топор: 1 }, // Навык топор 1 уровня
    1, // Кожаная броня
    { name: 'Топор', damageBonus: 2, skill: 'топор' }
  );
  // Рядовой враг - уменьшаем HP
  char.hp = 10;
  char.maxHP = 10;
  return char;
}

function createWolf(name, isMinion = true) {
  const char = new Character(
    name,
    10, // ST
    11, // DX
    4,  // IQ
    10, // HT
    { укус: 2 }, // Навык укус 2 уровня
    0, // Без брони
    { name: 'Укус', damageBonus: 2, skill: 'укус' }
  );
  // Рядовой враг - уменьшаем HP
  if (isMinion) {
    char.hp = 10;
    char.maxHP = 10;
  }
  return char;
}

// Примеры боёв
console.log('========================================');
console.log('GOZ v1 - Симулятор боя');
console.log('========================================\n');

// Бой 1: Воин против 3 слабых разбойников
console.log('\n### БОЙ 1: Воин против 3 разбойников ###');
const simulator1 = new CombatSimulator();
const hero1 = createWarrior('Грим Железнорукий');
const bandits1 = [
  createWeakBandit('Разбойник 1'),
  createWeakBandit('Разбойник 2'),
  createWeakBandit('Разбойник 3')
];
simulator1.simulateCombat([hero1], bandits1);

// Бой 2: Вор против 2 волков
console.log('\n\n### БОЙ 2: Вор против 2 волков ###');
const simulator2 = new CombatSimulator();
const hero2 = createThief('Лира Быстрые Пальцы');
const wolves = [
  createWolf('Волк 1'),
  createWolf('Волк 2')
];
simulator2.simulateCombat([hero2], wolves);

// Бой 3: Группа героев против стаи волков
console.log('\n\n### БОЙ 3: Группа героев против стаи волков ###');
const simulator3 = new CombatSimulator();
const party = [
  createWarrior('Грим'),
  createThief('Лира')
];
const wolfPack = [
  createWolf('Волк 1'),
  createWolf('Волк 2'),
  createWolf('Волк 3'),
  createWolf('Волк 4')
];
simulator3.simulateCombat(party, wolfPack);

// Статистика по множественным боям
console.log('\n\n### СТАТИСТИКА: 10 боёв Воин vs 3 Разбойника ###');
let wins = 0;
let totalRounds = 0;
let totalHitsToKill = 0;

for (let i = 0; i < 10; i++) {
  const sim = new CombatSimulator();
  const warrior = createWarrior('Воин');
  const bandits = [
    createWeakBandit('Разбойник 1'),
    createWeakBandit('Разбойник 2'),
    createWeakBandit('Разбойник 3')
  ];
  
  const result = sim.simulateCombat([warrior], bandits, 30);
  if (result === 1) {
    wins++;
    const damageReceived = warrior.maxHP - warrior.hp;
    const hitsReceived = Math.ceil(damageReceived / 4); // средний урон ~4
    totalHitsToKill += hitsReceived;
  }
  totalRounds += sim.round;
}

console.log(`\nПобед воина: ${wins}/10`);
console.log(`Средняя длительность боя: ${(totalRounds / 10).toFixed(1)} раундов`);
if (wins > 0) {
  console.log(`Среднее количество ударов до поражения воина: ${(totalHitsToKill / wins).toFixed(1)} ударов`);
}

console.log('\n========================================');
console.log('Симуляция завершена');
console.log('========================================');

module.exports = { Character, CombatSimulator, createWarrior, createThief, createWeakBandit, createWolf };
