import React, { useState } from 'react';
import styles from './RecordsList.module.css';
import { ThoughtDiaryRecord } from '../types';
import { formatDateWithOptions, formatTime } from '../../../../utils/dateUtils';
import { ExerciseRating } from '../../../shared/ExerciseRating';
import { ActivityId } from '../../../../constants/activities';

interface RecordsListProps {
  records: (ThoughtDiaryRecord & { date?: string })[];
  showCognitiveDistortions?: boolean;
  showEmotionIntensity?: boolean;
  showResultIntensity?: boolean;
  activityId: ActivityId;
}

export const RecordsList: React.FC<RecordsListProps> = ({
  records,
  showCognitiveDistortions = true,
  showEmotionIntensity = true,
  showResultIntensity = true,
  activityId
}) => {
  const [expandedRecords, setExpandedRecords] = useState<{ [key: string]: boolean }>({});

  const toggleRecordExpansion = (recordTimestamp: string) => {
    setExpandedRecords(prev => ({
      ...prev,
      [recordTimestamp]: !prev[recordTimestamp]
    }));
  };

  const isRecordExpanded = (recordTimestamp: string) => {
    return !!expandedRecords[recordTimestamp];
  };

  if (records.length === 0) {
    return null;
  }

  const groupRecordsByDate = (records: (ThoughtDiaryRecord & { date?: string })[]) => {
    return records.reduce((groups, record) => {
      const date = record.date || formatDateWithOptions(record.timestamp);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(record);
      return groups;
    }, {} as { [key: string]: (ThoughtDiaryRecord & { date?: string })[] });
  };

  const groupedRecords = groupRecordsByDate(records);

  return (
    <div className={styles.recordsContainer}>
      <h3>История записей</h3>
          
      {Object.entries(groupedRecords).map(([date, dateRecords]) => (
        <div key={date} className={styles.dateGroup}>
          <h4 className={styles.dateHeader}>{date}</h4>
          {dateRecords.map((record) => (
            <div 
              key={record.timestamp} 
              className={`${styles.record} ${isRecordExpanded(record.timestamp) ? styles.expanded : ''}`}
              onClick={() => toggleRecordExpansion(record.timestamp)}
              role="button"
              aria-expanded={isRecordExpanded(record.timestamp)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  toggleRecordExpansion(record.timestamp);
                  e.preventDefault();
                }
              }}
            >
              <div className={styles.recordHeader}>
                <div className={styles.situationPreview}>
                  <strong>Ситуация:</strong> {record.situation.substring(0, 100)}{record.situation.length > 100 ? '...' : ''}
                </div>
                <div className={styles.recordTime}>
                  {formatTime(record.timestamp)}
                </div>
              </div>

              {isRecordExpanded(record.timestamp) && (
                <div className={styles.recordDetails}>
                  <div className={styles.emotionList}>
                    <strong>Эмоции:</strong>
                    <ul>
                      {record.emotions.map((emotion, i) => (
                        <li key={i}>
                          {emotion.name}
                          {showEmotionIntensity && ` - ${emotion.intensity}%`}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {record.automaticThoughts.map((thought, i) => (
                    <div key={i} className={styles.thought}>
                      <div><strong>Автоматическая мысль:</strong> {thought.thought}</div>
                      
                      {showCognitiveDistortions && thought.cognitiveDistortions.length > 0 && (
                        <div className={styles.distortions}>
                          <strong>Когнитивные искажения:</strong> {thought.cognitiveDistortions.join(', ')}
                        </div>
                      )}
                      
                      <div className={styles.response}>
                        <strong>Рациональный ответ:</strong> {thought.rationalResponse}
                      </div>
                    </div>
                  ))}

                  {record.result.emotions.length > 0 && (
                    <div className={styles.results}>
                      <strong>Результаты:</strong>
                      <ul>
                        {record.result.emotions.map((emotion, i) => (
                          <li key={i}>
                            {emotion.name}
                            {showResultIntensity && ` - ${emotion.intensity}%`}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div onClick={(e) => e.stopPropagation()}>
                    <ExerciseRating
                      exerciseId={record.timestamp}
                      activityId={activityId}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}; 
