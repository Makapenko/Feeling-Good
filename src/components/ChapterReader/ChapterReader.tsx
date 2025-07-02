import styles from './ChapterReader.module.css';
import DOMPurify from 'dompurify';
import chaptersData from '../ListOfChapters/chapters.json';
import type { ChaptersData, Section } from '../../types/chapters.types';
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import ImageModal from './ImageModal';
import NoteModal from './NoteModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks } from '@fortawesome/free-solid-svg-icons';
import { chapterToActivitiesMap } from '../../data/activitiesMapping';
import { ACTIVITY_NAMES } from '../../constants/activities';
import { SpecialContent } from '../../types/progress.types';
import { useAppDispatch } from '../../redux/hooks';
import { loadChapter, completeChapterWithUnlock } from '../../redux/actions';
import { setSpecialContent } from '../../redux/slices/progressSlice';
import ChapterFavoriteButton from '../shared/ChapterFavoriteButton';

// TODO: иногда глава не отмечается прочитанной - перепроверить, вроде исправил, думаю глава не отображалась прочитанной, когда переходил на упражнение вместо следующей главы

// Указываем тип для импортированных данных
const typedChaptersData = chaptersData as ChaptersData;

interface ChapterReaderProps {
  content: string;
  chapterId: string;
  onNext?: () => void;
}

