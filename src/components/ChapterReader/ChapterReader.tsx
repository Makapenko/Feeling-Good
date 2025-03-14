import { useProgress } from '../../store/ProgressContext';
import styles from './ChapterReader.module.css';
import DOMPurify from 'dompurify';
import chaptersData from '../ListOfChapters/chapters.json';
import type { ChaptersData, Section } from '../../types/chapters.types';
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import ImageModal from './ImageModal';

// Указываем тип для импортированных данных
const typedChaptersData = chaptersData as ChaptersData;

interface ChapterReaderProps {
  content: string;
  chapterId: string;
  onNext?: () => void;
}

const ChapterReader: React.FC<ChapterReaderProps> = React.memo(({ content, chapterId, onNext }) => {
  const { dispatch } = useProgress();
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);

  // Обработчик кликов по изображениям
  useEffect(() => {
    const handleImageClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG') {
        const img = target as HTMLImageElement;
        setSelectedImage({
          src: img.src,
          alt: img.alt || ''
        });
      }
    };

    const contentElement = document.querySelector(`.${styles.content}`);
    if (contentElement) {
      contentElement.addEventListener('click', handleImageClick);
      return () => {
        contentElement.removeEventListener('click', handleImageClick);
      };
    }
  }, []);

  const findNextChapter = useCallback(() => {
    // Находим текущую главу
    const currentChapter = typedChaptersData.chapters.find(ch => {
      // Проверяем, является ли текущий ID главой или подглавой
      if (chapterId === ch.id) return true;
      return ch.sections.some(section => section.id === chapterId);
    });

    if (!currentChapter) return null;

    // Если это подглава, находим следующую подглаву в текущей главе
    if (chapterId !== currentChapter.id) {
      const currentSectionIndex = currentChapter.sections.findIndex(s => s.id === chapterId);
      if (currentSectionIndex < currentChapter.sections.length - 1) {
        // Есть следующая подглава
        const nextSection = currentChapter.sections[currentSectionIndex + 1] as Section;
        return {
          id: nextSection.id,
          title: nextSection.title,
          path: nextSection.path
        };
      }
    }

    // Если это последняя подглава или глава без подглав, переходим к следующей главе
    const currentChapterIndex = typedChaptersData.chapters.findIndex(ch => ch.id === currentChapter.id);
    if (currentChapterIndex < typedChaptersData.chapters.length - 1) {
      const nextChapter = typedChaptersData.chapters[currentChapterIndex + 1];
      // Если у следующей главы есть подглавы, берем первую подглаву
      if (nextChapter.sections && nextChapter.sections.length > 0) {
        const firstSection = nextChapter.sections[0] as Section;
        return {
          id: firstSection.id,
          title: firstSection.title,
          path: firstSection.path
        };
      }
      // Если нет подглав, берем саму главу
      return {
        id: nextChapter.id,
        title: nextChapter.title,
        path: nextChapter.path
      };
    }

    return null;
  }, [chapterId]);

  const handleComplete = useCallback(async () => {
    // Отмечаем текущую главу как завершенную
    dispatch({ type: 'COMPLETE_CHAPTER', chapterId });

    // Находим следующую главу или подглаву
    const nextChapter = findNextChapter();
    if (nextChapter && nextChapter.path) {
      try {
        const response = await fetch(nextChapter.path);
        const content = await response.text();
        
        // Небольшая задержка для анимации
        setTimeout(() => {
          dispatch({
            type: 'SET_CURRENT_CHAPTER',
            chapter: {
              id: nextChapter.id,
              title: nextChapter.title,
              content,
              timeSpent: 0,
              completed: false
            }
          });
        }, 300);
      } catch (error) {
        console.error('Error loading next chapter:', error);
      }
    }

    onNext?.();
  }, [chapterId, dispatch, findNextChapter, onNext]);

  // Очищаем HTML и разрешаем только безопасные теги и атрибуты
  const sanitizedContent = useMemo(() => {
    const config = {
      ALLOWED_TAGS: ['p', 'br', 'img', 'i', 'b', 'sup', 'sub', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'center'],
      ALLOWED_ATTR: ['class', 'src', 'alt', 'title', 'border', 'id', 'name', 'href'],
    };
    return DOMPurify.sanitize(content, config);
  }, [content]);

  const contentElement = useMemo(() => (
    <div 
      className={styles.content}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }} 
    />
  ), [sanitizedContent]);

  return (
    <div className={styles.chapterContent}>
      {contentElement}
      <button 
        className={styles.nextButton}
        onClick={handleComplete}
      >
        Далее
      </button>
      {selectedImage && (
        <ImageModal
          src={selectedImage.src}
          alt={selectedImage.alt}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
});

export default ChapterReader; 
