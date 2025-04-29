import React, { useState, useRef, useEffect } from 'react';
import { cognitiveBiases } from '../../ListOfCognitiveBiases/cognitiveBiases';
import styles from './CognitiveDistortions.module.css';

interface CognitiveDistortionsProps {
  selectedDistortions: string[];
  onChange: (distortions: string[]) => void;
}

export const CognitiveDistortions: React.FC<CognitiveDistortionsProps> = ({
  selectedDistortions,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggleDistortion = (title: string) => {
    if (selectedDistortions.includes(title)) {
      onChange(selectedDistortions.filter(d => d !== title));
    } else {
      onChange([...selectedDistortions, title]);
    }
  };

  // Закрываем дропдаун при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.column}>
      <h3 title='Определите искажения для автоматической мысли'>Когнитивные искажения</h3>
      <div className={styles.multiSelect} ref={dropdownRef}>
        <div 
          className={styles.selectedDisplay}
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedDistortions.length === 0 ? (
            <span className={styles.placeholder}>Выберите искажения...</span>
          ) : (
            <div className={styles.selectedItems}>
              {selectedDistortions.map((title, index) => (
                <span key={index} className={styles.selectedItem}>
                  {title}
                  <button 
                    className={styles.removeItem}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleDistortion(title);
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          <span className={`${styles.arrow} ${isOpen ? styles.up : ''}`}>▼</span>
        </div>

        {isOpen && (
          <div className={styles.dropdown}>
            {cognitiveBiases.map((bias, index) => (
              <label key={index} className={styles.option}>
                <input
                  type="checkbox"
                  checked={selectedDistortions.includes(bias.title)}
                  onChange={() => handleToggleDistortion(bias.title)}
                  className={styles.checkbox}
                />
                <span className={styles.optionTitle}>{bias.title}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 
