import styles from './ChapterReader.module.css';
import DOMPurify from 'dompurify';
import { getNextChapterToUnlock, findChapterData } from '../../utils/chapterUtils';
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
    const basePath = import.meta.env.BASE_URL || '/';
    let result = htmlContent;

    // Заменяем все пути /Feeling-Good/content/ на правильный basePath
    if (basePath !== '/Feeling-Good/') {
      result = result.replace(/src="\/Feeling-Good\/content\//g, `src="${basePath}content/`);
    }

    // Заменяем абсолютные пути /content/ на basePath + content/
    result = result.replace(/src="\/content\//g, `src="${basePath}content/`);

    return result;
  }, []);

  const findNextChapter = useCallback(() => {
    const nextId = getNextChapterToUnlock(chapterId);
    if (!nextId) return null;

    const data = findChapterData(nextId);
    if (!data) return null;

    if (data.isMainChapter) {
      return { id: data.chapter.id, title: data.chapter.title, path: data.chapter.path };
    }
    return { id: data.section!.id, title: data.section!.title, path: data.section!.path };
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
          chapterTitle={findChapterData(chapterId)?.chapter.title || 'Глава'}
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