const ChapterReader: React.FC<ChapterReaderProps> = React.memo(({ content, chapterId, onNext }) => {
  const dispatch = useAppDispatch();
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);

  // Получаем активности, связанные с текущей главой
  const relatedActivities = useMemo(() => {
    return chapterToActivitiesMap[chapterId] || [];
  }, [chapterId]);

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

  // Обработчик кликов по сноскам/примечаниям
  useEffect(() => {
    const handleNoteClick = (e: Event) => {
      const target = e.target as HTMLElement;
      
      // Проверяем, является ли элемент ссылкой на примечание
      if (target.tagName === 'A' && target.id.startsWith('anotelink')) {
        e.preventDefault();
        
        const noteLink = target as HTMLAnchorElement;
        const noteText = noteLink.title || '';
        
        if (noteText) {
          setSelectedNote(noteText);
        }
      }
    };
    
    const contentElement = document.querySelector(`.${styles.content}`);
    if (contentElement) {
      contentElement.addEventListener('click', handleNoteClick);
      return () => {
        contentElement.removeEventListener('click', handleNoteClick);
      };
    }
  }, []);

  // Преобразуем ссылки на примечания для стилизации
  const transformNoteLinks = useCallback((htmlContent: string): string => {
    // Добавляем класс к ссылкам примечаний и оборачиваем в span для лучшего отображения на мобильных
    return htmlContent.replace(
      /<a name="anotelink([0-9]+)" id="anotelink([0-9]+)" href="(#n_[0-9]+)" title="([^"]+)">([^<]+)<\/a>/g, 
      (_match, nameNum, idNum, _href, title, text) => {
        return `<a class="${styles.noteLink}" name="anotelink${nameNum}" id="anotelink${idNum}" href="javascript:void(0)" title="${title}" aria-label="Примечание ${text}"><span class="${styles.noteLinkText}">${text}</span></a>`;
      }
    );
  }, []);

  // Функция для адаптации путей к изображениям в зависимости от окружения
  const adaptImagePaths = useCallback((htmlContent: string): string => {
    // Получаем базовый путь из окружения
    const basePath = import.meta.env.BASE_URL || '/';
    
    // 1. Обрабатываем случай, когда пути содержат /Feeling-Good/ 
    if (htmlContent.includes('src="/Feeling-Good/content/images/')) {
      // Если текущий basePath не /Feeling-Good/, то нужно исправить пути
      if (basePath !== '/Feeling-Good/') {
        // Удаляем /Feeling-Good/ и добавляем правильный basePath
        return htmlContent.replace(/src="\/Feeling-Good\/content\/images\//g, `src="${basePath}content/images/`);
      }
      // Если basePath = /Feeling-Good/, оставляем как есть
      return htmlContent;
    }
    
    // 2. Обрабатываем стандартные пути /content/images/
    if (htmlContent.includes('src="/content/images/')) {
      return htmlContent.replace(/src="\/content\/images\//g, `src="${basePath}content/images/`);
    }
    
    return htmlContent;
  }, []);

  const findNextChapter = useCallback(() => {
    // Находим текущую главу
    const currentChapter = typedChaptersData.chapters.find(ch => {
      // Проверяем, является ли текущий ID главой или подглавой
      if (chapterId === ch.id) return true;
      return ch.sections?.some(section => section.id === chapterId);
    });

    if (!currentChapter) return null;

    // Если это подглава, находим следующую подглаву в текущей главе
    if (chapterId !== currentChapter.id && currentChapter.sections) {
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
      // Если нет подглав, берем саму главу (только если у неё есть path)
      if (nextChapter.path) {
        return {
          id: nextChapter.id,
          title: nextChapter.title,
          path: nextChapter.path
        };
      }
    }

    return null;
  }, [chapterId]);

  const handleComplete = useCallback(async () => {
    // Отмечаем текущую главу как завершенную и разблокируем новый контент
    dispatch(completeChapterWithUnlock(chapterId));

    // Проверяем, находимся ли мы на мобильном устройстве
    const isMobile = window.innerWidth <= 768;

    // Находим следующую главу или подглаву
    const nextChapter = findNextChapter();
    if (nextChapter && nextChapter.id) {
      // На мобильных устройствах добавляем большую задержку
      const delay = isMobile ? 250 : 100;
      
      setTimeout(() => {
        // Сначала скроллим на самый верх
        window.scrollTo({
          top: 0,
          behavior: 'instant'
        });
        
        // Затем загружаем следующую главу
        dispatch(loadChapter(nextChapter.id));
      }, delay);
    }

    onNext?.();
  }, [chapterId, dispatch, findNextChapter, onNext]);

  // Обработчик перехода к активности
  const handleGoToActivity = useCallback((activityId: string) => {
    // Отмечаем текущую главу как завершенную и разблокируем новый контент при переходе к упражнению
    dispatch(completeChapterWithUnlock(chapterId));
    
    // Проверяем, находимся ли мы на мобильном устройстве
    const isMobile = window.innerWidth <= 768;
    
    // На мобильных сначала скроллим страницу вверх
    if (isMobile) {
      window.scrollTo({
        top: 0,
        behavior: 'instant'
      });
      
      // Затем с небольшой задержкой устанавливаем специальный контент
      setTimeout(() => {
        dispatch(setSpecialContent(activityId as SpecialContent));
      }, 10);
    } else {
      // На десктопе просто устанавливаем специальный контент
      dispatch(setSpecialContent(activityId as SpecialContent));
    }
  }, [dispatch, chapterId]);

  // Очищаем HTML, адаптируем пути к изображениям и разрешаем только безопасные теги и атрибуты
  const sanitizedContent = useMemo(() => {
    const config = {
      ALLOWED_TAGS: ['p', 'br', 'img', 'i', 'b', 'sup', 'sub', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'center'],
      ALLOWED_ATTR: ['class', 'src', 'alt', 'title', 'border', 'id', 'name', 'href'],
    };
    // Применяем санитайзер, адаптируем пути и преобразуем ссылки на примечания
    const sanitized = DOMPurify.sanitize(content, config);
    const withAdaptedPaths = adaptImagePaths(sanitized);
    return transformNoteLinks(withAdaptedPaths);
  }, [content, adaptImagePaths, transformNoteLinks]);

  const contentElement = useMemo(() => (
    <div 
      className={styles.content}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }} 
    />
  ), [sanitizedContent]);

  return (
    <div className={styles.chapterContent}>
      <div className={styles.chapterActions}>
        <ChapterFavoriteButton 
          chapterId={chapterId} 
          chapterTitle={typedChaptersData.chapters.find(ch => 
            ch.id === chapterId || ch.sections?.some(s => s.id === chapterId)
          )?.title || 'Глава'}
          className={styles.chapterFavorite}
        />
      </div>
      
      {contentElement}
      
      {relatedActivities.length > 0 && (
        <div className={styles.activityButtonsContainer}>
          {relatedActivities.map(activityId => (
            <button
              key={activityId}
              className={styles.activityButton}
              onClick={() => handleGoToActivity(activityId)}
            >
              <FontAwesomeIcon icon={faTasks} />
              {ACTIVITY_NAMES[activityId] || 'Перейти к заданию'}
            </button>
          ))}
        </div>
      )}
      
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
      
      {selectedNote && (
        <NoteModal
          content={selectedNote}
          onClose={() => setSelectedNote(null)}
        />
      )}
    </div>
  );
});

export default ChapterReader; 
