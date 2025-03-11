import React, { useState, useEffect } from 'react';
import styles from './CheckCantDo.module.css';

interface Task {
  id: string;
  text: string;
  minimumDone: boolean;
  minimumDescription: string;
}

const CheckCantDo: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('cantDoTasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [newTask, setNewTask] = useState('');
  const [minimumDescription, setMinimumDescription] = useState('');

  useEffect(() => {
    localStorage.setItem('cantDoTasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTask.trim() || !minimumDescription.trim()) return;
    
    setTasks([
      ...tasks,
      { 
        id: Math.random().toString(),
        text: newTask.trim(),
        minimumDone: false,
        minimumDescription: minimumDescription.trim()
      }
    ]);
    setNewTask('');
    setMinimumDescription('');
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleMinimumDone = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { ...task, minimumDone: !task.minimumDone }
        : task
    ));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  return (
    <div className={styles.container}>
      <h2>Проверяйте свои «не могу»</h2>

      <div className={styles.description}>
        <h3>О методе</h3>
        <p>
          Этот метод помогает преодолеть негативное мышление, связанное с убеждением "я не могу". 
          Вместо того чтобы принимать эти мысли как факт, мы проверяем их с помощью простых экспериментов.
        </p>
        <div className={styles.example}>
          <h4>Пример:</h4>
          <p>
            Если вы думаете "Я не могу читать, потому что не могу сосредоточиться" — 
            попробуйте прочитать всего одно предложение и пересказать его смысл.
          </p>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Список ваших "не могу"</h3>
        <div className={styles.inputContainer}>
          <div className={styles.inputGroup}>
            <label>Что вы "не можете" сделать:</label>
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Например: Я не могу читать..."
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Минимальный шаг для проверки:</label>
            <input
              type="text"
              value={minimumDescription}
              onChange={(e) => setMinimumDescription(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Например: Прочитать одно предложение..."
              className={styles.input}
            />
          </div>
          <button onClick={addTask} className={styles.addButton}>
            Добавить
          </button>
        </div>

        <div className={styles.tasksList}>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div key={task.id} className={styles.taskItem}>
                <div className={styles.taskContent}>
                  <div className={styles.taskHeader}>
                    <h4>Убеждение "не могу":</h4>
                    <span className={styles.taskText}>{task.text}</span>
                  </div>
                  <div className={styles.taskMinimum}>
                    <h4>Минимальный шаг:</h4>
                    <span className={styles.minimumText}>{task.minimumDescription}</span>
                  </div>
                </div>
                <div className={styles.taskActions}>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={task.minimumDone}
                      onChange={() => toggleMinimumDone(task.id)}
                    />
                    <span className={styles.checkmark}></span>
                    <span className={styles.checkboxLabel}>
                      {task.minimumDone ? 'Минимум выполнен!' : 'Минимум не проверен'}
                    </span>
                  </label>
                  <button
                    onClick={() => removeTask(task.id)}
                    className={styles.removeButton}
                    aria-label="Удалить задание"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.placeholder}>
              Добавьте ваше первое "не могу" для проверки
            </p>
          )}
        </div>
      </div>

      <div className={styles.motivation}>
        <p>
          Помните: часто наши "не могу" — это всего лишь предположения, 
          которые можно и нужно проверять. Начните с самого малого, 
          и вы увидите, что способны на гораздо большее!
        </p>
      </div>
    </div>
  );
};

export default CheckCantDo; 
