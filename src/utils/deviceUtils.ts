import { useState, useEffect } from 'react';

/**
 * Константа определяющая максимальную ширину для мобильных устройств
 */
export const MOBILE_BREAKPOINT = 768;

/**
 * Функция для проверки, является ли устройство мобильным на основе ширины экрана
 */
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= MOBILE_BREAKPOINT;
};

/**
 * Хук для определения мобильного устройства с отслеживанием изменения размера окна
 */
export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(isMobileDevice());

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(isMobileDevice());
    };

    // Проверяем при первой загрузке
    checkMobile();
    
    // Добавляем слушатель изменения размера
    window.addEventListener('resize', checkMobile);
    
    // Удаляем слушатель при размонтировании
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return isMobile;
}; 
