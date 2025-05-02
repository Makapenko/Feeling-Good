import React, { useRef, useState, useEffect } from 'react';
import styles from './ChapterReader.module.css';

interface NoteModalProps {
  content: string;
  onClose: () => void;
}

const NoteModal: React.FC<NoteModalProps> = ({ content, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [startY, setStartY] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Закрытие по Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    // Блокируем скролл body
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Обработчики для закрытия свайпом на мобильных устройствах
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY === null) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    
    // Если свайп вниз более 50px, помечаем как перетаскивание
    if (diff > 50) {
      setIsDragging(true);
    }
  };

  const handleTouchEnd = () => {
    if (isDragging) {
      onClose();
    }
    setStartY(null);
    setIsDragging(false);
  };

  return (
    <div 
      className={styles.modalBackdrop} 
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Примечание"
    >
      <div 
        ref={modalRef}
        className={styles.noteModalContent}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <button 
          className={styles.modalClose} 
          onClick={onClose}
          aria-label="Закрыть примечание"
        >×</button>
        <div className={styles.noteContent} dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
};

export default NoteModal; 
