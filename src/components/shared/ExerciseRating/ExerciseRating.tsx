import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { saveExerciseRating, selectExerciseRatings } from '../../../redux/slices/progressSlice';
import styles from './ExerciseRating.module.css';

interface ExerciseRatingProps {
  exerciseId: string;
  activityId: string;
  onRatingChange?: (rating: number) => void;
}

export const ExerciseRating: React.FC<ExerciseRatingProps> = ({
  exerciseId,
  activityId,
  onRatingChange
}) => {
  const dispatch = useAppDispatch();
  const allRatings = useAppSelector(selectExerciseRatings);

  // Найти существующий рейтинг для этого упражнения
  const existingRating = allRatings.find(r => r.exerciseId === exerciseId);

  const [rating, setRating] = useState(existingRating?.rating || 0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState(existingRating?.comment || '');

  useEffect(() => {
    if (existingRating) {
      setRating(existingRating.rating);
      setComment(existingRating.comment || '');
    }
  }, [existingRating]);

  const handleStarClick = (star: number) => {
    setRating(star);
    dispatch(saveExerciseRating({
      exerciseId,
      activityId,
      rating: star,
      comment: comment || undefined
    }));
    if (onRatingChange) {
      onRatingChange(star);
    }
  };

  const handleCommentSave = () => {
    if (rating > 0) {
      dispatch(saveExerciseRating({
        exerciseId,
        activityId,
        rating,
        comment: comment || undefined
      }));
      setShowComment(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.ratingSection}>
        <span className={styles.label}>Насколько это упражнение помогло вам?</span>
        <div className={styles.stars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className={`${styles.star} ${
                star <= (hoveredStar || rating) ? styles.starFilled : styles.starEmpty
              }`}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              onClick={() => handleStarClick(star)}
              aria-label={`Оценка ${star} из 5`}
            >
              ★
            </button>
          ))}
        </div>
        {rating > 0 && (
          <button
            className={styles.commentButton}
            onClick={() => setShowComment(!showComment)}
          >
            {comment ? '✏️ Редактировать комментарий' : '💬 Добавить комментарий'}
          </button>
        )}
      </div>

      {showComment && (
        <div className={styles.commentSection}>
          <textarea
            className={styles.commentInput}
            placeholder="Поделитесь своими мыслями об этом упражнении..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />
          <div className={styles.commentActions}>
            <button className={styles.saveButton} onClick={handleCommentSave}>
              Сохранить
            </button>
            <button
              className={styles.cancelButton}
              onClick={() => {
                setShowComment(false);
                setComment(existingRating?.comment || '');
              }}
            >
              Отмена
            </button>
          </div>
        </div>
      )}

      {rating > 0 && !showComment && comment && (
        <div className={styles.savedComment}>
          <p className={styles.commentText}>{comment}</p>
        </div>
      )}
    </div>
  );
};
