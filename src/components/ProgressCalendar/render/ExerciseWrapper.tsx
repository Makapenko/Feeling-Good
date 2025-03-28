import React from 'react';
import { Exercise } from "../../../types/progress.types";
import styles from '../DayDetails.module.css';
import { useAppDispatch } from '../../../redux/hooks';
import { setSpecialContent } from '../../../redux/slices/progressSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard } from '@fortawesome/free-solid-svg-icons';

interface ExerciseWrapperProps {
  exercise: Exercise;
  expandedExercises: string[];
  toggleExercise: (id: string) => void;
  children: React.ReactNode;
  onClose?: () => void;
}

/**
 * Кнопка для перехода к упражнению
 */
const ExerciseButton: React.FC<{ exercise: Exercise, onClose?: () => void }> = ({ exercise, onClose }) => {
  const dispatch = useAppDispatch();
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Предотвращаем всплытие события
    // Устанавливаем специальный контент (упражнение) в Redux
    dispatch(setSpecialContent(exercise.type));
    
    // Прокрутка страницы вверх
    window.scrollTo(0, 0);
    
    // Закрываем модальное окно, если предоставлена функция закрытия
    if (onClose) {
      onClose();
    }
  };
  
  return (
    <button
      className={styles.chapterButton}
      onClick={handleClick}
      aria-label="Открыть упражнение"
      title="Перейти к упражнению"
    >
      <FontAwesomeIcon icon={faClipboard} />
    </button>
  );
};

const ExerciseWrapper: React.FC<ExerciseWrapperProps> = ({ 
  exercise, 
  expandedExercises, 
  toggleExercise,
  children,
  onClose 
}) => {
  const isExpanded = expandedExercises.includes(exercise.id);
  return (
    <div key={exercise.id} className={styles.exerciseSection}>
      <div 
        className={styles.exerciseHeader} 
        onClick={() => toggleExercise(exercise.id)}
      >
        <h4>{exercise.name}</h4>
        <div className={styles.exerciseActions}>
          <ExerciseButton exercise={exercise} onClose={onClose} />
          <span className={`${styles.arrow} ${isExpanded ? styles.expanded : ''}`}>▼</span>
        </div>
      </div>
      <div className={`${styles.exerciseContent} ${isExpanded ? styles.expanded : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default ExerciseWrapper; 
