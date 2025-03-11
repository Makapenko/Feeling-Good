import React, { useState } from 'react';
import styles from './ImagineSuccess.module.css';

interface Advantage {
  id: string;
  text: string;
}

const ImagineSuccess: React.FC = () => {
  const [goal, setGoal] = useState('');
  const [advantages, setAdvantages] = useState<Advantage[]>([]);
  const [newAdvantage, setNewAdvantage] = useState('');

  const addAdvantage = () => {
    if (!newAdvantage.trim()) return;
    
    setAdvantages([
      ...advantages,
      { id: Math.random().toString(), text: newAdvantage.trim() }
    ]);
    setNewAdvantage('');
  };

  const removeAdvantage = (id: string) => {
    setAdvantages(advantages.filter(adv => adv.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addAdvantage();
    }
  };

  return (
    <div className={styles.container}>
      <h2>Метод "Представьте успех"</h2>
      
      <div className={styles.section}>
        <h3>Определите свою цель</h3>
        <input
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Например: бросить курить, начать бегать по утрам..."
          className={styles.input}
        />
      </div>

      <div className={styles.section}>
        <h3>Шаг 1: Список преимуществ</h3>
        <p className={styles.description}>
          Составьте список всех положительных последствий, которые вы получите после достижения цели.
          Перечислите как можно больше пунктов.
        </p>
        
        <div className={styles.advantagesInput}>
          <input
            type="text"
            value={newAdvantage}
            onChange={(e) => setNewAdvantage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Введите преимущество и нажмите Enter"
            className={styles.input}
          />
          <button onClick={addAdvantage} className={styles.addButton}>
            Добавить
          </button>
        </div>

        <div className={styles.advantagesList}>
          {advantages.map((advantage, index) => (
            <div key={advantage.id} className={styles.advantageItem}>
              <span className={styles.advantageNumber}>{index + 1}.</span>
              <span className={styles.advantageText}>{advantage.text}</span>
              <button
                onClick={() => removeAdvantage(advantage.id)}
                className={styles.removeButton}
                aria-label="Удалить преимущество"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3>Шаг 2: Расслабление</h3>
        <div className={styles.relaxationStep}>
          <p>Каждый вечер перед сном:</p>
          <ol>
            <li>Представьте себя в любимом месте (например, в горах или на пляже)</li>
            <li>Сосредоточьтесь на приятных деталях окружающей обстановки</li>
            <li>Позвольте своему телу полностью расслабиться</li>
            <li>Почувствуйте, как напряжение покидает каждую мышцу</li>
            <li>Наблюдайте за своим состоянием покоя и умиротворения</li>
          </ol>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Шаг 3: Визуализация успеха</h3>
        <div className={styles.visualizationStep}>
          <p>Оставаясь в расслабленном состоянии:</p>
          <ol>
            <li>Представьте, что вы уже достигли своей цели</li>
            <li>Мысленно проговорите каждое преимущество из вашего списка</li>
            <li>Для каждого пункта используйте формулировку в настоящем времени:</li>
            <div className={styles.example}>
              {goal && advantages.length > 0 ? (
                advantages.map(advantage => (
                  <p key={advantage.id}>
                    "Теперь я {advantage.text.toLowerCase()}, и мне это нравится."
                  </p>
                ))
              ) : (
                <p className={styles.placeholder}>
                  Добавьте цель и преимущества, чтобы увидеть примеры утверждений
                </p>
              )}
            </div>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default ImagineSuccess; 
